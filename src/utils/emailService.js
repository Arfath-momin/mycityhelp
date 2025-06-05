import nodemailer from 'nodemailer';

// Create reusable transporter object using SMTP transport
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

export const sendComplaintNotification = async (adminEmail, complaintDetails) => {
  try {
    const mailOptions = {
      from: process.env.SMTP_FROM_EMAIL,
      to: adminEmail,
      subject: `New Complaint Notification: ${complaintDetails.title}`,
      html: `
        <h2>New Complaint Registered</h2>
        <p>A new complaint has been registered in your department.</p>
        <h3>Complaint Details:</h3>
        <ul>
          <li><strong>Title:</strong> ${complaintDetails.title}</li>
          <li><strong>Category:</strong> ${complaintDetails.category}</li>
          <li><strong>Department:</strong> ${complaintDetails.department}</li>
          <li><strong>Priority:</strong> ${complaintDetails.priority}</li>
          <li><strong>Location:</strong> ${complaintDetails.location}</li>
          <li><strong>Description:</strong> ${complaintDetails.description}</li>
          <li><strong>Tracking ID:</strong> ${complaintDetails.trackingId}</li>
          <li><strong>Submitted By:</strong> ${complaintDetails.submittedBy.name}</li>
          <li><strong>Submission Date:</strong> ${new Date(complaintDetails.createdAt).toLocaleString()}</li>
        </ul>
        <p>Please login to the admin dashboard to review and take necessary action.</p>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error: error.message };
  }
}; 