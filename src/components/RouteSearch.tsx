import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Calendar, Users, Search, ArrowRight, ArrowLeftRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const cities = [
  'Surabaya', 'Malang', 'Denpasar', 'Blitar', 'Kediri', 
  'Banyuwangi', 'Trenggalek', 'Ponorogo', 'Madiun', 
  'Jember', 'Lumajang', 'Jakarta', 'Jogja', 'Solo'
];

const RouteSearch = () => {
  const navigate = useNavigate();
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState('');
  const [passengers, setPassengers] = useState('1');

  const swapCities = () => {
    const temp = origin;
    setOrigin(destination);
    setDestination(temp);
  };

  const handleSearch = () => {
    if (!origin || !destination) {
      toast.error('Pilih kota asal dan tujuan');
      return;
    }
    if (!date) {
      toast.error('Pilih tanggal keberangkatan');
      return;
    }
    if (origin === destination) {
      toast.error('Kota asal dan tujuan tidak boleh sama');
      return;
    }
    
    const params = new URLSearchParams({
      from: origin,
      to: destination,
      date: date,
      passengers: passengers,
    });
    navigate(`/search?${params.toString()}`);
  };

  return (
    <div className="glass-card rounded-2xl p-6 md:p-8 shadow-2xl">
      <h3 className="font-display text-xl font-semibold text-foreground mb-6">
        Cari Jadwal Perjalanan
      </h3>

      <div className="space-y-5">
        {/* Origin & Destination */}
        <div className="relative">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="relative">
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                Kota Asal
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-primary" />
                <select
                  value={origin}
                  onChange={(e) => setOrigin(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-secondary/50 border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors appearance-none cursor-pointer"
                >
                  <option value="">Pilih kota asal</option>
                  {cities.map((city) => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Swap button */}
            <button
              onClick={swapCities}
              className="absolute left-1/2 top-[52px] -translate-x-1/2 z-10 w-10 h-10 bg-card border-2 border-border rounded-full flex items-center justify-center hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-300 hidden md:flex"
              title="Tukar kota"
            >
              <ArrowLeftRight className="w-4 h-4" />
            </button>

            <div className="relative">
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                Kota Tujuan
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-accent" />
                <select
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-secondary/50 border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors appearance-none cursor-pointer"
                >
                  <option value="">Pilih kota tujuan</option>
                  {cities.map((city) => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Date & Passengers */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">
              Tanggal Berangkat
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full pl-10 pr-4 py-3 bg-secondary/50 border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">
              Jumlah Penumpang
            </label>
            <div className="relative">
              <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <select
                value={passengers}
                onChange={(e) => setPassengers(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-secondary/50 border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors appearance-none cursor-pointer"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                  <option key={num} value={num}>{num} Penumpang</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Search Button */}
        <Button
          onClick={handleSearch}
          className="w-full btn-gold py-6 text-lg group"
        >
          <Search className="w-5 h-5 mr-2" />
          Cari Jadwal
          <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
        </Button>
      </div>
    </div>
  );
};

export default RouteSearch;
