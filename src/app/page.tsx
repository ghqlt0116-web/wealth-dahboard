"use client";

import Link from "next/link";
import { 
  ArrowUpRight, 
  Wallet,
  PieChart,
  BrainCircuit,
  Newspaper,
  ExternalLink,
  TrendingUp,
  Building,
  Landmark,
  Coins,
  ChevronRight
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Dashboard() {
  return (
    <div className="flex-1 space-y-6 md:space-y-8 pb-10">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white mb-1">
            Wealth Hub
          </h1>
          <p className="text-zinc-400 text-sm max-w-xl">
            자산 포트폴리오, 인공지능 투자 인사이트, 실시간 경제 뉴스를 한 곳에서 관리하세요.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <a 
            href="http://ghqlt0116.iptime.org:3000" 
            target="_blank" 
            rel="noopener noreferrer"
          >
            <Button className="bg-sky-500/10 text-sky-400 hover:bg-sky-500/20 border border-sky-500/20 font-medium flex items-center gap-2">
              <ExternalLink className="w-4 h-4" />
              가계부 열기
            </Button>
          </a>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Portfolio Overview Widget */}
        <Link href="/portfolio" className="lg:col-span-2 group">
          <Card className="h-full bg-zinc-900/50 border-zinc-800 backdrop-blur-xl group-hover:border-emerald-500/30 group-hover:bg-zinc-900/80 transition-all duration-300 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-32 bg-emerald-500/5 rounded-full blur-3xl -mr-16 -mt-16 transition-all duration-500 group-hover:bg-emerald-500/10" />
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-zinc-100">
                  <Wallet className="w-5 h-5 text-emerald-400" />
                  자산 포트폴리오 요약
                </CardTitle>
                <ArrowUpRight className="w-5 h-5 text-zinc-500 group-hover:text-emerald-400 transition-colors" />
              </div>
              <CardDescription className="text-zinc-400">등록된 전체 자산의 현황을 확인합니다.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mt-2 mb-6">
                <p className="text-sm font-medium text-zinc-500 mb-1">총 자산 평가액</p>
                <div className="flex items-baseline gap-2">
                  <h2 className="text-4xl font-black text-white tracking-tight">₩ 0</h2>
                  <span className="text-sm text-emerald-400 font-medium bg-emerald-400/10 px-2 py-0.5 rounded-full">+0.0%</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 border-t border-zinc-800 pt-5 mt-5">
                <div>
                  <div className="flex items-center gap-2 text-sm text-zinc-400 mb-1">
                    <Building className="w-3.5 h-3.5" />
                    부동산
                  </div>
                  <p className="font-semibold text-zinc-200">₩ 0</p>
                </div>
                <div>
                  <div className="flex items-center gap-2 text-sm text-zinc-400 mb-1">
                    <TrendingUp className="w-3.5 h-3.5" />
                    주식/펀드
                  </div>
                  <p className="font-semibold text-zinc-200">₩ 0</p>
                </div>
                <div>
                  <div className="flex items-center gap-2 text-sm text-zinc-400 mb-1">
                    <Landmark className="w-3.5 h-3.5" />
                    현금성 자산
                  </div>
                  <p className="font-semibold text-zinc-200">₩ 0</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>

        {/* AI Insights Widget */}
        <Link href="/ai-insights" className="group">
          <Card className="h-full bg-zinc-900/50 border-zinc-800 backdrop-blur-xl group-hover:border-indigo-500/30 group-hover:bg-zinc-900/80 transition-all duration-300 relative overflow-hidden flex flex-col">
            <div className="absolute top-0 right-0 p-32 bg-indigo-500/5 rounded-full blur-3xl -mr-16 -mt-16 transition-all duration-500 group-hover:bg-indigo-500/10" />
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-zinc-100">
                  <BrainCircuit className="w-5 h-5 text-indigo-400" />
                  AI 투자 인사이트
                </CardTitle>
                <ArrowUpRight className="w-5 h-5 text-zinc-500 group-hover:text-indigo-400 transition-colors" />
              </div>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col justify-center">
              <div className="bg-zinc-950/50 rounded-xl p-4 border border-zinc-800/50 relative">
                <div className="absolute -left-[1px] top-4 bottom-4 w-[2px] bg-indigo-500 rounded-r-full" />
                <p className="text-sm text-zinc-300 leading-relaxed">
                  "현재 시장의 변동성이 큽니다. 현금 비중을 20% 이상 유지하며, 기술주 위주의 포트폴리오를 점검해 볼 시점입니다."
                </p>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-xs text-zinc-500">최근 업데이트</span>
                  <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse delay-75" />
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse delay-150" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>

        {/* Market News Widget */}
        <Link href="/news" className="group lg:col-span-2">
          <Card className="h-full bg-zinc-900/50 border-zinc-800 backdrop-blur-xl group-hover:border-sky-500/30 group-hover:bg-zinc-900/80 transition-all duration-300">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-zinc-100">
                  <Newspaper className="w-5 h-5 text-sky-400" />
                  실시간 마켓 뉴스
                </CardTitle>
                <ArrowUpRight className="w-5 h-5 text-zinc-500 group-hover:text-sky-400 transition-colors" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    title: "연준, 금리 동결 발표... 향후 금리 인하 시점에 대한 시장의 예측 엇갈려",
                    source: "글로벌 마켓",
                    time: "1시간 전",
                  },
                  {
                    title: "나스닥 1.5% 상승 마감, AI 관련주 실적 호조에 기술주 랠리 주도",
                    source: "테크 인베스트",
                    time: "3시간 전",
                  }
                ].map((news, i) => (
                  <div key={i} className="group/news flex gap-4 p-3 rounded-lg hover:bg-zinc-800/50 transition-colors border border-transparent hover:border-zinc-700/50 cursor-pointer">
                    <div className="w-12 h-12 rounded-md bg-zinc-800 flex items-center justify-center flex-shrink-0">
                      <Newspaper className="w-5 h-5 text-zinc-500" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-zinc-200 group-hover/news:text-sky-400 transition-colors line-clamp-1">{news.title}</h4>
                      <div className="flex items-center gap-2 mt-1 text-xs text-zinc-500">
                        <span>{news.source}</span>
                        <span>•</span>
                        <span>{news.time}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </Link>

        {/* Action Widgets */}
        <div className="space-y-6">
          <Link href="/portfolio" className="block group">
            <Card className="bg-zinc-900/50 border-zinc-800 backdrop-blur-xl group-hover:bg-zinc-800 transition-all duration-300">
              <CardContent className="p-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center">
                    <PieChart className="w-6 h-6 text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">포트폴리오 설정</h3>
                    <p className="text-sm text-zinc-400 mt-0.5">자산 비중 재분배</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-zinc-600 group-hover:text-emerald-400 transition-colors" />
              </CardContent>
            </Card>
          </Link>
          
          <a href="http://ghqlt0116.iptime.org:3000" target="_blank" rel="noopener noreferrer" className="block group">
            <Card className="bg-gradient-to-br from-zinc-900 to-zinc-950 border-zinc-800 hover:border-sky-500/30 transition-all duration-300">
              <CardContent className="p-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-sky-500/10 flex items-center justify-center">
                    <Coins className="w-6 h-6 text-sky-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">가계부 바로가기</h3>
                    <p className="text-sm text-zinc-400 mt-0.5">상세 수입/지출 내역 확인</p>
                  </div>
                </div>
                <ExternalLink className="w-5 h-5 text-zinc-600 group-hover:text-sky-400 transition-colors" />
              </CardContent>
            </Card>
          </a>
        </div>

      </div>
    </div>
  );
}
