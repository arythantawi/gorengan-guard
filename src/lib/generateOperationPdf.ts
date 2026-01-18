import { jsPDF } from 'jspdf';
import logo44Trans from '@/assets/logo-44trans.png';

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
}

export const generateOperationPdf = async (trip: TripOperation): Promise<void> => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: [120, 220] // Custom size similar to receipt (slightly taller for logo)
  });
  
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 8;
  const contentWidth = pageWidth - margin * 2;
  
  // Colors - gold theme to match brand
  const gold: [number, number, number] = [180, 142, 38];
  const black: [number, number, number] = [0, 0, 0];
  
  // Helper for currency formatting
  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('id-ID').format(price);
  };
  
  // Helper for date formatting
  const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString().slice(-2);
    return `${day}-${month}-${year}`;
  };
  
  // Calculate totals
  const totalExpenseItems = 
    trip.expense_fuel + 
    trip.expense_ferry + 
    trip.expense_snack + 
    trip.expense_meals + 
    trip.expense_driver_commission + 
    trip.expense_driver_meals;
  
  const totalExpenseAll = totalExpenseItems + 
    trip.expense_toll + 
    trip.expense_parking + 
    trip.expense_other;
  
  const profit = trip.income_tickets - totalExpenseAll;
  
  // Calculate commission percentage
  const commissionPercent = trip.income_tickets > 0 
    ? Math.round((trip.expense_driver_commission / trip.income_tickets) * 100) 
    : 15;
  
  let y = margin;
  const rowHeight = 7;
  const labelCol = 45;
  const midCol = 15;
  const valueCol = contentWidth - labelCol - midCol;

  // Load logo as base64
  const loadLogo = (): Promise<string> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0);
        resolve(canvas.toDataURL('image/png'));
      };
      img.onerror = () => resolve('');
      img.src = logo44Trans;
    });
  };

  const logoBase64 = await loadLogo();
  
  // === HEADER ===
  doc.setDrawColor(...gold);
  doc.setTextColor(...gold);

  // Logo with border
  if (logoBase64) {
    doc.setLineWidth(0.5);
    doc.circle(pageWidth / 2, y + 10, 10, 'S');
    doc.addImage(logoBase64, 'PNG', pageWidth / 2 - 8, y + 2, 16, 16);
    y += 22;
  }
  
  // Company name
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('44 TRANS JAWA BALI', pageWidth / 2, y + 3, { align: 'center' });
  
  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.text('LAYANAN ANTAR JEMPUT', pageWidth / 2, y + 8, { align: 'center' });
  doc.text('SURABAYA - DENPASAR PP', pageWidth / 2, y + 12, { align: 'center' });
  
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('OMSET TRAVEL', pageWidth / 2, y + 18, { align: 'center' });
  
  // Underline
  doc.setLineWidth(0.5);
  doc.line(margin, y + 21, pageWidth - margin, y + 21);
  
  y += 28;
  
  // === TABLE HELPERS ===
  const drawInfoRow = (label: string, midLabel: string, value: string) => {
    // Draw borders
    doc.setDrawColor(...gold);
    doc.setLineWidth(0.3);
    doc.rect(margin, y, labelCol, rowHeight, 'S');
    doc.rect(margin + labelCol, y, midCol, rowHeight, 'S');
    doc.rect(margin + labelCol + midCol, y, valueCol, rowHeight, 'S');
    
    // Draw text
    doc.setTextColor(...black);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.text(label, margin + 2, y + 5);
    
    doc.setFont('helvetica', 'normal');
    doc.text(midLabel, margin + labelCol + 2, y + 5);
    doc.text(value, margin + labelCol + midCol + 2, y + 5);
    
    y += rowHeight;
  };
  
  const drawSimpleRow = (label: string, value: string, isBold: boolean = false) => {
    doc.setDrawColor(...gold);
    doc.setLineWidth(0.3);
    doc.rect(margin, y, labelCol + midCol, rowHeight, 'S');
    doc.rect(margin + labelCol + midCol, y, valueCol, rowHeight, 'S');
    
    doc.setTextColor(...black);
    doc.setFontSize(8);
    doc.setFont('helvetica', isBold ? 'bold' : 'normal');
    doc.text(label, margin + 2, y + 5);
    doc.text(value, margin + contentWidth - 2, y + 5, { align: 'right' });
    
    y += rowHeight;
  };
  
  const drawExpenseRow = (label: string, midLabel: string, value: string) => {
    doc.setDrawColor(...gold);
    doc.setLineWidth(0.3);
    doc.rect(margin, y, labelCol, rowHeight, 'S');
    doc.rect(margin + labelCol, y, midCol, rowHeight, 'S');
    doc.rect(margin + labelCol + midCol, y, valueCol, rowHeight, 'S');
    
    doc.setTextColor(...black);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.text(label, margin + 2, y + 5);
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.text(midLabel, margin + labelCol + 2, y + 5);
    
    doc.setFontSize(8);
    doc.text(value, margin + contentWidth - 2, y + 5, { align: 'right' });
    
    y += rowHeight;
  };
  
  const drawSectionHeader = (title: string) => {
    doc.setTextColor(...gold);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text(title, margin, y + 5);
    
    // Underline
    doc.setLineWidth(0.5);
    const textWidth = doc.getTextWidth(title);
    doc.line(margin, y + 6, margin + textWidth + 5, y + 6);
    
    y += rowHeight + 1;
  };
  
  // === TRIP INFO ===
  drawInfoRow('Dari', 'Ke :', `${trip.route_from} → ${trip.route_to}`);
  drawSimpleRow('Plat Nomor', trip.vehicle_number || '-');
  drawSimpleRow('Sopir', trip.driver_name || '-');
  drawSimpleRow('Tanggal Berangkat', formatDate(trip.trip_date));
  drawSimpleRow('Jam Penjemputan', trip.pickup_time);
  drawSimpleRow('Jumlah Penumpang', `${trip.total_passengers} PAX`);
  drawSimpleRow('Total Uang Tiket', formatPrice(trip.income_tickets), true);
  
  y += 3;
  
  // === PENGELUARAN ===
  drawSectionHeader('PENGELUARAN');
  
  drawExpenseRow('SOLAR', 'Liter', formatPrice(trip.expense_fuel));
  drawExpenseRow('PENYEBRANGAN', '', formatPrice(trip.expense_ferry));
  drawExpenseRow('SNACK', 'Orang', formatPrice(trip.expense_snack));
  drawExpenseRow('MAKAN', 'Orang', formatPrice(trip.expense_meals));
  drawExpenseRow('KOMISI SOPIR', `${commissionPercent}%`, formatPrice(trip.expense_driver_commission));
  drawExpenseRow('UANG MAKAN + LAIN', '', formatPrice(trip.expense_driver_meals + trip.expense_other));
  
  // Additional expenses if any
  if (trip.expense_toll > 0) {
    drawExpenseRow('TOL', '', formatPrice(trip.expense_toll));
  }
  if (trip.expense_parking > 0) {
    drawExpenseRow('PARKIR', '', formatPrice(trip.expense_parking));
  }
  
  // Empty row for spacing
  y += 5;
  
  // === TOTAL ===
  drawSimpleRow('TOTAL', formatPrice(totalExpenseAll), true);
  
  y += 3;
  
  // === SUMMARY ===
  drawSimpleRow('TOTAL UANG TIKET', formatPrice(trip.income_tickets), true);
  drawSimpleRow('TOTAL PENGELUARAN', formatPrice(totalExpenseAll), true);
  drawSimpleRow('JUMLAH BERSIH', formatPrice(profit), true);
  
  y += 8;
  
  // === FOOTER ===
  doc.setTextColor(...black);
  doc.setFontSize(7);
  doc.setFont('helvetica', 'bold');
  doc.text('YANG MENERIMA', margin, y);
  doc.text('CATATAN :', margin + contentWidth / 2 + 10, y);
  
  // Signature area
  y += 3;
  doc.setDrawColor(...gold);
  doc.setLineWidth(0.3);
  
  // Left signature box
  doc.line(margin, y + 15, margin + 35, y + 15);
  doc.text('(', margin + 5, y + 19);
  doc.text(')', margin + 30, y + 19);
  
  // Notes lines
  doc.line(margin + contentWidth / 2 + 10, y + 5, pageWidth - margin, y + 5);
  doc.line(margin + contentWidth / 2 + 10, y + 10, pageWidth - margin, y + 10);
  doc.line(margin + contentWidth / 2 + 10, y + 15, pageWidth - margin, y + 15);
  
  // Add notes text if exists
  if (trip.notes) {
    doc.setFontSize(6);
    doc.setFont('helvetica', 'normal');
    const notesLines = doc.splitTextToSize(trip.notes, contentWidth / 2 - 5);
    doc.text(notesLines.slice(0, 3), margin + contentWidth / 2 + 12, y + 4);
  }
  
  // Save file
  const fileName = `Omset-${trip.route_from}-${trip.route_to}-${formatDate(trip.trip_date).replace(/\//g, '-')}.pdf`;
  doc.save(fileName);
};
