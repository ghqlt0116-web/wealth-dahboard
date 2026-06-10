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
  ExternalLink,
  TrendingUp,
  Building,
  Landmark,
  Coins,
  ChevronRight,
  ShieldAlert
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";

export default function Dashboard() {
  const [totalAsset, setTotalAsset] = useState(0);
  const [totalDebt, setTotalDebt] = useState(0);
  const [assetGroups, setAssetGroups] = useState({ realEstate: 0, stock: 0, cash: 0 });

  // Child Support Calculations
  const today = new Date();
  const nextPayment = new Date(today.getFullYear(), today.getMonth(), 25);
  if (today.getDate() > 25) {
    nextPayment.setMonth(nextPayment.getMonth() + 1);
  }
  const dDayNextPayment = Math.ceil((nextPayment.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  const damMiddleSchool = new Date("2030-03-01");
  const dDayDamMiddle = Math.ceil((damMiddleSchool.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  useEffect(() => {
    async function fetchData() {
      const { data: assets } = await supabase.from("Asset").select("group, current_price");
      const { data: debts } = await supabase.from("Debt").select("balance");
      
      let sumAsset = 0;
      let sumRealEstate = 0;
      let sumStock = 0;
      let sumCash = 0;

      assets?.forEach(a => {
        const val = Number(a.current_price || 0);
        sumAsset += val;
        if (a.group === '부동산') sumRealEstate += val;
        else if (a.group.includes('현금') || a.group.includes('은행')) sumCash += val;
        else sumStock += val; // 주식, 연금 등
      });

      const sumDebt = debts?.reduce((sum, d) => sum + Number(d.balance || 0), 0) || 0;
      
      setTotalAsset(sumAsset);
      setTotalDebt(sumDebt);
      setAssetGroups({ realEstate: sumRealEstate, stock: sumStock, cash: sumCash });
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
            순자산 현황과 장기적 현금흐름, 그리고 아이들을 위한 플랜을 모니터링합니다.
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

        {/* Child Support Milestone Widget */}
        <div className="group">
          <Card className="h-full bg-zinc-900/50 border-zinc-800 backdrop-blur-xl group-hover:border-rose-500/30 transition-all duration-300 relative overflow-hidden flex flex-col">
            <div className="absolute top-0 right-0 p-32 bg-rose-500/5 rounded-full blur-3xl -mr-16 -mt-16 transition-all duration-500 group-hover:bg-rose-500/10" />
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-zinc-100">
                  <Baby className="w-5 h-5 text-rose-400" />
                  양육비 마일스톤
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col justify-center space-y-4">
              <div className="bg-zinc-950/50 rounded-xl p-4 border border-zinc-800/50 relative">
                <div className="absolute -left-[1px] top-4 bottom-4 w-[2px] bg-rose-500 rounded-r-full" />
                <div className="flex justify-between items-center mb-1">
                  <p className="text-sm font-medium text-zinc-300 flex items-center gap-1.5">
                    <CalendarDays className="w-4 h-4 text-zinc-400" />
                    차기 지급일
                  </p>
                  <span className="text-rose-400 font-bold">D-{dDayNextPayment}</span>
                </div>
                <p className="text-xs text-zinc-500">매월 25일 지급</p>
              </div>

              <div className="bg-zinc-950/50 rounded-xl p-4 border border-zinc-800/50 relative">
                <div className="absolute -left-[1px] top-4 bottom-4 w-[2px] bg-orange-500 rounded-r-full" />
                <div className="flex justify-between items-center mb-1">
                  <p className="text-sm font-medium text-zinc-300 flex items-center gap-1.5">
                    <ShieldAlert className="w-4 h-4 text-zinc-400" />
                    담이 중학교 진학
                  </p>
                  <span className="text-orange-400 font-bold">D-{dDayDamMiddle}</span>
                </div>
                <p className="text-xs text-zinc-500">양육비 인상 예정 (총 160만 원)</p>
              </div>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}
