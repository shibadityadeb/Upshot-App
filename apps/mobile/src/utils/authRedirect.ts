import * as Linking from 'expo-linking';

/**
 * Where Supabase sends the browser back to after Google consent.
 *
 * `Linking.createURL` resolves to whatever shape the app is running under:
 * `exp://<host>:8081/--/` in Expo Go, `upshot://` in a standalone build (from
 * `scheme` in app.json). Points at the app root rather than a dedicated route —
 * `WebBrowser.openAuthSessionAsync` intercepts the redirect and hands the URL back
 * directly, so no callback screen needs to exist, and a stray delivery still lands
 * somewhere valid instead of on the not-found screen.
 *
 * Every value this can produce must be allow-listed in
 * Supabase → Authentication → URL Configuration → Redirect URLs.
 */
export function getOAuthRedirectUrl(): string {
  return Linking.createURL('/');
}
