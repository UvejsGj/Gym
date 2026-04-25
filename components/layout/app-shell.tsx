"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Activity, CalendarDays, Dumbbell, Home, LineChart, Scale, Settings, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/dashboard", label: "Dashboard", icon: Home },
  { href: "/workouts", label: "Workouts", icon: Dumbbell },
  { href: "/history", label: "History", icon: CalendarDays },
  { href: "/exercises", label: "Exercises", icon: Activity },
  { href: "/progress", label: "Progress", icon: LineChart },
  { href: "/body-weight", label: "Body Weight", icon: Scale },
  { href: "/records", label: "Records", icon: Trophy },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto grid max-w-7xl grid-cols-1 md:grid-cols-[240px_1fr]">
        <aside className="hidden border-r p-4 md:block">
          <p className="mb-4 text-lg font-semibold">Gym Tracker</p>
          <nav className="flex flex-col gap-1">
            {nav.map((item) => (
              <Link key={item.href} href={item.href} className={cn("flex items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-muted", pathname.startsWith(item.href) && "bg-muted")}>
                <item.icon />
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>
        <main className="p-4 pb-20 md:p-6">{children}</main>
      </div>
      <nav className="fixed inset-x-0 bottom-0 border-t bg-background p-2 md:hidden">
        <div className="grid grid-cols-4 gap-1">
          {nav.slice(0, 8).map((item) => (
            <Link key={item.href} href={item.href} className={cn("flex flex-col items-center rounded-md py-2 text-[11px] hover:bg-muted", pathname.startsWith(item.href) && "bg-muted")}>
              <item.icon />
              {item.label}
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}
