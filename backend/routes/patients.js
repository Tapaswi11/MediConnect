// ============================================
// Patient Routes
// Register, Verify OTP, Login, Profile, Appointments
// ============================================

const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { pool } = require('../db');
const { sendOtpEmail } = require('../utils/mailer');

// Helper: generate 6-digit OTP
const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

// Helper: OTP expiry (10 minutes from now)
const otpExpiry = () => new Date(Date.now() + 10 * 60 * 1000);

// Auth middleware for patient routes
const authenticatePatient = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Authentication required' });
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.role !== 'patient') return res.status(403).json({ error: 'Access denied' });
        req.patient = decoded;
        next();
    } catch (error) {
        res.status(401).json({ error: 'Invalid or expired token' });
    }
};

// ============================================
// POST /api/patients/send-register-otp
// Step 1: Send OTP to email before registration
// ============================================
router.post('/send-register-otp', async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) return res.status(400).json({ error: 'Email is required' });

        // Check if already registered
        const [existing] = await pool.query('SELECT id FROM patients WHERE email = ?', [email]);
        if (existing.length > 0) return res.status(409).json({ error: 'Email already registered. Please login.' });

        const otp = generateOtp();
        const expiry = otpExpiry();

        // Check if OTP already exists for this email
        const [existingOtp] = await pool.query('SELECT id FROM verification_otps WHERE email = ?', [email]);
        if (existingOtp.length > 0) {
            await pool.query('UPDATE verification_otps SET otp_code = ?, otp_expiry = ?, is_verified = 0 WHERE email = ?', [otp, expiry, email]);
        } else {
            await pool.query('INSERT INTO verification_otps (email, otp_code, otp_expiry) VALUES (?, ?, ?)', [email, otp, expiry]);
        }

        await sendOtpEmail(email, 'User', otp, 'email verification');
        res.status(200).json({ message: 'OTP sent successfully!' });
    } catch (error) {
        console.error('Send OTP error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// ============================================
// POST /api/patients/verify-register-otp
// Step 2: Verify OTP
// ============================================
router.post('/verify-register-otp', async (req, res) => {
    try {
        const { email, otp } = req.body;
        if (!email || !otp) return res.status(400).json({ error: 'Email and OTP are required' });

        const [rows] = await pool.query('SELECT * FROM verification_otps WHERE email = ?', [email]);
        if (rows.length === 0) return res.status(404).json({ error: 'OTP request not found. Please request a new OTP.' });

        const record = rows[0];
        if (record.otp_code !== otp) return res.status(400).json({ error: 'Invalid OTP. Please try again.' });
        if (new Date() > new Date(record.otp_expiry)) return res.status(400).json({ error: 'OTP has expired. Please request a new OTP.' });

        await pool.query('UPDATE verification_otps SET is_verified = 1 WHERE email = ?', [email]);
        res.status(200).json({ message: 'Email verified successfully!' });
    } catch (error) {
        console.error('Verify OTP error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// ============================================
// POST /api/patients/register
// Step 3: Complete registration (needs verified email)
// ============================================
router.post('/register', async (req, res) => {
    try {
        const { full_name, email, password, phone, gender, blood_group } = req.body;

        if (!full_name || !email || !password || !phone) {
            return res.status(400).json({ error: 'Full name, email, password, and phone are required' });
        }

        // Check verification_otps
        const [verifications] = await pool.query('SELECT is_verified FROM verification_otps WHERE email = ?', [email]);
        if (verifications.length === 0 || !verifications[0].is_verified) {
            return res.status(403).json({ error: 'Please verify your email before registering.' });
        }

        const [existing] = await pool.query('SELECT id FROM patients WHERE email = ?', [email]);
        if (existing.length > 0) return res.status(409).json({ error: 'Email already registered. Please login.' });

        const hashedPassword = await bcrypt.hash(password, 10);

        const [result] = await pool.query(
            `INSERT INTO patients (full_name, email, password, phone, gender, blood_group, is_verified) VALUES (?, ?, ?, ?, ?, ?, 1)`,
            [full_name, email, hashedPassword, phone, gender || null, blood_group || null]
        );

        // Delete verification record
        await pool.query('DELETE FROM verification_otps WHERE email = ?', [email]);

        const token = jwt.sign(
            { id: result.insertId, email, role: 'patient', full_name },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
        );

        res.status(201).json({
            message: 'Registration successful! Welcome to MediConnect.',
            token,
            user: { id: result.insertId, full_name, email, phone, gender, blood_group, is_verified: 1, role: 'patient' }
        });

    } catch (error) {
        console.error('Patient registration error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// ============================================
// POST /api/patients/login
// ============================================
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ error: 'Email and password are required' });

        const [rows] = await pool.query('SELECT * FROM patients WHERE email = ?', [email]);
        if (rows.length === 0) return res.status(401).json({ error: 'Invalid email or password' });

        const patient = rows[0];

        const isMatch = await bcrypt.compare(password, patient.password);
        if (!isMatch) return res.status(401).json({ error: 'Invalid email or password' });

        const token = jwt.sign(
            { id: patient.id, email: patient.email, role: 'patient', full_name: patient.full_name },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
        );

        delete patient.password;
        delete patient.otp_code;
        delete patient.otp_expiry;

        res.json({
            message: 'Login successful',
            token,
            user: { ...patient, role: 'patient' }
        });

    } catch (error) {
        console.error('Patient login error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// ============================================
// GET /api/patients/profile
// ============================================
router.get('/profile', authenticatePatient, async (req, res) => {
    try {
        const [rows] = await pool.query(
            'SELECT id, full_name, email, phone, gender, blood_group, is_verified, created_at FROM patients WHERE id = ?',
            [req.patient.id]
        );
        if (rows.length === 0) return res.status(404).json({ error: 'Patient not found' });
        res.json({ patient: rows[0] });
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// ============================================
// PUT /api/patients/profile
// ============================================
router.put('/profile', authenticatePatient, async (req, res) => {
    try {
        const { full_name, phone, gender, blood_group } = req.body;
        await pool.query(
            'UPDATE patients SET full_name = ?, phone = ?, gender = ?, blood_group = ? WHERE id = ?',
            [full_name, phone, gender || null, blood_group || null, req.patient.id]
        );
        res.json({ message: 'Profile updated successfully' });
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// ============================================
// GET /api/patients/appointments
// ============================================
router.get('/appointments', authenticatePatient, async (req, res) => {
    try {
        const [rows] = await pool.query(
            `SELECT a.*, d.full_name as doctor_name, s.name as specialization_name
             FROM appointments a
             LEFT JOIN doctors d ON a.doctor_id = d.id
             LEFT JOIN specializations s ON a.specialization_id = s.id
             WHERE a.patient_id = ?
             ORDER BY a.created_at DESC`,
            [req.patient.id]
        );
        res.json({ appointments: rows });
    } catch (error) {
        console.error('Get patient appointments error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// ============================================
// POST /api/patients/resend-otp
// ============================================
router.post('/resend-otp', async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) return res.status(400).json({ error: 'Email is required' });

        const [rows] = await pool.query('SELECT * FROM verification_otps WHERE email = ?', [email]);
        if (rows.length === 0) return res.status(404).json({ error: 'Please request a new OTP first.' });

        const otp = generateOtp();
        const expiry = otpExpiry();

        await pool.query('UPDATE verification_otps SET otp_code = ?, otp_expiry = ?, is_verified = 0 WHERE email = ?', [otp, expiry, email]);
        await sendOtpEmail(email, 'User', otp, 'email verification');

        res.json({ message: 'OTP sent successfully. Please check your email.' });
    } catch (error) {
        console.error('Resend OTP error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
