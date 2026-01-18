import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { 
  RefreshCw,
  Users,
  MapPin,
  Calendar,
  TrendingUp
} from 'lucide-react';
import { Button } from '@/components/ui/button';
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
  route_via: string | null;
  total_passengers: number;
  pickup_time: string;
}

const COLORS = ['hsl(262, 83%, 58%)', 'hsl(217, 91%, 60%)', 'hsl(142, 76%, 36%)', 'hsl(25, 95%, 53%)', 'hsl(339, 90%, 51%)', 'hsl(47, 96%, 53%)', 'hsl(173, 80%, 40%)', 'hsl(0, 84%, 60%)'];

const ReportPassengers = () => {
  const [trips, setTrips] = useState<TripOperation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
  const [selectedMonth, setSelectedMonth] = useState((new Date().getMonth() + 1).toString().padStart(2, '0'));

  const fetchTrips = async () => {
    setIsLoading(true);
    try {
      // Already optimized - only selecting required columns
      const { data, error } = await supabase
        .from('trip_operations')
        .select('id, trip_date, route_from, route_to, route_via, total_passengers, pickup_time')
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

  // Total passengers this month
  const totalPassengers = useMemo(() => 
    filteredTrips.reduce((sum, t) => sum + t.total_passengers, 0), 
  [filteredTrips]);

  // Passengers by route
  const passengersByRoute = useMemo(() => {
    const routeMap: Record<string, number> = {};
    filteredTrips.forEach(t => {
      const route = `${t.route_from} → ${t.route_to}`;
      routeMap[route] = (routeMap[route] || 0) + t.total_passengers;
    });
    return Object.entries(routeMap)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [filteredTrips]);

  // Daily passengers for the month
  const dailyPassengers = useMemo(() => {
    const year = parseInt(selectedYear);
    const month = parseInt(selectedMonth) - 1;
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    const data = [];
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${year}-${(month + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
      const dayTrips = filteredTrips.filter(t => t.trip_date === dateStr);
      const passengers = dayTrips.reduce((sum, t) => sum + t.total_passengers, 0);
      data.push({ label: day.toString(), passengers, trips: dayTrips.length });
    }
    return data;
  }, [filteredTrips, selectedYear, selectedMonth]);

  // Monthly trend for the year
  const monthlyTrend = useMemo(() => {
    const year = parseInt(selectedYear);
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
    
    return monthNames.map((name, idx) => {
      const monthTrips = trips.filter(t => {
        const d = new Date(t.trip_date);
        return d.getFullYear() === year && d.getMonth() === idx;
      });
      const passengers = monthTrips.reduce((sum, t) => sum + t.total_passengers, 0);
      return { label: name, passengers, trips: monthTrips.length };
    });
  }, [trips, selectedYear]);

  // Passengers by time slot
  const passengersByTime = useMemo(() => {
    const timeMap: Record<string, number> = {};
    filteredTrips.forEach(t => {
      const time = t.pickup_time || 'Lainnya';
      timeMap[time] = (timeMap[time] || 0) + t.total_passengers;
    });
    return Object.entries(timeMap)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [filteredTrips]);

  // Average per trip
  const avgPerTrip = filteredTrips.length > 0 ? (totalPassengers / filteredTrips.length).toFixed(1) : '0';

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
              {entry.name}: {entry.value}
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
          <Users className="w-6 h-6 text-primary" />
          Laporan Penumpang
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
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-card rounded-xl p-5 border border-border">
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-5 h-5 text-primary" />
            <p className="text-sm text-muted-foreground">Total Penumpang</p>
          </div>
          <p className="text-2xl font-bold text-foreground">{totalPassengers}</p>
        </div>
        <div className="bg-card rounded-xl p-5 border border-border">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-5 h-5 text-primary" />
            <p className="text-sm text-muted-foreground">Total Trip</p>
          </div>
          <p className="text-2xl font-bold text-foreground">{filteredTrips.length}</p>
        </div>
        <div className="bg-card rounded-xl p-5 border border-border">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            <p className="text-sm text-muted-foreground">Rata-rata/Trip</p>
          </div>
          <p className="text-2xl font-bold text-foreground">{avgPerTrip}</p>
        </div>
        <div className="bg-card rounded-xl p-5 border border-border">
          <div className="flex items-center gap-2 mb-2">
            <MapPin className="w-5 h-5 text-primary" />
            <p className="text-sm text-muted-foreground">Rute Aktif</p>
          </div>
          <p className="text-2xl font-bold text-foreground">{passengersByRoute.length}</p>
        </div>
      </div>

      {/* Passengers by Route */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card rounded-xl p-5 border border-border">
          <h3 className="font-semibold text-foreground mb-4">Penumpang per Rute</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={passengersByRoute.slice(0, 8)}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                >
                  {passengersByRoute.slice(0, 8).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-card rounded-xl p-5 border border-border">
          <h3 className="font-semibold text-foreground mb-4">Detail Rute</h3>
          <div className="space-y-3 max-h-[300px] overflow-y-auto">
            {passengersByRoute.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                  <span className="text-sm text-foreground truncate max-w-[200px]">{item.name}</span>
                </div>
                <span className="text-sm font-medium text-foreground">{item.value} orang</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Daily Chart */}
      <div className="bg-card rounded-xl p-5 border border-border">
        <h3 className="font-semibold text-foreground mb-4">Penumpang Harian</h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dailyPassengers}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="label" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="passengers" name="Penumpang" fill="hsl(262, 83%, 58%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Monthly Trend */}
      <div className="bg-card rounded-xl p-5 border border-border">
        <h3 className="font-semibold text-foreground mb-4">Tren Bulanan {selectedYear}</h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={monthlyTrend}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="label" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line type="monotone" dataKey="passengers" name="Penumpang" stroke="hsl(262, 83%, 58%)" strokeWidth={2} dot={{ fill: 'hsl(262, 83%, 58%)' }} />
              <Line type="monotone" dataKey="trips" name="Trip" stroke="hsl(217, 91%, 60%)" strokeWidth={2} dot={{ fill: 'hsl(217, 91%, 60%)' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* By Time Slot */}
      {passengersByTime.length > 0 && (
        <div className="bg-card rounded-xl p-5 border border-border">
          <h3 className="font-semibold text-foreground mb-4">Penumpang per Jam Keberangkatan</h3>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={passengersByTime} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis type="number" tick={{ fontSize: 12 }} />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 12 }} width={60} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="value" name="Penumpang" fill="hsl(142, 76%, 36%)" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportPassengers;
