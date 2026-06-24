export { getSupabaseClient, getPrismaClient, resetClients } from './client';
export { AuthService } from './auth.service';
export { EventsService } from './events.service';
export { TasksService } from './tasks.service';
export { CoinsService } from './coins.service';
export { AmbassadorService } from './ambassador.service';

import { getSupabaseClient, getPrismaClient } from './client';
import { AuthService } from './auth.service';
import { EventsService } from './events.service';
import { TasksService } from './tasks.service';
import { CoinsService } from './coins.service';
import { AmbassadorService } from './ambassador.service';

export function createApiClient(supabaseUrl?: string, supabaseAnonKey?: string) {
  const supabase = getSupabaseClient(supabaseUrl, supabaseAnonKey);
  const prisma = getPrismaClient();
  return {
    supabase,
    prisma,
    auth: new AuthService(supabase, prisma),
    events: new EventsService(prisma),
    tasks: new TasksService(prisma),
    coins: new CoinsService(prisma),
    ambassadors: new AmbassadorService(prisma),
  };
}
