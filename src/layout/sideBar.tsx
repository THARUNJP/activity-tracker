"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  Activity,
  Settings,
  Target,
  LogOut,
} from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/activities", label: "Activities", icon: Activity },
  { href: "/targets", label: "Targets", icon: Target },
  { href: "/settings", label: "Settings", icon: Settings },
];

export default function Sidebar({ userEmail }: { userEmail: string }) {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <aside className="fixed left-0 top-0 h-screen w-60 bg-[var(--bg-card)] border-r border-[var(--border)] flex flex-col p-6 z-50">
      
      {/* Logo */}
      <div className="mb-8 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-[var(--accent-dim)] border border-[var(--accent)] flex items-center justify-center">
          <Activity size={18} />
        </div>
        <div className="leading-tight">
          <p className="font-extrabold text-sm">Activity</p>
          <p className="font-extrabold text-sm text-[var(--accent-light)]">
            Tracker
          </p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 flex flex-col gap-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition ${
                isActive
                  ? "bg-[var(--accent-dim)] text-[var(--accent)]"
                  : "text-[var(--text-secondary)] hover:bg-[var(--hover)]"
              }`}
            >
              <Icon size={18} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* User */}
      <div className="border-t border-[var(--border)] pt-4 mt-4">
        <div className="mb-3 px-1">
          <p className="text-xs text-[var(--text-muted)]">Signed in as</p>
          <p className="text-sm text-[var(--text-secondary)] truncate">
            {userEmail}
          </p>
        </div>

        <button
          onClick={() => {
            // TODO: connect supabase signOut
            router.push("/auth");
          }}
          className="flex items-center gap-3 w-full px-3 py-2 rounded-md text-sm text-[var(--text-secondary)] hover:bg-[var(--hover)] transition"
        >
          <LogOut size={18} />
          Sign Out
        </button>
      </div>
    </aside>
  );
}