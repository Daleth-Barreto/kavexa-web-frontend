
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface PdfOptions {
  title: string;
  headers: string[][];
  body: (string | number)[][];
  filename: string;
}

const addHeader = (doc: jsPDF, title: string) => {
  const pageWidth = doc.internal.pageSize.getWidth();
  
  // Kavexa Logo (simplified SVG)
  const logoColor = '#A085CF'; 
  doc.setDrawColor(logoColor);
  doc.setLineWidth(0.5);
  doc.setLineCap('round');
  doc.setLineJoin('round');
  const d = "M10 21 L20 3 L22.5 11 L28 12 L20 23 L17.5 15 Z";
  const pathCommands = d.split(' ').map(c => c.trim());
  
  let currentX = 0;
  let currentY = 0;
  
  // Scale down the logo coordinates
  const scale = 0.5; 
  const offsetX = 10;
  const offsetY = 12;

  for (let i = 0; i < pathCommands.length; i++) {
    const cmd = pathCommands[i];
    if (cmd === 'M') {
      currentX = parseFloat(pathCommands[i + 1]) * scale + offsetX;
      currentY = parseFloat(pathCommands[i + 2]) * scale + offsetY;
      i += 2;
    } else if (cmd === 'L') {
      const x = parseFloat(pathCommands[i + 1]) * scale + offsetX;
      const y = parseFloat(pathCommands[i + 2]) * scale + offsetY;
      doc.line(currentX, currentY, x, y);
      currentX = x;
      currentY = y;
      i += 2;
    }
  }

  // Title
  doc.setFont('Playfair Display', 'bold');
  doc.setFontSize(18);
  doc.setTextColor('#333333');
  doc.text(title, pageWidth / 2, 22, { align: 'center' });
  
  doc.setFont('PT Sans', 'normal');
  doc.setFontSize(10);
  doc.setTextColor('#777777');
  doc.text(`Generado por Kavexa - ${new Date().toLocaleDateString('es-ES')}`, pageWidth / 2, 28, { align: 'center' });
};


const addFooter = (doc: jsPDF) => {
    const pageCount = doc.getNumberOfPages();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    doc.setFont('PT Sans', 'italic');
    doc.setFontSize(8);
    
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setTextColor('#aaaaaa');
        doc.text(`Página ${i} de ${pageCount}`, pageWidth - 20, pageHeight - 10, { align: 'right'});
        doc.text('© Kavexa', 20, pageHeight - 10);
    }
};

export const generatePdf = ({ title, headers, body, filename }: PdfOptions) => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  addHeader(doc, title);

  autoTable(doc, {
    head: headers,
    body: body,
    startY: 40,
    theme: 'grid',
    headStyles: {
      fillColor: '#A085CF', // Primary color
      textColor: '#ffffff',
      fontStyle: 'bold',
    },
    styles: {
      font: 'PT Sans',
      fontSize: 10
    },
    alternateRowStyles: {
      fillColor: '#F0F0F5' // Light gray background
    }
  });

  addFooter(doc);
  
  doc.save(filename);
};
