export { getSupabaseClient, resetClients } from './client';
export { AuthService } from './auth.service';
export { EventsService } from './events.service';
export { TasksService } from './tasks.service';
export { CoinsService } from './coins.service';
export { AmbassadorService } from './ambassador.service';
export { VerticalsService } from './verticals.service';
export { WorkforceService } from './workforce.service';
export { HostingService } from './hosting.service';

import { getSupabaseClient } from './client';
import { AuthService } from './auth.service';
import { EventsService } from './events.service';
import { TasksService } from './tasks.service';
import { CoinsService } from './coins.service';
import { AmbassadorService } from './ambassador.service';
import { VerticalsService } from './verticals.service';
import { WorkforceService } from './workforce.service';
import { HostingService } from './hosting.service';

export function createApiClient(supabaseUrl?: string, supabaseAnonKey?: string) {
  const supabase = getSupabaseClient(supabaseUrl, supabaseAnonKey);
  return {
    supabase,
    auth: new AuthService(supabase),
    events: new EventsService(supabase),
    tasks: new TasksService(supabase),
    coins: new CoinsService(supabase),
    ambassadors: new AmbassadorService(supabase),
    verticals: new VerticalsService(supabase),
    workforce: new WorkforceService(supabase),
    hosting: new HostingService(supabase),
  };
}
