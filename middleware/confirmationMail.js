const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    requireTLS: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});



const sendBookingConfirmationEmail = async (email, bookingDetails) => {
    try {
        const formattedCheckInDate = new Date(bookingDetails.checkIn).toLocaleString();
        const formattedCheckOutDate = new Date(bookingDetails.checkOut).toLocaleString();
      // Define email options
      const mailOptions = {
        from: "brocampproject@gmail.com",
        to: email,
        subject: 'Booking Confirmation',
        html: `
          <p>Dear user,</p>
          <p>Your booking details are as follows:</p>
          <div style="background-color: #f0f0f0; padding: 10px; border-radius: 5px;">
            <p><strong>Booking Details:</strong></p>
            <img src=${bookingDetails.cruiseId.Images[0]} alt="image" >
            <p><strong>Booking Id:</strong> ${bookingDetails.bookingId}</p>
            <p><strong>Booking Id:</strong> ${bookingDetails.paymentId}</p>
            <p><strong>Cruise:</strong> ${bookingDetails.cruiseId.name}</p>
            <p><strong>Check-Out:</strong> ${formattedCheckInDate}</p>
            <p><strong>Check-In:</strong> ${formattedCheckOutDate}</p>
            <p><strong>Boarding:</strong> ${bookingDetails.cruiseId.boarding}</p>
            <p><strong>Total:</strong>₹ ${bookingDetails.tax}</p>
            <p><strong>Total:</strong>₹ ${bookingDetails.fee}</p>
            <p><strong>Total:</strong>₹ ${bookingDetails.total}</p>

          </div>
          <p>Thank you for booking with us!</p>
          <p>Best regards,<br>Your Cruise Team</p>
        `,
      };
  
      // Send the email
      const info = await transporter.sendMail(mailOptions);
      console.log('Email sent:', info.response);
    } catch (error) {
      console.error('Error sending email:', error);
    }
  };
  
  module.exports = sendBookingConfirmationEmail;