import jsPDF from 'jspdf';

export interface ManifestPassenger {
  name: string;
  phone: string;
  pickupAddress: string;
  dropoffAddress: string | null;
  passengers: number;
  notes: string | null;
  hasLargeLuggage: boolean;
  luggageDescription: string | null;
  hasPackageDelivery: boolean;
  packageDescription: string | null;
  specialRequests: string | null;
  paymentStatus: string;
}

export interface ManifestData {
  agentName: string;
  tripDate: string;
  pickupTime: string;
  routeFrom: string;
  routeTo: string;
  routeVia: string | null;
  vehicleNumber: string | null;
  driverName: string | null;
  driverPhone: string | null;
  passengers: ManifestPassenger[];
}

export const generateManifestPdf = (data: ManifestData): void => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 15;
  const contentWidth = pageWidth - margin * 2;
  let y = margin;

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('id-ID', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const getPaymentLabel = (status: string) => {
    switch (status) {
      case 'paid': return 'LUNAS';
      case 'pending': return 'BELUM BAYAR';
      case 'waiting_verification': return 'VERIFIKASI';
      case 'cancelled': return 'BATAL';
      default: return status.toUpperCase();
    }
  };

  const checkNewPage = (neededHeight: number) => {
    if (y + neededHeight > pageHeight - margin) {
      doc.addPage();
      y = margin;
      return true;
    }
    return false;
  };

  // Helper to draw dotted line
  const drawDottedLine = (startX: number, endX: number, yPos: number) => {
    const dotText = '.'.repeat(Math.floor((endX - startX) / 1.2));
    doc.text(dotText, startX, yPos);
  };

  // Helper to draw form field with dots
  const drawFormField = (label: string, value: string, yPos: number, labelWidth: number = 25) => {
    const labelX = margin;
    const colonX = margin + labelWidth;
    const valueX = colonX + 5;
    const lineEnd = margin + contentWidth;

    doc.setFont('helvetica', 'normal');
    doc.text(label, labelX, yPos);
    doc.text(':', colonX, yPos);
    
    if (value) {
      doc.text(value, valueX, yPos);
    }
    
    // Draw dots after value
    const valueWidth = value ? doc.getTextWidth(value) + 2 : 0;
    const dotsStartX = valueX + valueWidth;
    if (dotsStartX < lineEnd - 5) {
      drawDottedLine(dotsStartX, lineEnd, yPos);
    }
  };

  // Header - Simple title
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 0, 0);
  doc.text('MANIFES PERJALANAN', pageWidth / 2, y, { align: 'center' });
  y += 6;

  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.text(data.agentName, pageWidth / 2, y, { align: 'center' });
  y += 10;

  // Trip Info - simple format
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  
  const route = data.routeVia 
    ? `${data.routeFrom} - ${data.routeVia} - ${data.routeTo}`
    : `${data.routeFrom} - ${data.routeTo}`;

  doc.text(`Rute: ${route}`, margin, y);
  y += 5;
  doc.text(`Tanggal: ${formatDate(data.tripDate)}`, margin, y);
  y += 5;
  doc.text(`Jam Jemput: ${data.pickupTime}`, margin, y);
  y += 5;
  doc.text(`Armada: ${data.vehicleNumber || '-'}`, margin, y);
  doc.text(`Sopir: ${data.driverName || '-'} (${data.driverPhone || '-'})`, margin + 70, y);
  y += 5;

  // Summary
  const totalPassengers = data.passengers.reduce((sum, p) => sum + p.passengers, 0);
  const paidCount = data.passengers.filter(p => p.paymentStatus === 'paid').length;
  doc.text(`Total: ${totalPassengers} Penumpang  |  Lunas: ${paidCount}/${data.passengers.length} Booking`, margin, y);
  y += 10;

  // Divider line
  doc.setDrawColor(0, 0, 0);
  doc.line(margin, y, margin + contentWidth, y);
  y += 8;

  // Passengers List - Form format like the image
  doc.setFontSize(10);
  
  data.passengers.forEach((passenger, index) => {
    const passengerHeight = 35; // Estimated height per passenger
    checkNewPage(passengerHeight);

    // Number
    doc.setFont('helvetica', 'bold');
    doc.text(`${index + 1}.`, margin, y);
    
    // Payment status on the right
    const statusText = `[${getPaymentLabel(passenger.paymentStatus)}]`;
    doc.text(statusText, margin + contentWidth - doc.getTextWidth(statusText), y);
    
    y += 5;

    // Form fields with dots
    doc.setFont('helvetica', 'normal');
    drawFormField('Nama', `${passenger.name} (${passenger.passengers} org)`, y, 20);
    y += 5;
    
    drawFormField('Alamat', passenger.pickupAddress, y, 20);
    y += 5;
    
    drawFormField('Telp', passenger.phone, y, 20);
    y += 5;
    
    drawFormField('Tujuan', passenger.dropoffAddress || '-', y, 20);
    y += 5;

    // Additional notes if any
    const additionalNotes: string[] = [];
    if (passenger.hasLargeLuggage) {
      additionalNotes.push(`Barang besar${passenger.luggageDescription ? ': ' + passenger.luggageDescription : ''}`);
    }
    if (passenger.hasPackageDelivery) {
      additionalNotes.push(`Titipan${passenger.packageDescription ? ': ' + passenger.packageDescription : ''}`);
    }
    if (passenger.specialRequests) {
      additionalNotes.push(passenger.specialRequests);
    }
    if (passenger.notes) {
      additionalNotes.push(passenger.notes);
    }

    if (additionalNotes.length > 0) {
      drawFormField('Ket', additionalNotes.join(', '), y, 20);
      y += 5;
    }

    y += 3; // Space between passengers
  });

  // Footer
  checkNewPage(15);
  y += 5;
  doc.setDrawColor(0, 0, 0);
  doc.line(margin, y, margin + contentWidth, y);
  y += 6;

  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  doc.text(
    `Dicetak: ${new Date().toLocaleString('id-ID')}`,
    pageWidth / 2,
    y,
    { align: 'center' }
  );

  // Save
  const dateStr = data.tripDate.replace(/-/g, '');
  const fileName = `Manifes-${data.routeFrom}-${data.routeTo}-${dateStr}.pdf`;
  doc.save(fileName);
};
