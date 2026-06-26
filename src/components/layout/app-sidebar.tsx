"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { navigationItems } from "@/lib/constants/navigation";
import { ScrollText } from "lucide-react";

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex lg:flex-col lg:w-64 border-r bg-white">
      <div className="flex items-center gap-2 px-6 py-5 border-b">
        <ScrollText className="h-6 w-6 text-teal-600" />
        <span className="font-semibold text-lg text-slate-800">Clínica de la Vida</span>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navigationItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-teal-50 text-teal-700"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.title}
            </Link>
          );
        })}
      </nav>
      <div className="px-6 py-4 border-t text-xs text-slate-400">
        Clínica de la Vida v1.0
      </div>
    </aside>
  );
}
