import type { PrismaClient } from '@upshot/database';
import type {
  ApiResponse,
  WalletBalance,
  CoinTransaction,
  PaginatedResponse,
} from '@upshot/types';

export class CoinsService {
  constructor(private prisma: PrismaClient) {}

  async getWalletBalance(userId: string): Promise<ApiResponse<WalletBalance>> {
    const balance = await this.prisma.walletBalance.findUnique({
      where: { userId },
    });
    if (!balance) return { data: null, error: { code: 'NOT_FOUND', message: 'Wallet not found' } };
    return { data: balance as unknown as WalletBalance, error: null };
  }

  async getTransactionHistory(
    userId: string,
    page: number = 1,
    perPage: number = 20,
  ): Promise<ApiResponse<PaginatedResponse<CoinTransaction>>> {
    const where = { userId };

    const [data, count] = await Promise.all([
      this.prisma.coinTransaction.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * perPage,
        take: perPage,
      }),
      this.prisma.coinTransaction.count({ where }),
    ]);

    return {
      data: {
        data: data as unknown as CoinTransaction[],
        count,
        page,
        per_page: perPage,
        total_pages: Math.ceil(count / perPage),
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
    const transaction = await this.prisma.coinTransaction.create({
      data: {
        userId,
        type: 'bonus',
        amount,
        description,
        referenceId: adminId,
        referenceType: 'admin_bonus',
      },
    });
    return { data: transaction as unknown as CoinTransaction, error: null };
  }

  async getLeaderboard(limit: number = 20): Promise<ApiResponse<WalletBalance[]>> {
    const balances = await this.prisma.walletBalance.findMany({
      include: { user: true },
      orderBy: { totalEarned: 'desc' },
      take: limit,
    });
    return { data: balances as unknown as WalletBalance[], error: null };
  }
}
