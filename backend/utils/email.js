
const nodemailer = require('nodemailer');

// Create reusable transporter
const getTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: process.env.EMAIL_SECURE === 'true',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  });
};

// Send booking confirmation email
exports.sendBookingConfirmation = async (user, booking, classroom) => {
  try {
    const transporter = getTransporter();
    
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: user.email,
      subject: 'Classroom Booking Confirmation',
      html: `
        <h1>Booking Confirmation</h1>
        <p>Dear ${user.name},</p>
        <p>Your booking has been confirmed:</p>
        <ul>
          <li><strong>Classroom:</strong> ${classroom.name} (${classroom.building}, Room ${classroom.roomNumber})</li>
          <li><strong>Date:</strong> ${booking.date}</li>
          <li><strong>Time:</strong> ${booking.startTime} - ${booking.endTime}</li>
          <li><strong>Purpose:</strong> ${booking.purpose}</li>
        </ul>
        <p>Thank you for using our Classroom Booking System.</p>
      `
    };
    
    await transporter.sendMail(mailOptions);
    console.log(`Confirmation email sent to ${user.email}`);
    return true;
  } catch (error) {
    console.error('Email sending failed:', error);
    return false;
  }
};

// Send booking status update email
exports.sendStatusUpdate = async (user, booking, classroom) => {
  try {
    const transporter = getTransporter();
    
    const statusMessages = {
      confirmed: 'has been confirmed',
      rejected: 'has been rejected',
      cancelled: 'has been cancelled'
    };
    
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: user.email,
      subject: `Classroom Booking ${booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}`,
      html: `
        <h1>Booking Update</h1>
        <p>Dear ${user.name},</p>
        <p>Your booking for ${classroom.name} on ${booking.date} (${booking.startTime} - ${booking.endTime}) ${statusMessages[booking.status]}.</p>
        ${booking.status === 'rejected' ? '<p>Please contact administration for more information.</p>' : ''}
        <p>Thank you for using our Classroom Booking System.</p>
      `
    };
    
    await transporter.sendMail(mailOptions);
    console.log(`Status update email sent to ${user.email}`);
    return true;
  } catch (error) {
    console.error('Email sending failed:', error);
    return false;
  }
};
