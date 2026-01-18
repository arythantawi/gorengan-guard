import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { 
  RefreshCw,
  TrendingUp,
  TrendingDown,
  CircleDollarSign,
  Fuel,
  Ship,
  UtensilsCrossed,
  Wallet,
  Car,
  Calendar
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from 'sonner';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

interface TripOperation {
  id: string;
  trip_date: string;
  route_from: string;
  route_to: string;
  total_passengers: number;
  income_tickets: number;
  income_other: number;
  expense_fuel: number;
  expense_ferry: number;
  expense_snack: number;
  expense_meals: number;
  expense_driver_commission: number;
  expense_driver_meals: number;
  expense_toll: number;
  expense_parking: number;
  expense_other: number;
}

const COLORS = ['hsl(142, 76%, 36%)', 'hsl(0, 84%, 60%)', 'hsl(217, 91%, 60%)', 'hsl(262, 83%, 58%)', 'hsl(25, 95%, 53%)', 'hsl(47, 96%, 53%)', 'hsl(173, 80%, 40%)', 'hsl(339, 90%, 51%)'];

const ReportFinance = () => {
  const [trips, setTrips] = useState<TripOperation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
  const [selectedMonth, setSelectedMonth] = useState((new Date().getMonth() + 1).toString().padStart(2, '0'));

  const fetchTrips = async () => {
    setIsLoading(true);
    try {
      // Select only required columns for finance report
      const { data, error } = await supabase
        .from('trip_operations')
        .select('id, trip_date, route_from, route_to, total_passengers, income_tickets, income_other, expense_fuel, expense_ferry, expense_snack, expense_meals, expense_driver_commission, expense_driver_meals, expense_toll, expense_parking, expense_other')
        .order('trip_date', { ascending: true });

      if (error) throw error;
      setTrips(data || []);
    } catch (error) {
      console.error('Error fetching trips:', error);
      toast.error('Gagal memuat data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTrips();
  }, []);

  const formatFullPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatPrice = (price: number) => {
    if (price >= 1000000) return `${(price / 1000000).toFixed(1)}jt`;
    if (price >= 1000) return `${(price / 1000).toFixed(0)}rb`;
    return price.toString();
  };

  const availableYears = useMemo(() => {
    const years = new Set(trips.map(t => new Date(t.trip_date).getFullYear()));
    if (years.size === 0) years.add(new Date().getFullYear());
    return Array.from(years).sort((a, b) => b - a);
  }, [trips]);

  const filteredTrips = useMemo(() => {
    const year = parseInt(selectedYear);
    const month = parseInt(selectedMonth) - 1;
    return trips.filter(t => {
      const d = new Date(t.trip_date);
      return d.getFullYear() === year && d.getMonth() === month;
    });
  }, [trips, selectedYear, selectedMonth]);

  // Calculate totals
  const totals = useMemo(() => {
    let income_tickets = 0, income_other = 0;
    let expense_fuel = 0, expense_ferry = 0, expense_snack = 0, expense_meals = 0;
    let expense_driver_commission = 0, expense_driver_meals = 0, expense_toll = 0;
    let expense_parking = 0, expense_other = 0;

    filteredTrips.forEach(t => {
      income_tickets += t.income_tickets;
      income_other += t.income_other;
      expense_fuel += t.expense_fuel;
      expense_ferry += t.expense_ferry;
      expense_snack += t.expense_snack;
      expense_meals += t.expense_meals;
      expense_driver_commission += t.expense_driver_commission;
      expense_driver_meals += t.expense_driver_meals;
      expense_toll += t.expense_toll;
      expense_parking += t.expense_parking;
      expense_other += t.expense_other;
    });

    const totalIncome = income_tickets + income_other;
    const totalExpense = expense_fuel + expense_ferry + expense_snack + expense_meals + 
      expense_driver_commission + expense_driver_meals + expense_toll + expense_parking + expense_other;

    return {
      income_tickets, income_other, totalIncome,
      expense_fuel, expense_ferry, expense_snack, expense_meals,
      expense_driver_commission, expense_driver_meals, expense_toll,
      expense_parking, expense_other, totalExpense,
      profit: totalIncome - totalExpense
    };
  }, [filteredTrips]);

  // Expense breakdown for pie chart
  const expenseBreakdown = useMemo(() => [
    { name: 'BBM', value: totals.expense_fuel, icon: Fuel },
    { name: 'Penyebrangan', value: totals.expense_ferry, icon: Ship },
    { name: 'Snack', value: totals.expense_snack, icon: UtensilsCrossed },
    { name: 'Makan', value: totals.expense_meals, icon: UtensilsCrossed },
    { name: 'Komisi Supir', value: totals.expense_driver_commission, icon: Wallet },
    { name: 'Uang Makan Supir', value: totals.expense_driver_meals, icon: UtensilsCrossed },
    { name: 'Tol', value: totals.expense_toll, icon: Car },
    { name: 'Parkir', value: totals.expense_parking, icon: Car },
    { name: 'Lainnya', value: totals.expense_other, icon: CircleDollarSign },
  ].filter(e => e.value > 0), [totals]);

  // Monthly trend
  const monthlyTrend = useMemo(() => {
    const year = parseInt(selectedYear);
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
    
    return monthNames.map((name, idx) => {
      const monthTrips = trips.filter(t => {
        const d = new Date(t.trip_date);
        return d.getFullYear() === year && d.getMonth() === idx;
      });
      
      let income = 0, expense = 0;
      monthTrips.forEach(t => {
        income += t.income_tickets + t.income_other;
        expense += t.expense_fuel + t.expense_ferry + t.expense_snack + t.expense_meals +
          t.expense_driver_commission + t.expense_driver_meals + t.expense_toll + 
          t.expense_parking + t.expense_other;
      });
      
      return { label: name, income, expense, profit: income - expense };
    });
  }, [trips, selectedYear]);

  const months = [
    { value: '01', label: 'Januari' }, { value: '02', label: 'Februari' },
    { value: '03', label: 'Maret' }, { value: '04', label: 'April' },
    { value: '05', label: 'Mei' }, { value: '06', label: 'Juni' },
    { value: '07', label: 'Juli' }, { value: '08', label: 'Agustus' },
    { value: '09', label: 'September' }, { value: '10', label: 'Oktober' },
    { value: '11', label: 'November' }, { value: '12', label: 'Desember' },
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-popover border border-border rounded-lg p-3 shadow-lg">
          <p className="font-semibold text-foreground mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {entry.name}: {formatFullPrice(entry.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <RefreshCw className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
          <CircleDollarSign className="w-6 h-6 text-primary" />
          Laporan Keuangan
        </h2>
        <div className="flex gap-3">
          <Select value={selectedMonth} onValueChange={setSelectedMonth}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Bulan" />
            </SelectTrigger>
            <SelectContent>
              {months.map(m => (
                <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger className="w-[100px]">
              <SelectValue placeholder="Tahun" />
            </SelectTrigger>
            <SelectContent>
              {availableYears.map(y => (
                <SelectItem key={y} value={y.toString()}>{y}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={fetchTrips} variant="outline" size="icon">
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-5 border border-green-200 dark:border-green-800">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-green-600" />
            <p className="text-sm text-green-700 dark:text-green-400">Total Pemasukan</p>
          </div>
          <p className="text-2xl font-bold text-green-800 dark:text-green-300">{formatFullPrice(totals.totalIncome)}</p>
          <div className="mt-2 text-xs text-green-600 dark:text-green-400 space-y-1">
            <p>Tiket: {formatFullPrice(totals.income_tickets)}</p>
            <p>Lainnya: {formatFullPrice(totals.income_other)}</p>
          </div>
        </div>
        <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-5 border border-red-200 dark:border-red-800">
          <div className="flex items-center gap-2 mb-2">
            <TrendingDown className="w-5 h-5 text-red-600" />
            <p className="text-sm text-red-700 dark:text-red-400">Total Pengeluaran</p>
          </div>
          <p className="text-2xl font-bold text-red-800 dark:text-red-300">{formatFullPrice(totals.totalExpense)}</p>
          <p className="mt-2 text-xs text-red-600 dark:text-red-400">{filteredTrips.length} trip</p>
        </div>
        <div className={`rounded-xl p-5 border ${totals.profit >= 0 ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800' : 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800'}`}>
          <div className="flex items-center gap-2 mb-2">
            <CircleDollarSign className={`w-5 h-5 ${totals.profit >= 0 ? 'text-blue-600' : 'text-orange-600'}`} />
            <p className={`text-sm ${totals.profit >= 0 ? 'text-blue-700 dark:text-blue-400' : 'text-orange-700 dark:text-orange-400'}`}>Profit Bersih</p>
          </div>
          <p className={`text-2xl font-bold ${totals.profit >= 0 ? 'text-blue-800 dark:text-blue-300' : 'text-orange-800 dark:text-orange-300'}`}>
            {formatFullPrice(totals.profit)}
          </p>
          <p className={`mt-2 text-xs ${totals.profit >= 0 ? 'text-blue-600 dark:text-blue-400' : 'text-orange-600 dark:text-orange-400'}`}>
            Margin: {totals.totalIncome > 0 ? ((totals.profit / totals.totalIncome) * 100).toFixed(1) : 0}%
          </p>
        </div>
      </div>

      {/* Expense Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card rounded-xl p-5 border border-border">
          <h3 className="font-semibold text-foreground mb-4">Rincian Pengeluaran</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={expenseBreakdown}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {expenseBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => formatFullPrice(value)} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-card rounded-xl p-5 border border-border">
          <h3 className="font-semibold text-foreground mb-4">Detail Pengeluaran</h3>
          <div className="space-y-3">
            {expenseBreakdown.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                  <span className="text-sm text-foreground">{item.name}</span>
                </div>
                <span className="text-sm font-medium text-foreground">{formatFullPrice(item.value)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Monthly Trend */}
      <div className="bg-card rounded-xl p-5 border border-border">
        <h3 className="font-semibold text-foreground mb-4">Tren Bulanan {selectedYear}</h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyTrend}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="label" tick={{ fontSize: 12 }} />
              <YAxis tickFormatter={formatPrice} tick={{ fontSize: 12 }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey="income" name="Pemasukan" fill="hsl(142, 76%, 36%)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="expense" name="Pengeluaran" fill="hsl(0, 84%, 60%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Profit Trend */}
      <div className="bg-card rounded-xl p-5 border border-border">
        <h3 className="font-semibold text-foreground mb-4">Tren Profit {selectedYear}</h3>
        <div className="h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={monthlyTrend}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="label" tick={{ fontSize: 12 }} />
              <YAxis tickFormatter={formatPrice} tick={{ fontSize: 12 }} />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="profit" name="Profit" stroke="hsl(217, 91%, 60%)" strokeWidth={2} dot={{ fill: 'hsl(217, 91%, 60%)' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default ReportFinance;
