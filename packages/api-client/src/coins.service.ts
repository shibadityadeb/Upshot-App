import type { SupabaseClient } from '@supabase/supabase-js';
import type {
  ApiResponse,
  WalletBalance,
  CoinTransaction,
  PaginatedResponse,
} from '@upshot/types';

export class CoinsService {
  constructor(private supabase: SupabaseClient) {}

  async getWalletBalance(userId: string): Promise<ApiResponse<WalletBalance>> {
    const { data, error } = await this.supabase
      .from('wallet_balances')
      .select('*')
      .eq('user_id', userId)
      .single();
    if (error || !data) return { data: null, error: { code: 'NOT_FOUND', message: 'Wallet not found' } };
    return { data: data as unknown as WalletBalance, error: null };
  }

  async getTransactionHistory(
    userId: string,
    page: number = 1,
    perPage: number = 20,
  ): Promise<ApiResponse<PaginatedResponse<CoinTransaction>>> {
    const { data, error, count } = await this.supabase
      .from('coin_transactions')
      .select('*', { count: 'exact' })
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .range((page - 1) * perPage, page * perPage - 1);

    if (error) return { data: null, error: { code: 'FETCH_FAILED', message: error.message } };

    return {
      data: {
        data: (data ?? []) as unknown as CoinTransaction[],
        count: count ?? 0,
        page,
        per_page: perPage,
        total_pages: Math.ceil((count ?? 0) / perPage),
      },
      error: null,
    };
  }

  async addBonusCoins(
    adminId: string,
    userId: string,
    amount: number,
    description: string,
  ): Promise<ApiResponse<CoinTransaction>> {
    const { data, error } = await this.supabase
      .from('coin_transactions')
      .insert({
        user_id: userId,
        type: 'bonus',
        amount,
        description,
        reference_id: adminId,
        reference_type: 'admin_bonus',
      })
      .select()
      .single();
    if (error) return { data: null, error: { code: 'CREATE_FAILED', message: error.message } };
    return { data: data as unknown as CoinTransaction, error: null };
  }

  async getLeaderboard(limit: number = 20): Promise<ApiResponse<WalletBalance[]>> {
    const { data, error } = await this.supabase
      .from('wallet_balances')
      .select('*, profiles(*)')
      .order('total_earned', { ascending: false })
      .limit(limit);
    if (error) return { data: null, error: { code: 'FETCH_FAILED', message: error.message } };
    return { data: (data ?? []) as unknown as WalletBalance[], error: null };
  }
}
