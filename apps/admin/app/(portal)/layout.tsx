'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { Avatar, Spinner } from '@/components/ui';

/**
 * Everything the in-app admin tab bar reached, flattened into one sidebar.
 * The app hid half of these behind router.push(); on a wide screen they can all
 * be top level.
 */
const NAV = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/events', label: 'Events' },
  { href: '/people', label: 'People' },
  { href: '/tasks', label: 'Tasks' },
  { href: '/campus-cartel', label: 'Campus Cartel' },
  { href: '/ambassador-codes', label: 'Ambassador codes' },
  { href: '/unfiltered', label: 'Unfiltered' },
  { href: '/settings', label: 'Settings' },
];

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  const { user, status, signOut } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (status === 'signed-out') router.replace('/login');
  }, [status, router]);

  if (status !== 'signed-in' || !user) {
    return <Spinner label="Checking your access…" />;
  }

  return (
    <div className="flex min-h-screen">
      <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col border-r border-line bg-surface px-4 py-6 md:flex">
        <div className="mb-8 px-2">
          <span className="text-lg font-black tracking-tight text-ink">UPSHOT</span>
          <span className="ml-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-muted">
            Admin
          </span>
        </div>

        <nav className="flex-1 space-y-1">
          {NAV.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`block rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${
                  active ? 'bg-lime text-ink' : 'text-muted hover:bg-surfaceAlt hover:text-ink'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-6 border-t border-line pt-4">
          <div className="flex items-center gap-2.5 px-1">
            <Avatar name={user.full_name} size={34} />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-ink">{user.full_name || 'Admin'}</p>
              <p className="truncate text-xs text-muted">{user.email}</p>
            </div>
          </div>
          <button
            onClick={() => void signOut()}
            className="mt-3 w-full rounded-lg px-3 py-2 text-left text-sm font-semibold text-muted hover:bg-surfaceAlt hover:text-danger"
          >
            Sign out
          </button>
        </div>
      </aside>

      {/* Narrow screens get the same destinations as a scrolling strip. */}
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="sticky top-0 z-10 flex gap-1 overflow-x-auto border-b border-line bg-surface px-3 py-2 md:hidden">
          {NAV.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-semibold ${
                  active ? 'bg-ink text-white' : 'text-muted'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>

        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 md:px-8">{children}</main>
      </div>
    </div>
  );
}
