import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Plus, Loader2, Check, ChevronsUpDown } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface Schedule {
  id: string;
  route_from: string;
  route_to: string;
  route_via: string | null;
  pickup_time: string;
  price: number;
  category: string;
}

interface OfflineBookingFormProps {
  onBookingCreated: () => void;
}

const OfflineBookingForm = ({ onBookingCreated }: OfflineBookingFormProps) => {
  const [open, setOpen] = useState(false);
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  
  // Form state
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [selectedScheduleId, setSelectedScheduleId] = useState('');
  const [travelDate, setTravelDate] = useState('');
  const [passengers, setPassengers] = useState(1);
  const [pickupAddress, setPickupAddress] = useState('');
  const [dropoffAddress, setDropoffAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('paid');

  useEffect(() => {
    fetchSchedules();
  }, []);

  const fetchSchedules = async () => {
    const { data, error } = await supabase
      .from('schedules')
      .select('*')
      .eq('is_active', true)
      .order('route_from');
    
    if (!error && data) {
      setSchedules(data);
    }
  };

  const generateOrderId = () => {
    const now = new Date();
    const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `TRV-${dateStr}-${random}`;
  };

  const resetForm = () => {
    setCustomerName('');
    setCustomerPhone('');
    setCustomerEmail('');
    setSelectedScheduleId('');
    setTravelDate('');
    setPassengers(1);
    setPickupAddress('');
    setDropoffAddress('');
    setNotes('');
    setPaymentStatus('paid');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!customerName.trim() || !customerPhone.trim() || !selectedScheduleId || !travelDate || !pickupAddress.trim()) {
      toast.error('Mohon lengkapi data yang wajib diisi');
      return;
    }

    const selectedSchedule = schedules.find(s => s.id === selectedScheduleId);
    if (!selectedSchedule) {
      toast.error('Jadwal tidak ditemukan');
      return;
    }

    setIsLoading(true);
    
    try {
      const orderId = generateOrderId();
      const totalPrice = selectedSchedule.price * passengers;

      const { error } = await supabase.from('bookings').insert({
        order_id: orderId,
        customer_name: customerName.trim(),
        customer_phone: customerPhone.trim(),
        customer_email: customerEmail.trim() || null,
        route_from: selectedSchedule.route_from,
        route_to: selectedSchedule.route_to,
        route_via: selectedSchedule.route_via,
        pickup_time: selectedSchedule.pickup_time,
        travel_date: travelDate,
        passengers: passengers,
        total_price: totalPrice,
        pickup_address: pickupAddress.trim(),
        dropoff_address: dropoffAddress.trim() || null,
        notes: notes.trim() ? `[OFFLINE] ${notes.trim()}` : '[OFFLINE]',
        payment_status: paymentStatus,
      });

      if (error) throw error;

      toast.success(`Pesanan offline berhasil dibuat: ${orderId}`);
      resetForm();
      setOpen(false);
      onBookingCreated();
    } catch (error) {
      console.error('Error creating offline booking:', error);
      toast.error('Gagal membuat pesanan offline');
    } finally {
      setIsLoading(false);
    }
  };

  const selectedSchedule = schedules.find(s => s.id === selectedScheduleId);
  const totalPrice = selectedSchedule ? selectedSchedule.price * passengers : 0;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatScheduleLabel = (schedule: Schedule) => {
    const route = schedule.route_via 
      ? `${schedule.route_from} → ${schedule.route_via} → ${schedule.route_to}`
      : `${schedule.route_from} → ${schedule.route_to}`;
    return `${route} (${schedule.pickup_time})`;
  };

  const getScheduleSearchString = (schedule: Schedule) => {
    return `${schedule.route_from} ${schedule.route_to} ${schedule.route_via || ''} ${schedule.pickup_time} ${schedule.category}`.toLowerCase();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Tambah Pesanan Offline
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Tambah Pesanan Offline</DialogTitle>
          <DialogDescription>
            Input pesanan dari pelanggan yang memesan langsung ke admin
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Customer Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="customerName">Nama Pelanggan *</Label>
              <Input
                id="customerName"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Nama lengkap"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="customerPhone">No. Telepon *</Label>
              <Input
                id="customerPhone"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="08xxxxxxxxxx"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="customerEmail">Email (Opsional)</Label>
            <Input
              id="customerEmail"
              type="email"
              value={customerEmail}
              onChange={(e) => setCustomerEmail(e.target.value)}
              placeholder="email@example.com"
            />
          </div>

          {/* Schedule Selection with Search */}
          <div className="space-y-2">
            <Label>Pilih Jadwal *</Label>
            <Popover open={scheduleOpen} onOpenChange={setScheduleOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={scheduleOpen}
                  className="w-full justify-between h-auto min-h-10 py-2 text-left font-normal"
                >
                  {selectedSchedule ? (
                    <div className="flex flex-col items-start gap-0.5">
                      <span className="text-sm">{formatScheduleLabel(selectedSchedule)}</span>
                      <span className="text-xs text-muted-foreground">{formatPrice(selectedSchedule.price)}</span>
                    </div>
                  ) : (
                    <span className="text-muted-foreground">Cari dan pilih jadwal...</span>
                  )}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[500px] p-0 bg-popover border shadow-lg z-50" align="start">
                <Command>
                  <CommandInput placeholder="Ketik rute, jam, atau kategori..." />
                  <CommandList>
                    <CommandEmpty>Jadwal tidak ditemukan.</CommandEmpty>
                    <CommandGroup>
                      {schedules.map((schedule) => (
                        <CommandItem
                          key={schedule.id}
                          value={getScheduleSearchString(schedule)}
                          onSelect={() => {
                            setSelectedScheduleId(schedule.id);
                            setScheduleOpen(false);
                          }}
                          className="flex items-center justify-between py-3 cursor-pointer"
                        >
                          <div className="flex flex-col gap-0.5">
                            <span className="font-medium">{formatScheduleLabel(schedule)}</span>
                            <span className="text-xs text-muted-foreground">
                              {schedule.category} • {formatPrice(schedule.price)}
                            </span>
                          </div>
                          <Check
                            className={cn(
                              "h-4 w-4",
                              selectedScheduleId === schedule.id ? "opacity-100" : "opacity-0"
                            )}
                          />
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          {/* Travel Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="travelDate">Tanggal Perjalanan *</Label>
              <Input
                id="travelDate"
                type="date"
                value={travelDate}
                onChange={(e) => setTravelDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="passengers">Jumlah Penumpang *</Label>
              <Input
                id="passengers"
                type="number"
                min={1}
                max={10}
                value={passengers}
                onChange={(e) => setPassengers(parseInt(e.target.value) || 1)}
                required
              />
            </div>
          </div>

          {/* Address */}
          <div className="space-y-2">
            <Label htmlFor="pickupAddress">Alamat Jemput *</Label>
            <Textarea
              id="pickupAddress"
              value={pickupAddress}
              onChange={(e) => setPickupAddress(e.target.value)}
              placeholder="Alamat lengkap penjemputan"
              rows={2}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="dropoffAddress">Alamat Tujuan (Opsional)</Label>
            <Textarea
              id="dropoffAddress"
              value={dropoffAddress}
              onChange={(e) => setDropoffAddress(e.target.value)}
              placeholder="Alamat lengkap tujuan"
              rows={2}
            />
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Catatan (Opsional)</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Catatan tambahan..."
              rows={2}
            />
          </div>

          {/* Payment Status */}
          <div className="space-y-2">
            <Label>Status Pembayaran</Label>
            <Select value={paymentStatus} onValueChange={setPaymentStatus}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="paid">Lunas</SelectItem>
                <SelectItem value="pending">Belum Bayar</SelectItem>
                <SelectItem value="waiting_verification">Menunggu Verifikasi</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Total Price Display */}
          {selectedSchedule && (
            <div className="p-4 bg-muted rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Harga per orang:</span>
                <span>{formatPrice(selectedSchedule.price)}</span>
              </div>
              <div className="flex justify-between items-center text-lg font-bold mt-2">
                <span>Total ({passengers} orang):</span>
                <span className="text-accent">{formatPrice(totalPrice)}</span>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Batal
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Simpan Pesanan
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default OfflineBookingForm;
