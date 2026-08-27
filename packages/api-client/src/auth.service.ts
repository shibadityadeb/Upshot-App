import type { SupabaseClient } from '@supabase/supabase-js';
import type {
  ApiResponse,
  User,
  UserRole,
  RegisterStudentPayload,
  RegisterHostPayload,
} from '@upshot/types';

export class AuthService {
  constructor(private supabase: SupabaseClient) {}

  async signIn(email: string, password: string): Promise<ApiResponse<{ user: User }>> {
    const { error } = await this.supabase.auth.signInWithPassword({ email, password });
    if (error) return { data: null, error: { code: error.name, message: error.message } };
    return this.getCurrentUser();
  }

  async signUp(
    email: string,
    password: string,
    fullName: string,
    role: UserRole,
  ): Promise<ApiResponse<{ user: User }>> {
    const { error } = await this.supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName, role } },
    });
    if (error) return { data: null, error: { code: error.name, message: error.message } };
    return this.getCurrentUser();
  }

  async registerStudent(payload: RegisterStudentPayload): Promise<ApiResponse<{ user: User }>> {
    const { email, password, full_name, college, course, year_of_study, ambassador_code } = payload;

    const { data: authData, error: authError } = await this.supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name, role: 'student' as UserRole } },
    });
    if (authError) return { data: null, error: { code: authError.name, message: authError.message } };

    const userId = authData.user?.id;
    if (!userId) return { data: null, error: { code: 'NO_USER', message: 'User creation failed' } };

    try {
      let ambassadorId: string | null = null;
      let validCodeUsed = false;
      let rewardAmbassador = false;
      if (ambassador_code) {
        const cleanCode = ambassador_code.trim().toUpperCase();
        // First try the new ambassador_codes table
        const { data: codeRecord } = await this.supabase
          .from('ambassador_codes')
          .select('id, assigned_to, issued_by, code_type')
          .eq('code', cleanCode)
          .eq('is_active', true)
          .eq('is_claimed', false)
          .maybeSingle();
        if (codeRecord) {
          validCodeUsed = true;
          // Claim the code
          await this.supabase
            .from('ambassador_codes')
            .update({ is_claimed: true, assigned_to: userId, claimed_at: new Date().toISOString() })
            .eq('id', codeRecord.id);

          // Resolve issuer's ambassador record ID for referred_by FK
          if (codeRecord.issued_by) {
            const { data: issuerAmb } = await this.supabase
              .from('ambassadors')
              .select('id, referral_count')
              .eq('user_id', codeRecord.issued_by)
              .maybeSingle();
            if (issuerAmb) {
              ambassadorId = issuerAmb.id;
              await this.supabase
                .from('ambassadors')
                .update({ referral_count: issuerAmb.referral_count + 1 })
                .eq('id', issuerAmb.id);
            }
          }

          // Make the registering user an ambassador with their own unique code
          const { data: existingAmb } = await this.supabase
            .from('ambassadors').select('id').eq('user_id', userId).maybeSingle();
          if (!existingAmb) {
            // referral_code is minted by the database (migration 025) — unique
            // across both personal and admin-issued codes. No client fallback.
            await this.supabase.from('ambassadors').insert({
              user_id: userId,
              code_type: codeRecord.code_type,
              issued_by: codeRecord.issued_by,
            });
            await this.supabase.from('profiles').update({ role: 'ambassador' }).eq('id', userId);
          }
        } else {
          // Personal referral code from ambassadors table — user stays a student
          const { data: ambassador } = await this.supabase
            .from('ambassadors')
            .select('id, referral_count')
            .eq('referral_code', cleanCode)
            .eq('is_active', true)
            .maybeSingle();
          if (ambassador) {
            validCodeUsed = true;
            rewardAmbassador = true;
            ambassadorId = ambassador.id;
            await this.supabase
              .from('ambassadors')
              .update({ referral_count: ambassador.referral_count + 1 })
              .eq('id', ambassadorId);
          }
        }
      }

      const cleanedCode = ambassador_code ? ambassador_code.trim().toUpperCase() : null;

      const { error: studentError } = await this.supabase.from('students').insert({
        user_id: userId,
        college: college ?? null,
        course: course ?? null,
        year_of_study: year_of_study ?? null,
        ambassador_code: cleanedCode,
        referred_by: ambassadorId,
      });
      if (studentError) throw new Error(studentError.message);

      // Auto-approve into Campus Cartel if registered with a valid ambassador code
      if (validCodeUsed) {
        await this.supabase.from('campus_cartel_members').insert({
          user_id: userId,
          ambassador_code: cleanedCode,
          college: college ?? null,
          course: course ?? null,
          year_of_study: year_of_study ?? null,
          status: 'approved',
          is_active: true,
        });
      }

      // Award 20 coins to the ambassador for each successful referral
      if (rewardAmbassador && ambassadorId) {
        await this.supabase.rpc('award_referral_coins', {
          referrer_ambassador_id: ambassadorId,
          referred_user_id: userId,
          coin_amount: 20,
        });
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Student insert failed';
      return { data: null, error: { code: 'STUDENT_INSERT', message: msg } };
    }

    return this.getCurrentUser();
  }

  /**
   * Register an event host. Creates the auth user with role 'host' (the
   * handle_new_user trigger copies that into profiles), then stores the
   * organisation and position details in `hosts`.
   */
  async registerHost(payload: RegisterHostPayload): Promise<ApiResponse<{ user: User }>> {
    const { email, password, full_name, contact_phone } = payload;

    const { data: authData, error: authError } = await this.supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name, role: 'host' as UserRole } },
    });
    if (authError) return { data: null, error: { code: authError.name, message: authError.message } };

    const userId = authData.user?.id;
    if (!userId) return { data: null, error: { code: 'NO_USER', message: 'User creation failed' } };

    const { error: hostError } = await this.supabase.from('hosts').insert({
      user_id: userId,
      org_legal_name: payload.org_legal_name,
      org_city: payload.org_city,
      org_state: payload.org_state,
      org_sector: payload.org_sector,
      org_website: payload.org_website ?? null,
      designation: payload.designation,
      department: payload.department ?? null,
      contact_phone: contact_phone,
    });
    if (hostError) {
      return { data: null, error: { code: 'HOST_INSERT', message: hostError.message } };
    }

    // Keep the phone on the profile too so event forms can prefill it.
    await this.supabase.from('profiles').update({ phone: contact_phone }).eq('id', userId);

    return this.getCurrentUser();
  }

  async signOut(): Promise<ApiResponse<null>> {
    const { error } = await this.supabase.auth.signOut();
    if (error) return { data: null, error: { code: error.name, message: error.message } };
    return { data: null, error: null };
  }

  async getSession() {
    const { data, error } = await this.supabase.auth.getSession();
    if (error) return { data: null, error: { code: error.name, message: error.message } };
    return { data: data.session, error: null };
  }

  async getCurrentUser(): Promise<ApiResponse<{ user: User }>> {
    const { data: sessionData } = await this.supabase.auth.getSession();
    const authUser = sessionData.session?.user;
    if (!authUser) return { data: null, error: { code: 'NO_SESSION', message: 'Not authenticated' } };

    const { data: profile } = await this.supabase
      .from('profiles')
      .select('*')
      .eq('id', authUser.id)
      .single();

    if (!profile) {
      // Profile trigger may not have fired yet — build from auth metadata
      const fallback: User = {
        id: authUser.id,
        email: authUser.email ?? '',
        full_name: authUser.user_metadata?.full_name ?? '',
        avatar_url: null,
        role: (authUser.user_metadata?.role as UserRole) ?? 'people',
        phone: null,
        is_active: true,
        created_at: authUser.created_at,
        updated_at: authUser.created_at,
      };
      return { data: { user: fallback }, error: null };
    }

    return { data: { user: profile as unknown as User }, error: null };
  }

  async updateProfile(
    userId: string,
    updates: Partial<Pick<User, 'full_name' | 'avatar_url' | 'phone'>>,
  ): Promise<ApiResponse<{ user: User }>> {
    const { data: profile, error } = await this.supabase
      .from('profiles')
      .update({
        full_name: updates.full_name,
        avatar_url: updates.avatar_url,
        phone: updates.phone,
      })
      .eq('id', userId)
      .select()
      .single();
    if (error) return { data: null, error: { code: 'UPDATE_FAILED', message: error.message } };
    return { data: { user: profile as unknown as User }, error: null };
  }

  async resetPassword(email: string): Promise<ApiResponse<null>> {
    const { error } = await this.supabase.auth.resetPasswordForEmail(email);
    if (error) return { data: null, error: { code: error.name, message: error.message } };
    return { data: null, error: null };
  }

  /**
   * Build the provider consent URL without opening a browser.
   *
   * The app layer owns the browser session (expo-web-browser); this package stays
   * free of Expo dependencies. Supabase performs the code/token exchange with
   * Google server-side using the OAuth client secret held in the Supabase project,
   * so no client secret is ever present in the React Native bundle.
   */
  async getOAuthUrl(
    provider: 'google',
    redirectTo: string,
  ): Promise<ApiResponse<{ url: string }>> {
    // No `skipBrowserRedirect` here: it appends `skip_http_redirect=true`, which
    // makes Supabase answer the authorize request with a JSON body instead of a
    // 302 to Google — the in-app browser would render the JSON rather than the
    // consent screen. It is also unnecessary, because supabase-js only performs
    // the automatic redirect when `isBrowser()` is true, which it never is here.
    const { data, error } = await this.supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo,
        queryParams: { prompt: 'select_account' },
      },
    });
    if (error) return { data: null, error: { code: error.name, message: error.message } };
    if (!data?.url) {
      return { data: null, error: { code: 'NO_URL', message: 'Could not start Google sign-in.' } };
    }
    return { data: { url: data.url }, error: null };
  }

  /**
   * Ask why a consent window closed without a redirect.
   *
   * A user cancelling and a misconfigured provider are indistinguishable from the
   * browser result alone — both come back as `cancel`. A configured provider
   * answers the authorize URL with a redirect; an unconfigured one answers 4xx and
   * a JSON body (e.g. "Unsupported provider: provider is not enabled"), which the
   * browser renders as a raw blob. Called only after a cancel, so the normal
   * sign-in path costs no extra round-trip.
   *
   * Returns null when nothing is wrong, so a genuine cancellation stays silent.
   */
  async checkOAuthProviderError(url: string): Promise<string | null> {
    try {
      const res = await fetch(url, { method: 'GET', redirect: 'manual' });
      if (res.status < 400) return null;
      const body = await res.text();
      const parsed = JSON.parse(body) as {
        msg?: string;
        error_description?: string;
        error?: string;
      };
      return parsed.msg ?? parsed.error_description ?? parsed.error ?? null;
    } catch {
      // Network failure or a non-JSON body — nothing useful to report.
      return null;
    }
  }

  /**
   * Turn an auth deep link into a session.
   *
   * Covers both shapes Supabase can return: `?code=` (PKCE) and the implicit
   * `#access_token=&refresh_token=` fragment, plus provider errors delivered in
   * either position. Used by the OAuth callback and the password-recovery link.
   */
  async completeAuthFromUrl(url: string): Promise<ApiResponse<{ user: User }>> {
    const params = parseAuthUrlParams(url);

    const providerError = params.error_description || params.error;
    if (providerError) {
      return { data: null, error: { code: params.error ?? 'OAUTH_ERROR', message: providerError } };
    }

    if (params.code) {
      const { error } = await this.supabase.auth.exchangeCodeForSession(params.code);
      if (error) return { data: null, error: { code: error.name, message: error.message } };
      return this.getCurrentUser();
    }

    if (params.access_token && params.refresh_token) {
      const { error } = await this.supabase.auth.setSession({
        access_token: params.access_token,
        refresh_token: params.refresh_token,
      });
      if (error) return { data: null, error: { code: error.name, message: error.message } };
      return this.getCurrentUser();
    }

    return {
      data: null,
      error: { code: 'NO_CREDENTIALS', message: 'This link is invalid or has already been used.' },
    };
  }

}

/**
 * Read auth params from a deep link, checking both the query string and the
 * fragment — Supabase uses the fragment for implicit tokens and the query for
 * PKCE codes and provider errors.
 */
function parseAuthUrlParams(url: string): Record<string, string> {
  const out: Record<string, string> = {};
  const collect = (raw: string) => {
    if (!raw) return;
    for (const pair of raw.replace(/^[?#]/, '').split('&')) {
      if (!pair) continue;
      const idx = pair.indexOf('=');
      const key = decodeURIComponent(idx === -1 ? pair : pair.slice(0, idx));
      const value = idx === -1 ? '' : decodeURIComponent(pair.slice(idx + 1).replace(/\+/g, ' '));
      if (key) out[key] = value;
    }
  };

  const hashIdx = url.indexOf('#');
  const withoutHash = hashIdx === -1 ? url : url.slice(0, hashIdx);
  if (hashIdx !== -1) collect(url.slice(hashIdx));

  const queryIdx = withoutHash.indexOf('?');
  if (queryIdx !== -1) collect(withoutHash.slice(queryIdx));

  return out;
}
