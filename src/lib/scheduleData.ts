export interface Schedule {
  id: string;
  from: string;
  to: string;
  via?: string;
  pickupTime: string;
  category: string;
}

export const schedules: Schedule[] = [
  // Jawa - Bali
  { id: 'sby-dps-16', from: 'Surabaya', to: 'Denpasar', pickupTime: '16.00', category: 'Jawa - Bali' },
  { id: 'sby-dps-19', from: 'Surabaya', to: 'Denpasar', pickupTime: '19.00', category: 'Jawa - Bali' },
  { id: 'sby-dps-20', from: 'Surabaya', to: 'Denpasar', pickupTime: '20.00', category: 'Jawa - Bali' },
  { id: 'mlg-dps-16', from: 'Malang', to: 'Denpasar', pickupTime: '16.00', category: 'Jawa - Bali' },
  { id: 'mlg-dps-19', from: 'Malang', to: 'Denpasar', pickupTime: '19.00', category: 'Jawa - Bali' },
  { id: 'mlg-dps-20', from: 'Malang', to: 'Denpasar', pickupTime: '20.00', category: 'Jawa - Bali' },
  
  // Malang - Surabaya
  { id: 'mlg-sby-01', from: 'Malang', to: 'Surabaya', pickupTime: '01.00', category: 'Jawa Timur' },
  { id: 'mlg-sby-05', from: 'Malang', to: 'Surabaya', pickupTime: '05.00', category: 'Jawa Timur' },
  { id: 'mlg-sby-10', from: 'Malang', to: 'Surabaya', pickupTime: '10.00', category: 'Jawa Timur' },
  { id: 'sby-mlg-10', from: 'Surabaya', to: 'Malang', pickupTime: '10.00', category: 'Jawa Timur' },
  { id: 'sby-mlg-13', from: 'Surabaya', to: 'Malang', pickupTime: '13.00', category: 'Jawa Timur' },
  { id: 'sby-mlg-16', from: 'Surabaya', to: 'Malang', pickupTime: '16.00', category: 'Jawa Timur' },
  { id: 'sby-mlg-19', from: 'Surabaya', to: 'Malang', pickupTime: '19.00', category: 'Jawa Timur' },
  
  // Blitar - Surabaya
  { id: 'blt-sby-01', from: 'Blitar', to: 'Surabaya', pickupTime: '01.00', category: 'Jawa Timur' },
  { id: 'blt-sby-05', from: 'Blitar', to: 'Surabaya', pickupTime: '05.00', category: 'Jawa Timur' },
  { id: 'blt-sby-10', from: 'Blitar', to: 'Surabaya', pickupTime: '10.00', category: 'Jawa Timur' },
  { id: 'sby-blt-08', from: 'Surabaya', to: 'Blitar', pickupTime: '08.00', category: 'Jawa Timur' },
  { id: 'sby-blt-10', from: 'Surabaya', to: 'Blitar', pickupTime: '10.00', category: 'Jawa Timur' },
  { id: 'sby-blt-13', from: 'Surabaya', to: 'Blitar', pickupTime: '13.00', category: 'Jawa Timur' },
  { id: 'sby-blt-16', from: 'Surabaya', to: 'Blitar', pickupTime: '16.00', category: 'Jawa Timur' },
  { id: 'sby-blt-19', from: 'Surabaya', to: 'Blitar', pickupTime: '19.00', category: 'Jawa Timur' },
  
  // Kediri - Surabaya
  { id: 'kdr-sby-01', from: 'Kediri', to: 'Surabaya', pickupTime: '01.00', category: 'Jawa Timur' },
  { id: 'kdr-sby-05', from: 'Kediri', to: 'Surabaya', pickupTime: '05.00', category: 'Jawa Timur' },
  { id: 'kdr-sby-08', from: 'Kediri', to: 'Surabaya', pickupTime: '08.00', category: 'Jawa Timur' },
  { id: 'kdr-sby-10', from: 'Kediri', to: 'Surabaya', pickupTime: '10.00', category: 'Jawa Timur' },
  { id: 'sby-kdr-08', from: 'Surabaya', to: 'Kediri', pickupTime: '08.00', category: 'Jawa Timur' },
  { id: 'sby-kdr-10', from: 'Surabaya', to: 'Kediri', pickupTime: '10.00', category: 'Jawa Timur' },
  { id: 'sby-kdr-13', from: 'Surabaya', to: 'Kediri', pickupTime: '13.00', category: 'Jawa Timur' },
  { id: 'sby-kdr-16', from: 'Surabaya', to: 'Kediri', pickupTime: '16.00', category: 'Jawa Timur' },
  { id: 'sby-kdr-19', from: 'Surabaya', to: 'Kediri', pickupTime: '19.00', category: 'Jawa Timur' },
  
  // Banyuwangi - Surabaya
  { id: 'bwi-sby-17', from: 'Banyuwangi', to: 'Surabaya', pickupTime: '17.00', category: 'Jawa Timur' },
  { id: 'bwi-sby-20', from: 'Banyuwangi', to: 'Surabaya', pickupTime: '20.00', category: 'Jawa Timur' },
  { id: 'sby-bwi-16', from: 'Surabaya', to: 'Banyuwangi', pickupTime: '16.00', category: 'Jawa Timur' },
  { id: 'sby-bwi-19', from: 'Surabaya', to: 'Banyuwangi', pickupTime: '19.00', category: 'Jawa Timur' },
  { id: 'sby-bwi-21', from: 'Surabaya', to: 'Banyuwangi', pickupTime: '21.00', category: 'Jawa Timur' },
  
  // Trenggalek - Surabaya
  { id: 'trg-sby-07', from: 'Trenggalek', to: 'Surabaya', pickupTime: '07.00', category: 'Jawa Timur' },
  { id: 'trg-sby-10', from: 'Trenggalek', to: 'Surabaya', pickupTime: '10.00', category: 'Jawa Timur' },
  { id: 'sby-trg-10', from: 'Surabaya', to: 'Trenggalek', pickupTime: '10.00', category: 'Jawa Timur' },
  { id: 'sby-trg-13', from: 'Surabaya', to: 'Trenggalek', pickupTime: '13.00', category: 'Jawa Timur' },
  { id: 'sby-trg-16', from: 'Surabaya', to: 'Trenggalek', pickupTime: '16.00', category: 'Jawa Timur' },
  { id: 'sby-trg-19', from: 'Surabaya', to: 'Trenggalek', pickupTime: '19.00', category: 'Jawa Timur' },
  { id: 'sby-trg-21', from: 'Surabaya', to: 'Trenggalek', pickupTime: '21.00', category: 'Jawa Timur' },
  
  // Ponorogo - Madiun - Surabaya
  { id: 'pnr-sby-01', from: 'Ponorogo', to: 'Surabaya', via: 'Madiun', pickupTime: '01.00', category: 'Jawa Timur' },
  { id: 'pnr-sby-05', from: 'Ponorogo', to: 'Surabaya', via: 'Madiun', pickupTime: '05.00', category: 'Jawa Timur' },
  { id: 'pnr-sby-08', from: 'Ponorogo', to: 'Surabaya', via: 'Madiun', pickupTime: '08.00', category: 'Jawa Timur' },
  { id: 'pnr-sby-10', from: 'Ponorogo', to: 'Surabaya', via: 'Madiun', pickupTime: '10.00', category: 'Jawa Timur' },
  { id: 'sby-pnr-10', from: 'Surabaya', to: 'Ponorogo', via: 'Madiun', pickupTime: '10.00', category: 'Jawa Timur' },
  { id: 'sby-pnr-13', from: 'Surabaya', to: 'Ponorogo', via: 'Madiun', pickupTime: '13.00', category: 'Jawa Timur' },
  { id: 'sby-pnr-16', from: 'Surabaya', to: 'Ponorogo', via: 'Madiun', pickupTime: '16.00', category: 'Jawa Timur' },
  { id: 'sby-pnr-19', from: 'Surabaya', to: 'Ponorogo', via: 'Madiun', pickupTime: '19.00', category: 'Jawa Timur' },
  
  // Jember - Lumajang - Surabaya
  { id: 'jbr-sby-20', from: 'Jember', to: 'Surabaya', via: 'Lumajang', pickupTime: '20.00', category: 'Jawa Timur' },
  { id: 'jbr-sby-01', from: 'Jember', to: 'Surabaya', via: 'Lumajang', pickupTime: '01.00', category: 'Jawa Timur' },
  { id: 'jbr-sby-05', from: 'Jember', to: 'Surabaya', via: 'Lumajang', pickupTime: '05.00', category: 'Jawa Timur' },
  { id: 'jbr-sby-10', from: 'Jember', to: 'Surabaya', via: 'Lumajang', pickupTime: '10.00', category: 'Jawa Timur' },
  { id: 'sby-jbr-10', from: 'Surabaya', to: 'Jember', via: 'Lumajang', pickupTime: '10.00', category: 'Jawa Timur' },
  { id: 'sby-jbr-13', from: 'Surabaya', to: 'Jember', via: 'Lumajang', pickupTime: '13.00', category: 'Jawa Timur' },
  { id: 'sby-jbr-16', from: 'Surabaya', to: 'Jember', via: 'Lumajang', pickupTime: '16.00', category: 'Jawa Timur' },
  { id: 'sby-jbr-19', from: 'Surabaya', to: 'Jember', via: 'Lumajang', pickupTime: '19.00', category: 'Jawa Timur' },
  
  // Jakarta - Surabaya
  { id: 'jkt-sby-16', from: 'Jakarta', to: 'Surabaya', pickupTime: '16.00', category: 'Jawa - Jakarta' },
  { id: 'jkt-sby-21', from: 'Jakarta', to: 'Surabaya', pickupTime: '21.00', category: 'Jawa - Jakarta' },
  { id: 'jkt-sby-22', from: 'Jakarta', to: 'Surabaya', pickupTime: '22.00', category: 'Jawa - Jakarta' },
  { id: 'sby-jkt-18', from: 'Surabaya', to: 'Jakarta', pickupTime: '18.00', category: 'Jawa - Jakarta' },
  { id: 'sby-jkt-20', from: 'Surabaya', to: 'Jakarta', pickupTime: '20.00', category: 'Jawa - Jakarta' },
  { id: 'sby-jkt-22', from: 'Surabaya', to: 'Jakarta', pickupTime: '22.00', category: 'Jawa - Jakarta' },
  
  // Jogja - Solo - Surabaya
  { id: 'jog-sby-18', from: 'Jogja', to: 'Surabaya', via: 'Solo', pickupTime: '18.00', category: 'Jawa Tengah - DIY' },
  { id: 'jog-sby-20', from: 'Jogja', to: 'Surabaya', via: 'Solo', pickupTime: '20.00', category: 'Jawa Tengah - DIY' },
  { id: 'jog-sby-21', from: 'Jogja', to: 'Surabaya', via: 'Solo', pickupTime: '21.00', category: 'Jawa Tengah - DIY' },
  { id: 'sby-jog-10', from: 'Surabaya', to: 'Jogja', via: 'Solo', pickupTime: '10.00', category: 'Jawa Tengah - DIY' },
  { id: 'sby-jog-13', from: 'Surabaya', to: 'Jogja', via: 'Solo', pickupTime: '13.00', category: 'Jawa Tengah - DIY' },
  { id: 'sby-jog-16', from: 'Surabaya', to: 'Jogja', via: 'Solo', pickupTime: '16.00', category: 'Jawa Tengah - DIY' },
  { id: 'sby-jog-19', from: 'Surabaya', to: 'Jogja', via: 'Solo', pickupTime: '19.00', category: 'Jawa Tengah - DIY' },
  { id: 'sby-jog-20', from: 'Surabaya', to: 'Jogja', via: 'Solo', pickupTime: '20.00', category: 'Jawa Tengah - DIY' },
];

export const searchSchedules = (from: string, to: string): Schedule[] => {
  return schedules.filter(
    (s) => s.from.toLowerCase() === from.toLowerCase() && s.to.toLowerCase() === to.toLowerCase()
  );
};
