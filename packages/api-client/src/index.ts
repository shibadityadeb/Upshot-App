export { getSupabaseClient, resetClients } from './client';
export { AuthService } from './auth.service';
export { EventsService } from './events.service';
export { TasksService } from './tasks.service';
export { CoinsService } from './coins.service';
export { AmbassadorService } from './ambassador.service';

import { getSupabaseClient } from './client';
import { AuthService } from './auth.service';
import { EventsService } from './events.service';
import { TasksService } from './tasks.service';
import { CoinsService } from './coins.service';
import { AmbassadorService } from './ambassador.service';

export function createApiClient(supabaseUrl?: string, supabaseAnonKey?: string) {
  const supabase = getSupabaseClient(supabaseUrl, supabaseAnonKey);
  return {
    supabase,
    auth: new AuthService(supabase),
    events: new EventsService(supabase),
    tasks: new TasksService(supabase),
    coins: new CoinsService(supabase),
    ambassadors: new AmbassadorService(supabase),
  };
}
