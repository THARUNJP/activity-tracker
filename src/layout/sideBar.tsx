"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  Activity,
  CalendarClock,
  Target,
  LogOut,
  Menu,
  X,
  ChartBar,
} from "lucide-react";
import { createClient } from "@/supabase/client";
import { showHotToast } from "@/lib/toast";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/activities", label: "Activities", icon: Activity },
  { href: "/targets", label: "Targets", icon: Target },
  {
    href: "/default-schedules",
    label: "Default Schedules",
    icon: CalendarClock,
  },
  { href: "/plan", label: "Plan", icon: ChartBar },
];

export default function Sidebar({ userEmail }: { userEmail: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  const [open, setOpen] = useState(false);

  // Close drawer on route change
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Lock body scroll when drawer is open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  async function handleSignOut() {
    const { error } = await supabase.auth.signOut();
    if (error) {
      showHotToast(error.message, "error");
      return;
    }
    showHotToast("Signed out", "success");
    router.push("/auth");
    router.refresh();
  }

  return (
    <>
      {/* Mobile top bar */}
      <header className="lg:hidden fixed top-0 left-0 right-0 h-14 bg-card border-b border-border flex items-center justify-between px-4 z-40">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-accentSoft border border-border flex items-center justify-center">
            <Activity size={16} className="text-accent" />
          </div>
          <span className="text-sm font-bold">Activity Tracker</span>
        </div>
        <button
          onClick={() => setOpen(true)}
          className="p-2 rounded-md hover:bg-[var(--bg-elevated)] transition"
          aria-label="Open menu"
        >
          <Menu size={20} className="text-secondary" />
        </button>
      </header>

      {/* Backdrop (mobile only) */}
      {open && (
        <div
          className="lg:hidden fixed inset-0 bg-black/60 z-40"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen w-64 bg-card border-r border-border flex flex-col px-4 py-6 z-50 transition-transform duration-300 ${
          open ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        <div className="mb-10 flex items-center justify-between gap-3 px-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-accentSoft border border-border flex items-center justify-center">
              <Activity size={18} className="text-accent" />
            </div>
            <div>
              <p className="text-sm font-semibold text-primary">Activity</p>
              <p className="text-sm font-semibold text-accent">Tracker</p>
            </div>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="lg:hidden p-1.5 rounded-md hover:bg-[var(--bg-elevated)] transition"
            aria-label="Close menu"
          >
            <X size={18} className="text-secondary" />
          </button>
        </div>

        <nav className="flex-1 flex flex-col gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? "bg-accentSoft text-accent"
                    : "text-secondary hover:bg-[var(--bg-elevated)] hover:text-primary"
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

        <div className="border-t border-border pt-4 mt-4">
          <div className="px-2 mb-3">
            <p className="text-xs text-muted">Signed in as</p>
            <p className="text-sm text-secondary truncate">{userEmail}</p>
          </div>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm text-secondary hover:bg-[var(--bg-elevated)] hover:text-primary transition"
          >
            <LogOut size={18} />
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
}
