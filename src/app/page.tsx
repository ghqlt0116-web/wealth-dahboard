"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  ArrowUpRight, 
  Wallet,
  PieChart,
  BrainCircuit,
  Baby,
  CalendarDays,
  Landmark,
  Coins,
  ChevronRight,
  TrendingUp,
  Star,
  ExternalLink,
  Building
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";

export default function Dashboard() {
  const [totalAsset, setTotalAsset] = useState(0);
  const [totalDebt, setTotalDebt] = useState(0);
  const [assetGroups, setAssetGroups] = useState({ realEstate: 0, stock: 0, cash: 0 });
  const [topInvestments, setTopInvestments] = useState<any[]>([]);

  useEffect(() => {
    async function fetchData() {
      const { data: assets } = await supabase.from("Asset").select("name, group, current_price, ticker");
      const { data: debts } = await supabase.from("Debt").select("balance");
      
      let sumAsset = 0;
      let sumRealEstate = 0;
      let sumStock = 0;
      let sumCash = 0;
      const investments: any[] = [];

      assets?.forEach(a => {
        const val = Number(a.current_price || 0);
        sumAsset += val;
        if (a.group === '부동산') sumRealEstate += val;
        else if (a.group.includes('현금') || a.group.includes('은행')) sumCash += val;
        else {
          sumStock += val; // 주식, 연금 등
          investments.push({ name: a.name, value: val, ticker: a.ticker });
        }
      });

      const sumDebt = debts?.reduce((sum, d) => sum + Number(d.balance || 0), 0) || 0;
      
      // Sort investments by value descending and take top 4
      investments.sort((a, b) => b.value - a.value);
      
      setTotalAsset(sumAsset);
      setTotalDebt(sumDebt);
      setAssetGroups({ realEstate: sumRealEstate, stock: sumStock, cash: sumCash });
      setTopInvestments(investments.slice(0, 4));
    }
    fetchData();
  }, []);

  const netWorth = totalAsset - totalDebt;

  return (
    <div className="flex-1 space-y-6 md:space-y-8 pb-10">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white mb-1">
            Wealth Hub
          </h1>
          <p className="text-zinc-400 text-sm max-w-xl">
            순자산 현황과 장기적인 현금흐름 및 투자 포트폴리오를 통합 관리합니다.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <a 
            href="http://ghqlt0116.iptime.org:3000" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2 bg-sky-500/10 text-sky-400 hover:bg-sky-500/20 border border-sky-500/20 font-medium gap-2"
          >
            <ExternalLink className="w-4 h-4" />
            가계부 열기
          </a>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Net Worth Widget */}
        <Link href="/portfolio" className="lg:col-span-2 group">
          <Card className="h-full bg-zinc-900/50 border-zinc-800 backdrop-blur-xl group-hover:border-emerald-500/30 group-hover:bg-zinc-900/80 transition-all duration-300 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-32 bg-emerald-500/5 rounded-full blur-3xl -mr-16 -mt-16 transition-all duration-500 group-hover:bg-emerald-500/10" />
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-zinc-100">
                  <Wallet className="w-5 h-5 text-emerald-400" />
                  순자산 (Net Worth) 현황
                </CardTitle>
                <ArrowUpRight className="w-5 h-5 text-zinc-500 group-hover:text-emerald-400 transition-colors" />
              </div>
              <CardDescription className="text-zinc-400">총 자산에서 총 부채를 제외한 실제 순자산입니다.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mt-2 mb-6">
                <p className="text-sm font-medium text-zinc-500 mb-1">현재 순자산</p>
                <div className="flex items-baseline gap-2">
                  <h2 className="text-4xl font-black text-white tracking-tight">₩ {netWorth.toLocaleString()}</h2>
                </div>
                <div className="flex gap-4 mt-3 text-sm">
                  <div className="flex items-center gap-1.5 text-zinc-400">
                    <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                    총 자산: ₩ {totalAsset.toLocaleString()}
                  </div>
                  <div className="flex items-center gap-1.5 text-zinc-400">
                    <span className="w-2 h-2 rounded-full bg-red-500"></span>
                    총 부채: ₩ {totalDebt.toLocaleString()}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 border-t border-zinc-800 pt-5 mt-5">
                <div>
                  <div className="flex items-center gap-2 text-sm text-zinc-400 mb-1">
                    <Building className="w-3.5 h-3.5" />
                    부동산
                  </div>
                  <p className="font-semibold text-zinc-200">₩ {assetGroups.realEstate.toLocaleString()}</p>
                </div>
                <div>
                  <div className="flex items-center gap-2 text-sm text-zinc-400 mb-1">
                    <TrendingUp className="w-3.5 h-3.5" />
                    투자자산(주식/연금)
                  </div>
                  <p className="font-semibold text-zinc-200">₩ {assetGroups.stock.toLocaleString()}</p>
                </div>
                <div>
                  <div className="flex items-center gap-2 text-sm text-zinc-400 mb-1">
                    <Landmark className="w-3.5 h-3.5" />
                    현금성 자산
                  </div>
                  <p className="font-semibold text-zinc-200">₩ {assetGroups.cash.toLocaleString()}</p>
                </div>
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
                    <p className="text-sm text-zinc-400 mt-0.5">자산 비중 재분배 및 등록</p>
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

        {/* Top Investments Widget - Moved to Bottom */}
        <Link href="/portfolio" className="group lg:col-span-3">
          <Card className="h-full bg-zinc-900/50 border-zinc-800 backdrop-blur-xl group-hover:border-blue-500/30 transition-all duration-300 relative overflow-hidden flex flex-col">
            <div className="absolute top-0 right-0 p-32 bg-blue-500/5 rounded-full blur-3xl -mr-16 -mt-16 transition-all duration-500 group-hover:bg-blue-500/10" />
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-zinc-100">
                  <Star className="w-5 h-5 text-blue-400" />
                  나의 핵심 투자 종목
                </CardTitle>
                <ArrowUpRight className="w-5 h-5 text-zinc-500 group-hover:text-blue-400 transition-colors" />
              </div>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {topInvestments.map((inv, idx) => (
                <div key={idx} className="bg-zinc-950/50 rounded-lg p-4 border border-zinc-800/50 flex flex-col justify-between group/item hover:border-zinc-700 transition-colors h-24">
                  <div className="flex justify-between items-start">
                    <h4 className="text-sm font-medium text-zinc-200 line-clamp-2 group-hover/item:text-blue-400 transition-colors pr-2 leading-tight">{inv.name}</h4>
                    {inv.ticker && <span className="text-xs font-mono text-zinc-500 bg-zinc-900 px-1.5 py-0.5 rounded flex-shrink-0">{inv.ticker.replace('.KS', '')}</span>}
                  </div>
                  <div className="mt-auto pt-2">
                    <span className="text-lg font-bold text-zinc-100 tracking-tight">
                      ₩ {(inv.value / 10000).toLocaleString(undefined, { maximumFractionDigits: 0 })}만
                    </span>
                  </div>
                </div>
              ))}
              {topInvestments.length === 0 && (
                <p className="text-sm text-zinc-500 text-center py-4 col-span-full">등록된 투자 자산이 없습니다.</p>
              )}
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}
