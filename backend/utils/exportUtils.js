
const PDFDocument = require('pdfkit');
const { Parser } = require('json2csv');

// Generate PDF from bookings
exports.generatePDF = (bookings, res) => {
  const doc = new PDFDocument();
  
  // Pipe the PDF into the response
  doc.pipe(res);
  
  // Add content
  doc.fontSize(25).text('Classroom Bookings Report', { align: 'center' });
  doc.moveDown();
  
  // Add date
  doc.fontSize(12).text(`Generated on ${new Date().toLocaleString()}`, { align: 'center' });
  doc.moveDown(2);
  
  // Add bookings table
  doc.fontSize(12).text('Bookings List:', { underline: true });
  doc.moveDown();
  
  bookings.forEach((booking, index) => {
    doc.fontSize(10).text(`Booking #${index + 1}: ${booking.classroomName}`);
    doc.fontSize(8).text(`User: ${booking.userName}`);
    doc.fontSize(8).text(`Date: ${booking.date}`);
    doc.fontSize(8).text(`Time: ${booking.startTime} - ${booking.endTime}`);
    doc.fontSize(8).text(`Purpose: ${booking.purpose}`);
    doc.fontSize(8).text(`Status: ${booking.status}`);
    doc.moveDown();
    
    // Add a separator line except for last item
    if (index < bookings.length - 1) {
      doc.moveTo(50, doc.y)
         .lineTo(550, doc.y)
         .stroke();
      doc.moveDown();
    }
  });
  
  // Finalize the PDF
  doc.end();
};

// Generate CSV from bookings
exports.generateCSV = (bookings, res) => {
  try {
    // Define fields for CSV
    const fields = [
      'id',
      'userName',
      'classroomName',
      'date',
      'startTime',
      'endTime',
      'purpose',
      'status',
    ];
    
    const json2csvParser = new Parser({ fields });
    const csv = json2csvParser.parse(bookings);
    
    // Set headers
    res.header('Content-Type', 'text/csv');
    res.attachment('bookings.csv');
    
    // Send CSV
    res.send(csv);
  } catch (error) {
    console.error('Error generating CSV:', error);
    throw error;
  }
};
