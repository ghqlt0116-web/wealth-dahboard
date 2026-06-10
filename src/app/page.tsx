"use client";

import { useEffect, useState, useMemo } from "react";
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  DollarSign, 
  CreditCard, 
  Activity,
  Wallet,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { 
  Line, 
  LineChart, 
  ResponsiveContainer, 
  Tooltip, 
  XAxis, 
  YAxis,
  CartesianGrid
} from "recharts";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { supabase } from "@/lib/supabase";

interface Transaction {
  id: string;
  date: string;
  type: "EXPENSE" | "INCOME";
  amount: number;
  category: string;
  card?: string;
  installmentGroupId?: string;
}

interface MonthlyData {
  name: string;
  수입: number;
  지출: number;
}

export default function Dashboard() {
  const [connectionStatus, setConnectionStatus] = useState<"loading" | "connected" | "error">("loading");
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [expectedSalary, setExpectedSalary] = useState(0);
  const [selectedMonth, setSelectedMonth] = useState(new Date());

  useEffect(() => {
    const fetchData = async () => {
      try {
        setConnectionStatus("loading");
        const start = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() - 5, 1);
        const end = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() + 1, 0, 23, 59, 59);

        // 1. Fetch Transactions specifically for the selected 6-month window
        const { data: txData, error: txError } = await supabase
          .from("Transaction")
          .select("id, date, type, amount, category, card, installmentGroupId")
          .gte("date", start.toISOString())
          .lte("date", end.toISOString())
          .order("date", { ascending: true })
          .limit(1000);

        if (txError) {
          console.error("Fetch error:", txError);
          setConnectionStatus("error");
          return;
        }

        setConnectionStatus("connected");
        if (txData) {
          setTransactions(txData);
        }

        // 2. Fetch User Settings (expectedSalary)
        const { data: settings } = await supabase
          .from("UserSetting")
          .select("key, value")
          .eq("key", "expectedSalary")
          .single();
          
        if (settings && settings.value) {
          setExpectedSalary(Number(settings.value));
        }

      } catch (err) {
        console.error(err);
        setConnectionStatus("error");
      }
    };

    fetchData();
  }, [selectedMonth]); // Refetch when selectedMonth changes

  const { currentMonthIncome, currentMonthExpense, monthlyData, currentIncomeGroups, currentExpenseGroups, fixedExpenseTotal } = useMemo(() => {
    const monthlyAgg = new Map<string, { income: number; expense: number }>();
    const targetMonthKey = `${selectedMonth.getFullYear()}-${String(selectedMonth.getMonth() + 1).padStart(2, '0')}`;
    
    const incomeGroups: Record<string, number> = {};
    const variableExpenseGroups: Record<string, number> = {};
    const fixedExpenseGroups: Record<string, number> = {};
    let tempFixedExpenseTotal = 0;
    
    // Initialize strictly the last 6 months based on the SELECTED month
    for (let i = 5; i >= 0; i--) {
      const d = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() - i, 1);
      const displayMonth = `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}`;
      monthlyAgg.set(displayMonth, { income: 0, expense: 0 });
    }
    
    let tempCurrentIncome = 0;
    let tempCurrentExpense = 0;

    transactions.forEach((tx: any) => {
      if (!tx.date || !tx.type || tx.amount == null) return;

      let dateObj = new Date(tx.date);
      // Handle timestamp strings
      if (isNaN(dateObj.getTime())) {
        const numDate = Number(tx.date);
        if (!isNaN(numDate)) {
          dateObj = new Date(numDate > 9999999999 ? numDate : numDate * 1000);
        }
      }
      
      if (isNaN(dateObj.getTime())) return; // Skip if still invalid

      const monthKey = `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, '0')}`;
      const displayMonth = `${dateObj.getFullYear()}.${String(dateObj.getMonth() + 1).padStart(2, '0')}`;

      // ONLY add data if it falls within our strictly initialized 6 months
      if (monthlyAgg.has(displayMonth)) {
        const currentObj = monthlyAgg.get(displayMonth)!;
        const txType = String(tx.type).toUpperCase().trim();
        const amount = Number(tx.amount);

        if (txType === "INCOME" || txType === "수입") {
          currentObj.income += amount;
          if (monthKey === targetMonthKey) {
            tempCurrentIncome += amount;
            const cat = tx.category || "기타 수입";
            incomeGroups[cat] = (incomeGroups[cat] || 0) + amount;
          }
        } else if (txType === "EXPENSE" || txType === "지출") {
          currentObj.expense += amount;
          if (monthKey === targetMonthKey) {
            tempCurrentExpense += amount;
            if (tx.installmentGroupId && tx.installmentGroupId.startsWith("fixed_")) {
              tempFixedExpenseTotal += amount;
              const fixedCat = tx.category || "기타 고정지출";
              fixedExpenseGroups[fixedCat] = (fixedExpenseGroups[fixedCat] || 0) + amount;
            } else {
              const cardName = tx.card || "현금/기타";
              variableExpenseGroups[cardName] = (variableExpenseGroups[cardName] || 0) + amount;
            }
          }
        }
      }
    });

    // Convert Map to Array for Recharts
    const chartData: MonthlyData[] = Array.from(monthlyAgg.entries())
      .map(([month, data]) => ({
        name: month,
        수입: data.income,
        지출: data.expense
      }));

    return { 
      currentMonthIncome: tempCurrentIncome, 
      currentMonthExpense: tempCurrentExpense, 
      monthlyData: chartData,
      currentIncomeGroups: Object.entries(incomeGroups).sort((a, b) => b[1] - a[1]),
      currentVariableExpenseGroups: Object.entries(variableExpenseGroups).sort((a, b) => b[1] - a[1]),
      currentFixedExpenseGroups: Object.entries(fixedExpenseGroups).sort((a, b) => b[1] - a[1]),
      fixedExpenseTotal: tempFixedExpenseTotal
    };
  }, [transactions, selectedMonth]);

  const handlePrevMonth = () => {
    setSelectedMonth(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(newDate.getMonth() - 1);
      return newDate;
    });
  };

  const handleNextMonth = () => {
    setSelectedMonth(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(newDate.getMonth() + 1);
      return newDate;
    });
  };

  return (
    <div className="p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-2">
          <h2 className="text-3xl font-bold tracking-tight text-white">대시보드</h2>
          <div className="flex items-center text-sm text-zinc-400">
            <div className={`w-2 h-2 rounded-full mr-2 ${connectionStatus === 'connected' ? 'bg-emerald-500' : connectionStatus === 'loading' ? 'bg-amber-500' : 'bg-rose-500'}`} />
            {connectionStatus === 'connected' ? '데이터 동기화 완료 (money-manager)' : connectionStatus === 'loading' ? '데이터 불러오는 중...' : '데이터 연결 오류'}
          </div>
        </div>

        {/* Month Selector */}
        <div className="flex items-center gap-4 bg-zinc-900/50 border border-zinc-800 rounded-full px-4 py-2 backdrop-blur-xl">
          <button 
            onClick={handlePrevMonth}
            className="p-1 hover:bg-zinc-800 rounded-full transition-colors text-zinc-400 hover:text-white"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="text-white font-medium min-w-[100px] text-center">
            {selectedMonth.getFullYear()}년 {selectedMonth.getMonth() + 1}월
          </span>
          <button 
            onClick={handleNextMonth}
            className="p-1 hover:bg-zinc-800 rounded-full transition-colors text-zinc-400 hover:text-white"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-zinc-900/50 border-zinc-800 backdrop-blur-xl hover:bg-zinc-900/80 transition-all">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">총 자산 (Portfolio)</CardTitle>
            <Wallet className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">₩ 0</div>
            <p className="text-xs text-zinc-500 flex items-center mt-1">
              포트폴리오 메뉴에서 자산을 추가해주세요.
            </p>
          </CardContent>
        </Card>
        
        <Dialog>
          <DialogTrigger render={<div className="cursor-pointer group h-full" />}>
            <Card className="h-full bg-zinc-900/50 border-zinc-800 backdrop-blur-xl group-hover:bg-zinc-800/80 transition-all">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-zinc-400">이번 달 수입</CardTitle>
                <DollarSign className="h-4 w-4 text-sky-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">₩ {currentMonthIncome.toLocaleString()}</div>
                <p className="text-xs text-zinc-500 flex items-center mt-1 group-hover:text-sky-400 transition-colors">
                  클릭하여 내역 보기 👆
                </p>
              </CardContent>
            </Card>
          </DialogTrigger>
          <DialogContent className="bg-zinc-950 border-zinc-800 text-white max-h-[80vh] overflow-y-auto w-[90vw] sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>이번 달 수입 내역</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              {currentIncomeGroups.length > 0 ? currentIncomeGroups.map(([category, total]) => (
                <div key={category} className="flex justify-between items-center border-b border-zinc-800 pb-2">
                  <p className="font-medium text-zinc-300">💰 {category}</p>
                  <p className="text-sky-500 font-bold">+₩ {total.toLocaleString()}</p>
                </div>
              )) : (
                <p className="text-zinc-500 text-sm text-center py-4">이번 달 수입 내역이 없습니다.</p>
              )}
            </div>
          </DialogContent>
        </Dialog>

        <Dialog>
          <DialogTrigger render={<div className="cursor-pointer group h-full" />}>
            <Card className="h-full bg-zinc-900/50 border-zinc-800 backdrop-blur-xl group-hover:bg-zinc-800/80 transition-all">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-zinc-400">이번 달 지출</CardTitle>
                <CreditCard className="h-4 w-4 text-rose-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">₩ {currentMonthExpense.toLocaleString()}</div>
                <p className="text-xs text-zinc-500 flex items-center mt-1 group-hover:text-rose-400 transition-colors">
                  클릭하여 내역 보기 👆
                </p>
              </CardContent>
            </Card>
          </DialogTrigger>
          <DialogContent className="bg-zinc-950 border-zinc-800 text-white max-h-[80vh] overflow-y-auto w-[90vw] sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>이번 달 지출 내역 (고정지출 포함)</DialogTitle>
            </DialogHeader>
            <div className="space-y-6 mt-4">
              {fixedExpenseTotal > 0 && (
                <div>
                  <div className="flex justify-between items-center border-b border-zinc-700 pb-2 mb-3">
                    <p className="font-bold text-rose-400">📌 고정 지출 (총 ₩ {fixedExpenseTotal.toLocaleString()})</p>
                  </div>
                  <div className="space-y-2 pl-2">
                    {currentFixedExpenseGroups.map(([cat, total]) => (
                      <div key={cat} className="flex justify-between items-center">
                        <p className="font-medium text-zinc-400">- {cat}</p>
                        <p className="text-rose-400/80 text-sm font-medium">-₩ {total.toLocaleString()}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {currentVariableExpenseGroups.length > 0 && (
                <div>
                  <div className="flex justify-between items-center border-b border-zinc-700 pb-2 mb-3">
                    <p className="font-bold text-zinc-300">💳 카드 / 변동 지출</p>
                  </div>
                  <div className="space-y-2 pl-2">
                    {currentVariableExpenseGroups.map(([card, total]) => (
                      <div key={card} className="flex justify-between items-center">
                        <p className="font-medium text-zinc-400">- {card}</p>
                        <p className="text-rose-400/80 text-sm font-medium">-₩ {total.toLocaleString()}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {fixedExpenseTotal === 0 && currentVariableExpenseGroups.length === 0 && (
                <p className="text-zinc-500 text-sm text-center py-4">이번 달 지출 내역이 없습니다.</p>
              )}
            </div>
          </DialogContent>
        </Dialog>

        <Card className="bg-zinc-900/50 border-zinc-800 backdrop-blur-xl hover:bg-zinc-900/80 transition-all">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">AI 투자 인사이트</CardTitle>
            <Activity className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">분석 준비됨</div>
            <p className="text-xs text-zinc-400 mt-1">최신 글로벌 금융 뉴스 기반</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 bg-zinc-900/50 border-zinc-800 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-white">월별 현금 흐름 (수입/지출)</CardTitle>
            <CardDescription className="text-zinc-400">
              최근 발생한 수입 및 지출 추이
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            {monthlyData.length > 0 ? (
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthlyData} margin={{ top: 5, right: 10, left: 10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                    <XAxis 
                      dataKey="name" 
                      stroke="#a1a1aa" 
                      fontSize={12} 
                      tickLine={false} 
                      axisLine={false} 
                    />
                    <YAxis 
                      stroke="#a1a1aa" 
                      fontSize={12} 
                      tickLine={false} 
                      axisLine={false} 
                      tickFormatter={(value) => `₩${(value / 10000).toFixed(0)}만`} 
                      width={60}
                    />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', color: '#fff', borderRadius: '8px' }}
                      itemStyle={{ color: '#fff' }}
                      formatter={(value: any) => [`₩ ${Number(value).toLocaleString()}`, undefined]}
                    />
                    <Line type="monotone" dataKey="수입" stroke="#0ea5e9" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                    <Line type="monotone" dataKey="지출" stroke="#f43f5e" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-zinc-500">
                {connectionStatus === 'loading' ? '데이터 로딩 중...' : '표시할 데이터가 없습니다.'}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="col-span-3 bg-zinc-900/50 border-zinc-800 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-white">자산 비중 (Portfolio)</CardTitle>
            <CardDescription className="text-zinc-400">
              현재 등록된 자산군 비율
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full flex items-center justify-center text-zinc-500 flex-col">
              <Wallet className="h-12 w-12 mb-4 opacity-50" />
              <p>자산 데이터가 없습니다.</p>
              <p className="text-sm mt-2 text-zinc-600">포트폴리오 메뉴에서 자산을 추가해주세요.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
