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
    <div className="bg-card/95 backdrop-blur-xl rounded-2xl md:rounded-3xl p-5 sm:p-6 md:p-8 lg:p-10 shadow-2xl border border-border/50">
      <div className="flex items-center gap-2 md:gap-3 mb-5 md:mb-8">
        <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-primary/10 flex items-center justify-center">
          <Search className="w-5 h-5 md:w-6 md:h-6 text-primary" />
        </div>
        <div>
          <h3 className="font-display text-lg md:text-xl font-semibold text-foreground">
            Cari Jadwal Perjalanan
          </h3>
          <p className="text-xs md:text-sm text-muted-foreground">Pesan tiket dengan mudah</p>
        </div>
      </div>

      <div className="space-y-4 md:space-y-6">
        {/* Origin & Destination */}
        <div className="relative">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
            <div className="relative group">
              <label className="block text-xs md:text-sm font-medium text-foreground mb-1.5 md:mb-2">
                Kota Asal
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-primary transition-colors" />
                <select
                  value={origin}
                  onChange={(e) => setOrigin(e.target.value)}
                  className="w-full pl-10 md:pl-12 pr-3 md:pr-4 py-3 md:py-4 bg-muted/50 border-2 border-transparent rounded-lg md:rounded-xl focus:border-primary focus:bg-background transition-all duration-300 appearance-none cursor-pointer text-foreground font-medium text-sm md:text-base"
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
              className="absolute left-1/2 top-[52px] md:top-[58px] -translate-x-1/2 z-10 w-9 h-9 md:w-11 md:h-11 bg-card border-2 border-primary/20 rounded-full flex items-center justify-center hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-300 hidden sm:flex shadow-lg"
              title="Tukar kota"
            >
              <ArrowLeftRight className="w-4 h-4 md:w-5 md:h-5" />
            </button>

            <div className="relative group">
              <label className="block text-xs md:text-sm font-medium text-foreground mb-1.5 md:mb-2">
                Kota Tujuan
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-accent transition-colors" />
                <select
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="w-full pl-10 md:pl-12 pr-3 md:pr-4 py-3 md:py-4 bg-muted/50 border-2 border-transparent rounded-lg md:rounded-xl focus:border-primary focus:bg-background transition-all duration-300 appearance-none cursor-pointer text-foreground font-medium text-sm md:text-base"
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
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
          <div>
            <label className="block text-xs md:text-sm font-medium text-foreground mb-1.5 md:mb-2">
              Tanggal Berangkat
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-muted-foreground" />
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full pl-10 md:pl-12 pr-3 md:pr-4 py-3 md:py-4 bg-muted/50 border-2 border-transparent rounded-lg md:rounded-xl focus:border-primary focus:bg-background transition-all duration-300 text-foreground font-medium text-sm md:text-base"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs md:text-sm font-medium text-foreground mb-1.5 md:mb-2">
              Jumlah Penumpang
            </label>
            <div className="relative">
              <Users className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-muted-foreground" />
              <select
                value={passengers}
                onChange={(e) => setPassengers(e.target.value)}
                className="w-full pl-10 md:pl-12 pr-3 md:pr-4 py-3 md:py-4 bg-muted/50 border-2 border-transparent rounded-lg md:rounded-xl focus:border-primary focus:bg-background transition-all duration-300 appearance-none cursor-pointer text-foreground font-medium text-sm md:text-base"
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
          className="w-full bg-gradient-to-r from-accent to-yellow-500 hover:from-accent/90 hover:to-yellow-500/90 text-accent-foreground py-5 md:py-7 text-base md:text-lg font-semibold rounded-lg md:rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 group"
        >
          <Search className="w-4 h-4 md:w-5 md:h-5 mr-2" />
          Cari Jadwal
          <ArrowRight className="w-4 h-4 md:w-5 md:h-5 ml-2 group-hover:translate-x-1 transition-transform" />
        </Button>
      </div>
    </div>
  );
};

export default RouteSearch;
