"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  Activity,
  CalendarClock,
  Target,
  LogOut,
} from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/activities", label: "Activities", icon: Activity },
  { href: "/targets", label: "Targets", icon: Target },
  {
    href: "/default-schedules",
    label: "Default Schedules",
    icon: CalendarClock,
  },
];

export default function Sidebar({ userEmail }: { userEmail: string }) {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-card border-r border-border flex flex-col px-4 py-6 z-50">
      {/* Logo */}
      <div className="mb-10 flex items-center gap-3 px-2">
        <div className="w-10 h-10 rounded-xl bg-accentSoft border border-border flex items-center justify-center">
          <Activity size={18} className="text-accent" />
        </div>
        <div>
          <p className="text-sm font-semibold text-primary">Activity</p>
          <p className="text-sm font-semibold text-accent">Tracker</p>
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
              className={`group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all
              ${
                isActive
                  ? "bg-accentSoft text-accent"
                  : "text-secondary hover:bg-hover hover:text-primary"
              }`}
            >
              <Icon
                size={18}
                className={`transition ${
                  isActive
                    ? "text-accent"
                    : "text-muted group-hover:text-primary"
                }`}
              />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* User */}
      <div className="border-t border-border pt-4 mt-4">
        <div className="px-2 mb-3">
          <p className="text-xs text-muted">Signed in as</p>
          <p className="text-sm text-secondary truncate">{userEmail}</p>
        </div>

        <button
          onClick={() => router.push("/auth")}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm text-secondary hover:bg-hover hover:text-primary transition"
        >
          <LogOut size={18} />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
