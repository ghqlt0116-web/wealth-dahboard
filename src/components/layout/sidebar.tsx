"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Wallet, 
  Newspaper, 
  Settings,
  BrainCircuit
} from "lucide-react";
import { cn } from "@/lib/utils";

const routes = [
  {
    label: "대시보드",
    icon: LayoutDashboard,
    href: "/",
    color: "text-sky-500",
  },
  {
    label: "자산 포트폴리오",
    icon: Wallet,
    href: "/portfolio",
    color: "text-emerald-500",
  },
  {
    label: "투자 뉴스 & DART",
    icon: Newspaper,
    href: "/news",
    color: "text-orange-500",
  },
  {
    label: "AI 인사이트",
    icon: BrainCircuit,
    href: "/ai-insights",
    color: "text-purple-500",
  },
  {
    label: "설정",
    icon: Settings,
    href: "/settings",
    color: "text-gray-400",
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="space-y-4 py-4 flex flex-col h-full bg-[#111827] text-white border-r border-gray-800">
      <div className="px-3 py-2 flex-1">
        <Link href="/" className="flex items-center pl-3 mb-14">
          <div className="relative w-8 h-8 mr-4 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
            <Wallet className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-200 to-white">
            Wealth AI
          </h1>
        </Link>
        <div className="space-y-1">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-white hover:bg-white/10 rounded-lg transition",
                pathname === route.href ? "text-white bg-white/10" : "text-zinc-400"
              )}
            >
              <div className="flex items-center flex-1">
                <route.icon className={cn("h-5 w-5 mr-3", route.color)} />
                {route.label}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
