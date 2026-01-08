import { jsPDF } from 'jspdf';

interface TicketData {
  orderId: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string | null;
  routeFrom: string;
  routeTo: string;
  routeVia?: string | null;
  travelDate: string;
  pickupTime: string;
  pickupAddress: string;
  passengers: number;
  totalPrice: number;
  notes?: string | null;
}

export const generateTicketPdf = (data: TicketData) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  
  // Colors
  const primaryColor: [number, number, number] = [212, 175, 55]; // Gold
  const darkColor: [number, number, number] = [30, 30, 30];
  const grayColor: [number, number, number] = [120, 120, 120];
  
  // Header background
  doc.setFillColor(...primaryColor);
  doc.rect(0, 0, pageWidth, 50, 'F');
  
  // Company name
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('TRAVEL TICKET', pageWidth / 2, 25, { align: 'center' });
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text('E-Ticket / Invoice', pageWidth / 2, 35, { align: 'center' });
  
  // Order ID Box
  doc.setFillColor(245, 245, 245);
  doc.roundedRect(15, 60, pageWidth - 30, 25, 3, 3, 'F');
  
  doc.setTextColor(...darkColor);
  doc.setFontSize(10);
  doc.text('Order ID:', 25, 72);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text(data.orderId, 25, 80);
  
  // Status LUNAS
  doc.setFillColor(34, 197, 94); // Green
  doc.roundedRect(pageWidth - 55, 65, 40, 15, 2, 2, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('LUNAS', pageWidth - 35, 75, { align: 'center' });
  
  let yPos = 100;
  
  // Customer Info Section
  doc.setTextColor(...primaryColor);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('INFORMASI PENUMPANG', 15, yPos);
  
  yPos += 10;
  doc.setDrawColor(220, 220, 220);
  doc.line(15, yPos, pageWidth - 15, yPos);
  
  yPos += 10;
  doc.setTextColor(...grayColor);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text('Nama', 15, yPos);
  doc.text('No. Telepon', 100, yPos);
  
  yPos += 6;
  doc.setTextColor(...darkColor);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text(data.customerName, 15, yPos);
  doc.text(data.customerPhone, 100, yPos);
  
  if (data.customerEmail) {
    yPos += 10;
    doc.setTextColor(...grayColor);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text('Email', 15, yPos);
    yPos += 6;
    doc.setTextColor(...darkColor);
    doc.setFontSize(11);
    doc.text(data.customerEmail, 15, yPos);
  }
  
  // Route Section
  yPos += 20;
  doc.setTextColor(...primaryColor);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('DETAIL PERJALANAN', 15, yPos);
  
  yPos += 10;
  doc.setDrawColor(220, 220, 220);
  doc.line(15, yPos, pageWidth - 15, yPos);
  
  // Route box
  yPos += 10;
  doc.setFillColor(250, 250, 250);
  doc.roundedRect(15, yPos, pageWidth - 30, 30, 3, 3, 'F');
  
  const routeText = data.routeVia 
    ? `${data.routeFrom}  →  ${data.routeVia}  →  ${data.routeTo}`
    : `${data.routeFrom}  →  ${data.routeTo}`;
  
  doc.setTextColor(...darkColor);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text(routeText, pageWidth / 2, yPos + 18, { align: 'center' });
  
  yPos += 45;
  
  // Date & Time
  doc.setTextColor(...grayColor);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text('Tanggal Keberangkatan', 15, yPos);
  doc.text('Jam Penjemputan', 100, yPos);
  
  yPos += 6;
  doc.setTextColor(...darkColor);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  
  const formattedDate = new Date(data.travelDate).toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
  doc.text(formattedDate, 15, yPos);
  doc.text(data.pickupTime, 100, yPos);
  
  yPos += 12;
  doc.setTextColor(...grayColor);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text('Jumlah Penumpang', 15, yPos);
  
  yPos += 6;
  doc.setTextColor(...darkColor);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text(`${data.passengers} orang`, 15, yPos);
  
  // Pickup Address
  yPos += 12;
  doc.setTextColor(...grayColor);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text('Alamat Penjemputan', 15, yPos);
  
  yPos += 6;
  doc.setTextColor(...darkColor);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  const addressLines = doc.splitTextToSize(data.pickupAddress, pageWidth - 30);
  doc.text(addressLines, 15, yPos);
  yPos += addressLines.length * 5;
  
  // Notes if any
  if (data.notes) {
    yPos += 8;
    doc.setTextColor(...grayColor);
    doc.setFontSize(9);
    doc.text('Catatan', 15, yPos);
    
    yPos += 6;
    doc.setTextColor(...darkColor);
    doc.setFontSize(10);
    const notesLines = doc.splitTextToSize(data.notes, pageWidth - 30);
    doc.text(notesLines, 15, yPos);
    yPos += notesLines.length * 5;
  }
  
  // Total Price Box
  yPos += 15;
  doc.setFillColor(...primaryColor);
  doc.roundedRect(15, yPos, pageWidth - 30, 30, 3, 3, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('TOTAL PEMBAYARAN', 25, yPos + 12);
  
  const formattedPrice = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(data.totalPrice);
  
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text(formattedPrice, pageWidth - 25, yPos + 20, { align: 'right' });
  
  // Footer
  const footerY = 270;
  doc.setTextColor(...grayColor);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text('Tiket ini sah sebagai bukti pemesanan yang telah dibayar.', pageWidth / 2, footerY, { align: 'center' });
  doc.text('Harap tunjukkan tiket ini kepada driver saat penjemputan.', pageWidth / 2, footerY + 5, { align: 'center' });
  doc.text(`Dicetak pada: ${new Date().toLocaleString('id-ID')}`, pageWidth / 2, footerY + 12, { align: 'center' });
  
  // Save the PDF
  doc.save(`Tiket-${data.orderId}.pdf`);
};
