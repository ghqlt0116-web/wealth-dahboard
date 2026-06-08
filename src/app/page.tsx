"use client";

import { useEffect, useState } from "react";
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  DollarSign, 
  CreditCard, 
  Activity,
  Wallet
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
import { supabase } from "@/lib/supabase";

interface Transaction {
  id: string;
  date: string;
  type: "EXPENSE" | "INCOME";
  amount: number;
  category: string;
}

interface MonthlyData {
  name: string;
  수입: number;
  지출: number;
}

export default function Dashboard() {
  const [connectionStatus, setConnectionStatus] = useState<"loading" | "connected" | "error">("loading");
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);
  const [currentMonthIncome, setCurrentMonthIncome] = useState(0);
  const [currentMonthExpense, setCurrentMonthExpense] = useState(0);
  const [expectedSalary, setExpectedSalary] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Fetch Transactions
        const { data: transactions, error: txError } = await supabase
          .from("Transaction")
          .select("id, date, type, amount, category")
          .order("date", { ascending: true });

        if (txError) {
          console.error("Fetch error:", txError);
          setConnectionStatus("error");
          return;
        }

        setConnectionStatus("connected");

        // 2. Fetch User Settings (expectedSalary)
        const { data: settings } = await supabase
          .from("UserSetting")
          .select("key, value")
          .eq("key", "expectedSalary")
          .single();
          
        if (settings && settings.value) {
          setExpectedSalary(Number(settings.value));
        }

        // 3. Process Data for Chart
        if (transactions) {
          const monthlyAgg = new Map<string, { income: number; expense: number }>();
          
          const now = new Date();
          const currentMonthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
          let tempCurrentIncome = 0;
          let tempCurrentExpense = 0;

          transactions.forEach((tx: Transaction) => {
            const dateObj = new Date(tx.date);
            const monthKey = `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, '0')}`;
            const displayMonth = `${dateObj.getFullYear()}.${String(dateObj.getMonth() + 1).padStart(2, '0')}`; // For chart display e.g. 2026.08

            if (!monthlyAgg.has(displayMonth)) {
              monthlyAgg.set(displayMonth, { income: 0, expense: 0 });
            }

            const currentObj = monthlyAgg.get(displayMonth)!;

            if (tx.type === "INCOME") {
              currentObj.income += tx.amount;
              // Add to current month summary if it matches exactly this month
              if (monthKey === currentMonthKey) tempCurrentIncome += tx.amount;
            } else if (tx.type === "EXPENSE") {
              currentObj.expense += tx.amount;
              if (monthKey === currentMonthKey) tempCurrentExpense += tx.amount;
            }
          });

          setCurrentMonthIncome(tempCurrentIncome);
          setCurrentMonthExpense(tempCurrentExpense);

          // Convert Map to Array for Recharts, sorted chronologically
          const chartData: MonthlyData[] = Array.from(monthlyAgg.entries())
            .map(([month, data]) => ({
              name: month,
              수입: data.income,
              지출: data.expense
            }))
            .sort((a, b) => a.name.localeCompare(b.name));

          setMonthlyData(chartData);
        }
      } catch (err) {
        console.error(err);
        setConnectionStatus("error");
      }
    };

    fetchData();
  }, []);

  return (
    <div className="p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-bold tracking-tight text-white">대시보드</h2>
        <div className="flex items-center text-sm text-zinc-400">
          <div className={`w-2 h-2 rounded-full mr-2 ${connectionStatus === 'connected' ? 'bg-emerald-500' : connectionStatus === 'loading' ? 'bg-amber-500' : 'bg-rose-500'}`} />
          {connectionStatus === 'connected' ? '데이터 동기화 완료 (money-manager)' : connectionStatus === 'loading' ? '데이터 불러오는 중...' : '데이터 연결 오류'}
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
        
        <Card className="bg-zinc-900/50 border-zinc-800 backdrop-blur-xl hover:bg-zinc-900/80 transition-all">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">이번 달 수입</CardTitle>
            <DollarSign className="h-4 w-4 text-sky-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">₩ {currentMonthIncome.toLocaleString()}</div>
            <p className="text-xs text-sky-500 flex items-center mt-1">
              예상 급여: ₩ {expectedSalary.toLocaleString()}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900/50 border-zinc-800 backdrop-blur-xl hover:bg-zinc-900/80 transition-all">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">이번 달 지출</CardTitle>
            <CreditCard className="h-4 w-4 text-rose-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">₩ {currentMonthExpense.toLocaleString()}</div>
            <p className="text-xs text-rose-500 flex items-center mt-1">
              이번 달 현금 흐름 분석
            </p>
          </CardContent>
        </Card>

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
