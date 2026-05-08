const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const sendEmail = async (to, subject, text, html) => {
    try {
        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
            console.log('-----------------------------------');
            console.log('MOCK EMAIL SENT (No credentials)');
            console.log(`To: ${to}`);
            console.log(`Subject: ${subject}`);
            console.log(`Text: ${text}`);
            console.log('-----------------------------------');
            return true;
        }

        const info = await transporter.sendMail({
            from: `"MediConnect" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            text,
            html
        });
        console.log('Email sent:', info.messageId);
        return true;
    } catch (error) {
        console.error('Email error:', error);
        return false;
    }
};

// Send OTP Email
const sendOtpEmail = async (to, name, otp, purpose = 'verification') => {
    const subject = `MediConnect — Your OTP for ${purpose}`;
    const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f9fafb; padding: 20px; border-radius: 12px;">
        <div style="background: linear-gradient(135deg, #0d9488, #7c3aed); padding: 30px; border-radius: 12px 12px 0 0; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px;">🏥 MediConnect</h1>
            <p style="color: rgba(255,255,255,0.85); margin: 8px 0 0 0;">Your trusted healthcare platform</p>
        </div>
        <div style="background: white; padding: 30px; border-radius: 0 0 12px 12px; border: 1px solid #e5e7eb;">
            <h2 style="color: #1f2937; margin-top: 0;">Hello, ${name}!</h2>
            <p style="color: #6b7280;">Your One-Time Password (OTP) for ${purpose} is:</p>
            <div style="text-align: center; margin: 30px 0;">
                <div style="display: inline-block; background: #f0fdf4; border: 2px dashed #0d9488; padding: 20px 40px; border-radius: 12px;">
                    <span style="font-size: 42px; font-weight: bold; color: #0d9488; letter-spacing: 8px;">${otp}</span>
                </div>
            </div>
            <p style="color: #6b7280; text-align: center;"><strong>⏱ This OTP expires in 10 minutes.</strong></p>
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
            <p style="color: #9ca3af; font-size: 12px; text-align: center;">If you did not request this, please ignore this email. Do not share this OTP with anyone.</p>
        </div>
    </div>`;
    const text = `Your MediConnect OTP for ${purpose} is: ${otp}. It expires in 10 minutes.`;
    return sendEmail(to, subject, text, html);
};

// Send Appointment Status Email
const sendAppointmentStatusEmail = async (to, patientName, appointmentNumber, status, date, timeSlot, doctorName) => {
    const statusColors = {
        approved: '#16a34a',
        cancelled: '#dc2626',
        completed: '#0d9488',
        pending: '#d97706'
    };
    const statusMessages = {
        approved: 'Your appointment has been approved! Please arrive 10 minutes early.',
        cancelled: 'Unfortunately, your appointment has been cancelled. Please book again.',
        completed: 'Your appointment has been marked as completed. Thank you for choosing MediConnect!',
        pending: 'Your appointment is currently pending review.'
    };
    const color = statusColors[status] || '#6b7280';
    const message = statusMessages[status] || '';

    const subject = `MediConnect — Appointment ${status.charAt(0).toUpperCase() + status.slice(1)}: ${appointmentNumber}`;
    const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f9fafb; padding: 20px; border-radius: 12px;">
        <div style="background: linear-gradient(135deg, #0d9488, #7c3aed); padding: 30px; border-radius: 12px 12px 0 0; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px;">🏥 MediConnect</h1>
        </div>
        <div style="background: white; padding: 30px; border-radius: 0 0 12px 12px; border: 1px solid #e5e7eb;">
            <h2 style="color: #1f2937;">Hello, ${patientName}!</h2>
            <p style="color: #6b7280;">Your appointment status has been updated:</p>
            <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid ${color};">
                <p style="margin: 0 0 8px 0;"><strong>Appointment ID:</strong> ${appointmentNumber}</p>
                <p style="margin: 0 0 8px 0;"><strong>Doctor:</strong> ${doctorName}</p>
                <p style="margin: 0 0 8px 0;"><strong>Date:</strong> ${date}</p>
                <p style="margin: 0 0 8px 0;"><strong>Time:</strong> ${timeSlot}</p>
                <p style="margin: 0;"><strong>Status:</strong> <span style="color: ${color}; font-weight: bold; text-transform: capitalize;">${status}</span></p>
            </div>
            <p style="color: #374151;">${message}</p>
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
            <p style="color: #9ca3af; font-size: 12px; text-align: center;">MediConnect — Your Trusted Healthcare Partner</p>
        </div>
    </div>`;
    const text = `Appointment ${appointmentNumber} status: ${status}. Doctor: ${doctorName}. Date: ${date} at ${timeSlot}.`;
    return sendEmail(to, subject, text, html);
};

module.exports = { sendEmail, sendOtpEmail, sendAppointmentStatusEmail };
