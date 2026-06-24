import type { PrismaClient } from '@upshot/database';
import type { ApiResponse, Ambassador, Student, AmbassadorTier } from '@upshot/types';

export class AmbassadorService {
  constructor(private prisma: PrismaClient) {}

  async getMyAmbassadorProfile(userId: string): Promise<ApiResponse<Ambassador>> {
    const ambassador = await this.prisma.ambassador.findUnique({
      where: { userId },
      include: { user: true },
    });
    if (!ambassador) return { data: null, error: { code: 'NOT_FOUND', message: 'Ambassador not found' } };
    return { data: ambassador as unknown as Ambassador, error: null };
  }

  async getAllAmbassadors(): Promise<ApiResponse<Ambassador[]>> {
    const ambassadors = await this.prisma.ambassador.findMany({
      include: { user: true },
      orderBy: { totalCoinsEarned: 'desc' },
    });
    return { data: ambassadors as unknown as Ambassador[], error: null };
  }

  async createAmbassador(userId: string, fullName: string): Promise<ApiResponse<Ambassador>> {
    // Generate referral code via raw SQL (uses the DB function)
    const [result] = await this.prisma.$queryRaw<[{ generate_referral_code: string }]>`
      SELECT generate_referral_code(${fullName})
    `;
    const referralCode = result.generate_referral_code;

    const [ambassador] = await this.prisma.$transaction([
      this.prisma.ambassador.create({
        data: {
          userId,
          referralCode,
          referralCount: 0,
          totalCoinsEarned: 0,
          tier: 'bronze',
          isActive: true,
        },
        include: { user: true },
      }),
      this.prisma.profile.update({
        where: { id: userId },
        data: { role: 'ambassador' },
      }),
    ]);

    return { data: ambassador as unknown as Ambassador, error: null };
  }

  async validateReferralCode(code: string): Promise<ApiResponse<{ valid: boolean; ambassador_id: string | null }>> {
    const ambassador = await this.prisma.ambassador.findFirst({
      where: { referralCode: code, isActive: true },
      select: { id: true },
    });
    if (!ambassador) return { data: { valid: false, ambassador_id: null }, error: null };
    return { data: { valid: true, ambassador_id: ambassador.id }, error: null };
  }

  async updateAmbassadorTier(ambassadorId: string): Promise<ApiResponse<Ambassador>> {
    const ambassador = await this.prisma.ambassador.findUnique({
      where: { id: ambassadorId },
      select: { totalCoinsEarned: true },
    });
    if (!ambassador) return { data: null, error: { code: 'NOT_FOUND', message: 'Ambassador not found' } };

    const earned = ambassador.totalCoinsEarned;
    let tier: AmbassadorTier;
    if (earned >= 10000) tier = 'platinum';
    else if (earned >= 5000) tier = 'gold';
    else if (earned >= 2000) tier = 'silver';
    else tier = 'bronze';

    const updated = await this.prisma.ambassador.update({
      where: { id: ambassadorId },
      data: { tier: tier as any },
      include: { user: true },
    });
    return { data: updated as unknown as Ambassador, error: null };
  }

  async deactivateAmbassador(ambassadorId: string): Promise<ApiResponse<Ambassador>> {
    const updated = await this.prisma.ambassador.update({
      where: { id: ambassadorId },
      data: { isActive: false },
    });
    return { data: updated as unknown as Ambassador, error: null };
  }

  async getAmbassadorStudents(ambassadorId: string): Promise<ApiResponse<Student[]>> {
    const students = await this.prisma.student.findMany({
      where: { referredBy: ambassadorId },
      include: { user: true },
      orderBy: { createdAt: 'desc' },
    });
    return { data: students as unknown as Student[], error: null };
  }
}
