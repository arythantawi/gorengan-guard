import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { 
  RefreshCw,
  TrendingUp,
  TrendingDown,
  Users,
  CircleDollarSign,
  Calendar,
  BarChart3
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
} from 'recharts';

interface TripOperation {
  id: string;
  trip_date: string;
  route_from: string;
  route_to: string;
  route_via: string | null;
  pickup_time: string;
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
  notes: string | null;
  driver_name: string | null;
  vehicle_number: string | null;
  created_at: string;
  updated_at: string;
}

interface AnalyticsData {
  label: string;
  passengers: number;
  income: number;
  expense: number;
  profit: number;
  trips: number;
}

const AdminAnalytics = () => {
  const [trips, setTrips] = useState<TripOperation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
  const [selectedMonth, setSelectedMonth] = useState((new Date().getMonth() + 1).toString().padStart(2, '0'));

  const fetchTrips = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('trip_operations')
        .select('*')
        .order('trip_date', { ascending: true });

      if (error) throw error;
      setTrips(data || []);
    } catch (error) {
      console.error('Error fetching trips:', error);
      toast.error('Gagal memuat data operasional');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTrips();
  }, []);

  const calculateTotals = (trip: TripOperation) => {
    const totalIncome = trip.income_tickets + trip.income_other;
    const totalExpense = 
      trip.expense_fuel + 
      trip.expense_ferry + 
      trip.expense_snack + 
      trip.expense_meals + 
      trip.expense_driver_commission + 
      trip.expense_driver_meals + 
      trip.expense_toll + 
      trip.expense_parking + 
      trip.expense_other;
    return { totalIncome, totalExpense, profit: totalIncome - totalExpense };
  };

  const formatPrice = (price: number) => {
    if (price >= 1000000) {
      return `${(price / 1000000).toFixed(1)}jt`;
    }
    if (price >= 1000) {
      return `${(price / 1000).toFixed(0)}rb`;
    }
    return price.toString();
  };

  const formatFullPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  // Get available years from data
  const availableYears = useMemo(() => {
    const years = new Set(trips.map(t => new Date(t.trip_date).getFullYear()));
    if (years.size === 0) years.add(new Date().getFullYear());
    return Array.from(years).sort((a, b) => b - a);
  }, [trips]);

  // Daily data for selected month
  const dailyData = useMemo(() => {
    const year = parseInt(selectedYear);
    const month = parseInt(selectedMonth) - 1;
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    const data: AnalyticsData[] = [];
    
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${year}-${(month + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
      const dayTrips = trips.filter(t => t.trip_date === dateStr);
      
      let passengers = 0, income = 0, expense = 0, profit = 0;
      dayTrips.forEach(trip => {
        passengers += trip.total_passengers;
        const totals = calculateTotals(trip);
        income += totals.totalIncome;
        expense += totals.totalExpense;
        profit += totals.profit;
      });
      
      data.push({
        label: day.toString(),
        passengers,
        income,
        expense,
        profit,
        trips: dayTrips.length
      });
    }
    
    return data;
  }, [trips, selectedYear, selectedMonth]);

  // Weekly data for selected year
  const weeklyData = useMemo(() => {
    const year = parseInt(selectedYear);
    const data: AnalyticsData[] = [];
    
    // Get weeks of the year
    for (let week = 1; week <= 52; week++) {
      const weekTrips = trips.filter(t => {
        const tripDate = new Date(t.trip_date);
        if (tripDate.getFullYear() !== year) return false;
        
        // Calculate week number
        const startOfYear = new Date(year, 0, 1);
        const days = Math.floor((tripDate.getTime() - startOfYear.getTime()) / (24 * 60 * 60 * 1000));
        const weekNumber = Math.ceil((days + startOfYear.getDay() + 1) / 7);
        return weekNumber === week;
      });
      
      if (weekTrips.length === 0) continue;
      
      let passengers = 0, income = 0, expense = 0, profit = 0;
      weekTrips.forEach(trip => {
        passengers += trip.total_passengers;
        const totals = calculateTotals(trip);
        income += totals.totalIncome;
        expense += totals.totalExpense;
        profit += totals.profit;
      });
      
      data.push({
        label: `M${week}`,
        passengers,
        income,
        expense,
        profit,
        trips: weekTrips.length
      });
    }
    
    return data;
  }, [trips, selectedYear]);

  // Monthly data for selected year
  const monthlyData = useMemo(() => {
    const year = parseInt(selectedYear);
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
    
    return monthNames.map((name, idx) => {
      const monthTrips = trips.filter(t => {
        const tripDate = new Date(t.trip_date);
        return tripDate.getFullYear() === year && tripDate.getMonth() === idx;
      });
      
      let passengers = 0, income = 0, expense = 0, profit = 0;
      monthTrips.forEach(trip => {
        passengers += trip.total_passengers;
        const totals = calculateTotals(trip);
        income += totals.totalIncome;
        expense += totals.totalExpense;
        profit += totals.profit;
      });
      
      return {
        label: name,
        passengers,
        income,
        expense,
        profit,
        trips: monthTrips.length
      };
    });
  }, [trips, selectedYear]);

  // Yearly data
  const yearlyData = useMemo(() => {
    const years = new Set(trips.map(t => new Date(t.trip_date).getFullYear()));
    
    return Array.from(years).sort().map(year => {
      const yearTrips = trips.filter(t => new Date(t.trip_date).getFullYear() === year);
      
      let passengers = 0, income = 0, expense = 0, profit = 0;
      yearTrips.forEach(trip => {
        passengers += trip.total_passengers;
        const totals = calculateTotals(trip);
        income += totals.totalIncome;
        expense += totals.totalExpense;
        profit += totals.profit;
      });
      
      return {
        label: year.toString(),
        passengers,
        income,
        expense,
        profit,
        trips: yearTrips.length
      };
    });
  }, [trips]);

  // Calculate summary stats
  const getSummary = (data: AnalyticsData[]) => {
    return data.reduce((acc, item) => ({
      passengers: acc.passengers + item.passengers,
      income: acc.income + item.income,
      expense: acc.expense + item.expense,
      profit: acc.profit + item.profit,
      trips: acc.trips + item.trips
    }), { passengers: 0, income: 0, expense: 0, profit: 0, trips: 0 });
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-popover border border-border rounded-lg p-3 shadow-lg">
          <p className="font-semibold text-foreground mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {entry.name}: {entry.name === 'Penumpang' || entry.name === 'Trip' 
                ? entry.value 
                : formatFullPrice(entry.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const renderChart = (data: AnalyticsData[], showAll: boolean = false) => (
    <div className="space-y-6">
      {/* Summary Cards */}
      {(() => {
        const summary = getSummary(data);
        return (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            <div className="bg-card rounded-lg p-3 border border-border">
              <div className="flex items-center gap-2 mb-1">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">Trip</span>
              </div>
              <p className="text-xl font-bold text-foreground">{summary.trips}</p>
            </div>
            <div className="bg-card rounded-lg p-3 border border-border">
              <div className="flex items-center gap-2 mb-1">
                <Users className="w-4 h-4 text-primary" />
                <span className="text-xs text-muted-foreground">Penumpang</span>
              </div>
              <p className="text-xl font-bold text-foreground">{summary.passengers}</p>
            </div>
            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3 border border-green-200 dark:border-green-800">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="w-4 h-4 text-green-600" />
                <span className="text-xs text-green-700 dark:text-green-400">Pemasukan</span>
              </div>
              <p className="text-xl font-bold text-green-800 dark:text-green-300">{formatFullPrice(summary.income)}</p>
            </div>
            <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-3 border border-red-200 dark:border-red-800">
              <div className="flex items-center gap-2 mb-1">
                <TrendingDown className="w-4 h-4 text-red-600" />
                <span className="text-xs text-red-700 dark:text-red-400">Pengeluaran</span>
              </div>
              <p className="text-xl font-bold text-red-800 dark:text-red-300">{formatFullPrice(summary.expense)}</p>
            </div>
            <div className={`rounded-lg p-3 border ${summary.profit >= 0 ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800' : 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800'}`}>
              <div className="flex items-center gap-2 mb-1">
                <CircleDollarSign className={`w-4 h-4 ${summary.profit >= 0 ? 'text-blue-600' : 'text-orange-600'}`} />
                <span className={`text-xs ${summary.profit >= 0 ? 'text-blue-700 dark:text-blue-400' : 'text-orange-700 dark:text-orange-400'}`}>Profit</span>
              </div>
              <p className={`text-xl font-bold ${summary.profit >= 0 ? 'text-blue-800 dark:text-blue-300' : 'text-orange-800 dark:text-orange-300'}`}>
                {formatFullPrice(summary.profit)}
              </p>
            </div>
          </div>
        );
      })()}

      {/* Income/Expense Chart */}
      <div className="bg-card rounded-xl p-4 border border-border">
        <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-primary" />
          Pemasukan & Pengeluaran
        </h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis 
                dataKey="label" 
                tick={{ fontSize: 12 }}
                className="text-muted-foreground"
              />
              <YAxis 
                tickFormatter={formatPrice}
                tick={{ fontSize: 12 }}
                className="text-muted-foreground"
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey="income" name="Pemasukan" fill="hsl(142, 76%, 36%)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="expense" name="Pengeluaran" fill="hsl(0, 84%, 60%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Profit Chart */}
      <div className="bg-card rounded-xl p-4 border border-border">
        <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-primary" />
          Profit
        </h3>
        <div className="h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis 
                dataKey="label" 
                tick={{ fontSize: 12 }}
                className="text-muted-foreground"
              />
              <YAxis 
                tickFormatter={formatPrice}
                tick={{ fontSize: 12 }}
                className="text-muted-foreground"
              />
              <Tooltip content={<CustomTooltip />} />
              <Line 
                type="monotone" 
                dataKey="profit" 
                name="Profit"
                stroke="hsl(217, 91%, 60%)" 
                strokeWidth={2}
                dot={{ fill: 'hsl(217, 91%, 60%)' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Passengers Chart */}
      <div className="bg-card rounded-xl p-4 border border-border">
        <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
          <Users className="w-5 h-5 text-primary" />
          Jumlah Penumpang
        </h3>
        <div className="h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis 
                dataKey="label" 
                tick={{ fontSize: 12 }}
                className="text-muted-foreground"
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                className="text-muted-foreground"
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="passengers" name="Penumpang" fill="hsl(262, 83%, 58%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );

  const months = [
    { value: '01', label: 'Januari' },
    { value: '02', label: 'Februari' },
    { value: '03', label: 'Maret' },
    { value: '04', label: 'April' },
    { value: '05', label: 'Mei' },
    { value: '06', label: 'Juni' },
    { value: '07', label: 'Juli' },
    { value: '08', label: 'Agustus' },
    { value: '09', label: 'September' },
    { value: '10', label: 'Oktober' },
    { value: '11', label: 'November' },
    { value: '12', label: 'Desember' },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <RefreshCw className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-primary" />
          Analisa Data Operasional
        </h2>
        <Button onClick={fetchTrips} variant="outline" size="icon">
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
        </Button>
      </div>

      <Tabs defaultValue="daily" className="space-y-4">
        <TabsList className="grid w-full max-w-md grid-cols-4">
          <TabsTrigger value="daily">Harian</TabsTrigger>
          <TabsTrigger value="weekly">Mingguan</TabsTrigger>
          <TabsTrigger value="monthly">Bulanan</TabsTrigger>
          <TabsTrigger value="yearly">Tahunan</TabsTrigger>
        </TabsList>

        <TabsContent value="daily" className="space-y-4">
          <div className="flex gap-3">
            <Select value={selectedMonth} onValueChange={setSelectedMonth}>
              <SelectTrigger className="w-[150px]">
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
          </div>
          {renderChart(dailyData)}
        </TabsContent>

        <TabsContent value="weekly" className="space-y-4">
          <div className="flex gap-3">
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
          </div>
          {renderChart(weeklyData)}
        </TabsContent>

        <TabsContent value="monthly" className="space-y-4">
          <div className="flex gap-3">
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
          </div>
          {renderChart(monthlyData)}
        </TabsContent>

        <TabsContent value="yearly" className="space-y-4">
          {renderChart(yearlyData, true)}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminAnalytics;
