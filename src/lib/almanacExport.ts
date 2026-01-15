import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { format } from 'date-fns';

interface AlmanacEvent {
  id: string;
  series_number: number;
  event_date: string;
  event_start_date: string | null;
  event_end_date: string | null;
  event_name: string;
  responsible_person: string;
  description: string | null;
}

interface SeriesSummary {
  series_number: number;
  official_start_date: string;
  official_end_date: string;
  total_events: number;
}

const formatDateRange = (startDate: string | null, endDate: string | null): string => {
  if (!startDate) return 'TBD';
  const start = format(new Date(startDate), 'dd MMM yyyy');
  if (!endDate || startDate === endDate) return start;
  const end = format(new Date(endDate), 'dd MMM yyyy');
  return `${start} - ${end}`;
};

export const exportToPDF = (
  events: AlmanacEvent[],
  getSeriesSummary: (series: number) => SeriesSummary | null
) => {
  const doc = new jsPDF();
  const seriesList = [5, 6, 7, 8];
  let yPosition = 20;

  // Title
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('TASSA 2026 Examination Almanac', 105, yPosition, { align: 'center' });
  yPosition += 10;

  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text('Complete Schedule for Series 5, 6, 7 & 8', 105, yPosition, { align: 'center' });
  yPosition += 15;

  seriesList.forEach((series, seriesIndex) => {
    const seriesEvents = events.filter(e => e.series_number === series);
    const summary = getSeriesSummary(series);

    if (seriesEvents.length === 0) return;

    // Check if we need a new page
    if (yPosition > 240) {
      doc.addPage();
      yPosition = 20;
    }

    // Series header
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(`Series ${series}`, 14, yPosition);
    yPosition += 7;

    if (summary) {
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(
        `Duration: ${format(new Date(summary.official_start_date), 'dd MMM yyyy')} - ${format(new Date(summary.official_end_date), 'dd MMM yyyy')} (32 Working Days)`,
        14,
        yPosition
      );
      yPosition += 8;
    }

    // Table data
    const tableData = seriesEvents.map((event, index) => [
      (index + 1).toString(),
      formatDateRange(event.event_start_date, event.event_end_date),
      event.event_name,
      event.responsible_person,
    ]);

    autoTable(doc, {
      startY: yPosition,
      head: [['#', 'Date Range', 'Event', 'Responsible']],
      body: tableData,
      theme: 'striped',
      headStyles: {
        fillColor: [37, 99, 235],
        textColor: 255,
        fontStyle: 'bold',
      },
      columnStyles: {
        0: { cellWidth: 10 },
        1: { cellWidth: 45 },
        2: { cellWidth: 80 },
        3: { cellWidth: 45 },
      },
      margin: { left: 14, right: 14 },
      didDrawPage: (data) => {
        // Footer
        doc.setFontSize(8);
        doc.setFont('helvetica', 'normal');
        doc.text(
          `Generated on ${format(new Date(), 'dd MMM yyyy HH:mm')} | TASSA Examination Almanac`,
          105,
          doc.internal.pageSize.height - 10,
          { align: 'center' }
        );
      },
    });

    yPosition = (doc as any).lastAutoTable.finalY + 15;
  });

  // Save the PDF
  doc.save(`TASSA_Almanac_2026_${format(new Date(), 'yyyy-MM-dd')}.pdf`);
};

export const exportToExcel = (
  events: AlmanacEvent[],
  getSeriesSummary: (series: number) => SeriesSummary | null
) => {
  const workbook = XLSX.utils.book_new();
  const seriesList = [5, 6, 7, 8];

  // Create a summary sheet
  const summaryData = seriesList.map(series => {
    const summary = getSeriesSummary(series);
    const seriesEvents = events.filter(e => e.series_number === series);
    return {
      'Series': `Series ${series}`,
      'Start Date': summary ? format(new Date(summary.official_start_date), 'dd MMM yyyy') : 'N/A',
      'End Date': summary ? format(new Date(summary.official_end_date), 'dd MMM yyyy') : 'N/A',
      'Duration': '32 Working Days',
      'Total Events': seriesEvents.length,
    };
  });

  const summarySheet = XLSX.utils.json_to_sheet(summaryData);
  summarySheet['!cols'] = [
    { wch: 12 },
    { wch: 15 },
    { wch: 15 },
    { wch: 18 },
    { wch: 12 },
  ];
  XLSX.utils.book_append_sheet(workbook, summarySheet, 'Summary');

  // Create a sheet for each series
  seriesList.forEach(series => {
    const seriesEvents = events.filter(e => e.series_number === series);
    
    if (seriesEvents.length === 0) return;

    const sheetData = seriesEvents.map((event, index) => ({
      '#': index + 1,
      'Start Date': event.event_start_date ? format(new Date(event.event_start_date), 'dd MMM yyyy') : 'TBD',
      'End Date': event.event_end_date ? format(new Date(event.event_end_date), 'dd MMM yyyy') : 'TBD',
      'Event Name': event.event_name,
      'Responsible': event.responsible_person,
      'Description': event.description || '',
    }));

    const sheet = XLSX.utils.json_to_sheet(sheetData);
    sheet['!cols'] = [
      { wch: 5 },
      { wch: 15 },
      { wch: 15 },
      { wch: 45 },
      { wch: 25 },
      { wch: 40 },
    ];
    XLSX.utils.book_append_sheet(workbook, sheet, `Series ${series}`);
  });

  // Create a combined "All Events" sheet
  const allEventsData = events
    .sort((a, b) => {
      if (a.series_number !== b.series_number) return a.series_number - b.series_number;
      return (a.event_start_date || '').localeCompare(b.event_start_date || '');
    })
    .map((event, index) => ({
      '#': index + 1,
      'Series': `Series ${event.series_number}`,
      'Start Date': event.event_start_date ? format(new Date(event.event_start_date), 'dd MMM yyyy') : 'TBD',
      'End Date': event.event_end_date ? format(new Date(event.event_end_date), 'dd MMM yyyy') : 'TBD',
      'Event Name': event.event_name,
      'Responsible': event.responsible_person,
      'Description': event.description || '',
    }));

  const allEventsSheet = XLSX.utils.json_to_sheet(allEventsData);
  allEventsSheet['!cols'] = [
    { wch: 5 },
    { wch: 10 },
    { wch: 15 },
    { wch: 15 },
    { wch: 45 },
    { wch: 25 },
    { wch: 40 },
  ];
  XLSX.utils.book_append_sheet(workbook, allEventsSheet, 'All Events');

  // Save the file
  XLSX.writeFile(workbook, `TASSA_Almanac_2026_${format(new Date(), 'yyyy-MM-dd')}.xlsx`);
};

export const exportSeriesOnly = (
  events: AlmanacEvent[],
  series: number,
  format_type: 'pdf' | 'excel',
  getSeriesSummary: (series: number) => SeriesSummary | null
) => {
  const seriesEvents = events.filter(e => e.series_number === series);
  
  if (format_type === 'pdf') {
    const doc = new jsPDF();
    let yPosition = 20;

    // Title
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text(`TASSA 2026 - Series ${series} Schedule`, 105, yPosition, { align: 'center' });
    yPosition += 15;

    const summary = getSeriesSummary(series);
    if (summary) {
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      doc.text(
        `Duration: ${format(new Date(summary.official_start_date), 'dd MMM yyyy')} - ${format(new Date(summary.official_end_date), 'dd MMM yyyy')}`,
        105,
        yPosition,
        { align: 'center' }
      );
      yPosition += 8;
      doc.text('32 Working Days', 105, yPosition, { align: 'center' });
      yPosition += 12;
    }

    const tableData = seriesEvents.map((event, index) => [
      (index + 1).toString(),
      formatDateRange(event.event_start_date, event.event_end_date),
      event.event_name,
      event.responsible_person,
    ]);

    autoTable(doc, {
      startY: yPosition,
      head: [['#', 'Date Range', 'Event', 'Responsible']],
      body: tableData,
      theme: 'striped',
      headStyles: {
        fillColor: [37, 99, 235],
        textColor: 255,
        fontStyle: 'bold',
      },
      columnStyles: {
        0: { cellWidth: 10 },
        1: { cellWidth: 45 },
        2: { cellWidth: 80 },
        3: { cellWidth: 45 },
      },
      margin: { left: 14, right: 14 },
    });

    doc.setFontSize(8);
    doc.text(
      `Generated on ${format(new Date(), 'dd MMM yyyy HH:mm')} | TASSA Examination Almanac`,
      105,
      doc.internal.pageSize.height - 10,
      { align: 'center' }
    );

    doc.save(`TASSA_Series${series}_2026_${format(new Date(), 'yyyy-MM-dd')}.pdf`);
  } else {
    const workbook = XLSX.utils.book_new();
    
    const sheetData = seriesEvents.map((event, index) => ({
      '#': index + 1,
      'Start Date': event.event_start_date ? format(new Date(event.event_start_date), 'dd MMM yyyy') : 'TBD',
      'End Date': event.event_end_date ? format(new Date(event.event_end_date), 'dd MMM yyyy') : 'TBD',
      'Event Name': event.event_name,
      'Responsible': event.responsible_person,
      'Description': event.description || '',
    }));

    const sheet = XLSX.utils.json_to_sheet(sheetData);
    sheet['!cols'] = [
      { wch: 5 },
      { wch: 15 },
      { wch: 15 },
      { wch: 45 },
      { wch: 25 },
      { wch: 40 },
    ];
    XLSX.utils.book_append_sheet(workbook, sheet, `Series ${series}`);

    XLSX.writeFile(workbook, `TASSA_Series${series}_2026_${format(new Date(), 'yyyy-MM-dd')}.xlsx`);
  }
};
