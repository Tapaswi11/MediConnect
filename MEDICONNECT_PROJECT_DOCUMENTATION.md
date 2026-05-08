# MediConnect Platform - Project Documentation

This document provides a comprehensive technical overview and functional breakdown of the **MediConnect Platform**, a full-stack healthcare management system designed to streamline the interaction between patients, healthcare providers, and administrators.

---

## 1. Project Overview

### Project Name
**MediConnect Platform**

### Description
MediConnect is a centralized digital healthcare ecosystem that facilitates seamless doctor-patient connections. It provides a structured workflow for booking appointments, managing medical records, and verifying healthcare professionals through a secure, multi-tier administrative hierarchy.

### Purpose
The primary purpose of MediConnect is to digitize the traditional clinic/hospital appointment process, reducing waiting times for patients while providing doctors with an organized dashboard to manage their clinical practice and patient history.

### Objectives
*   **Accessibility**: Enable patients to find and book specialist doctors from any device.
*   **Verification**: Ensure all registered doctors are certified through a rigorous administrative review process.
*   **Record Integrity**: Provide a secure and permanent digital repository for patient medical history and prescriptions.
*   **Operational Efficiency**: Automate scheduling and status notifications to minimize missed appointments.

### Current & Future Scope
*   **Current Scope**: Patient registration with OTP verification, doctor registration with document upload, administrative approval workflow, appointment scheduling, and diagnosis tracking.
*   **Future Scope**: Integration of video consultations (Telemedicine), online pharmacy/prescription fulfillment, AI-driven symptom checker, and hospital/bed management integration.

---

## 2. System Modules

### 1. Patient Portal
*   **Features**: OTP-based Registration, Secure Login, Specialist Search, Appointment Booking, Medical History Timeline, Profile Management.
*   **Workflow**: Patients verify their email via OTP -> Create account -> Browse doctors by specialization -> Book a time slot -> Receive email confirmation -> Access prescriptions after the session.

### 2. Doctor Portal
*   **Features**: Professional Registration (Degree & License upload), Dashboard Analytics (Stats), Appointment Queue Management, Diagnosis & Prescription Entry, Availability Scheduling.
*   **Workflow**: Doctors register and upload credentials -> Await Admin approval -> Login to view pending requests -> Approve/Reject appointments -> Conduct session -> Mark as "Completed" with diagnosis and prescription.

### 3. Admin Portal
*   **Features**: Doctor Verification Dashboard (Review documents), Patient Management, Specialization Configuration, Platform Overview.
*   **Workflow**: Admin logs in -> Reviews pending doctor applications -> Views uploaded licenses -> Approves or Rejects profiles -> Monitors overall system activity.

### 4. Authentication & Security Module
*   **Features**: JWT (JSON Web Token) management, Bcrypt password hashing, Multi-step OTP Verification for both Patients and Doctors.
*   **Workflow**: Centralized middleware validates user roles (Patient/Doctor/Admin) and protects private routes from unauthorized access.

---

## 3. System Flow

### Overall Workflow
1.  **Onboarding**: Users (Patients/Doctors) verify their identity through Email OTP.
2.  **Service Request**: Patients search for doctors and request an appointment.
3.  **Coordination**: The system notifies the doctor; the doctor approves the request.
4.  **Completion**: Post-appointment, the doctor updates the record with medical notes, which become instantly available in the patient’s history.

### User Flows
*   **Patient Flow**: `Home` -> `Search Specialization` -> `Login/Register` -> `Book Slot` -> `Dashboard (Tracking)` -> `History`.
*   **Doctor Flow**: `Register` -> `Admin Approval` -> `Dashboard` -> `Manage Requests` -> `Add Prescription` -> `Complete`.
*   **Admin Flow**: `Login` -> `Review Doctor Docs` -> `Activate Account`.

---

## 4. Database Design

| Table Name | Purpose | Important Fields | Relationships |
| :--- | :--- | :--- | :--- |
| `patients` | Stores patient personal data. | `full_name`, `email`, `password`, `is_verified` | Referenced by `appointments`. |
| `doctors` | Stores professional details. | `license_number`, `consultation_fee`, `verification_status` | Linked to `specializations`. |
| `specializations` | Categorizes doctors. | `name`, `description` | Referenced by `doctors` and `appointments`. |
| `appointments` | The core transaction table. | `appointment_number`, `status`, `diagnosis`, `prescription` | Joins `patients`, `doctors`, and `specializations`. |
| `verification_otps` | Handles temporary security codes. | `otp_code`, `otp_expiry`, `is_verified` | Tied to email identifiers. |
| `admins` | System management accounts. | `role (superadmin/admin)` | Independent access. |

---

## 5. Key Features
*   **Email-First OTP Verification**: Prevents fake accounts by requiring verification before registration.
*   **Admin Verification Workflow**: Doctors cannot practice on the platform until their license is manually reviewed.
*   **Medical History Timeline**: A chronological view of all past diagnoses and prescriptions for the patient.
*   **Automated Notifications**: Real-time emails for OTPs, appointment approvals, and status updates.
*   **Modern Healthcare UI**: High-fidelity, responsive design using a premium teal and slate-based healthcare palette.

---

## 6. Validation & Security
*   **Data Integrity**: Server-side validation using Express for all incoming API data.
*   **Password Security**: Hashed using **Bcryptjs** (10 salt rounds).
*   **Session Management**: Secure **JWT** with 24-hour expiration.
*   **Role-Based Access Control (RBAC)**: Strict separation of API access for Patients, Doctors, and Admins.
*   **File Security**: Documents are stored outside the public directory with uniquely generated filenames.

---

## 7. Non-Functional Requirements
*   **Performance**: Uses MySQL Connection Pooling to handle concurrent user requests efficiently.
*   **Scalability**: Stateless JWT auth allows the backend to scale horizontally.
*   **Responsiveness**: Mobile-first CSS ensures the platform works on smartphones, tablets, and desktops.
*   **Maintainability**: Modular route structure (`auth.js`, `appointments.js`, etc.) for easy debugging.

---

## 8. Tech Stack
*   **Frontend**: HTML5, CSS3 (Vanilla), JavaScript (ES6+).
*   **Backend**: Node.js, Express.js.
*   **Database**: MySQL (Relational).
*   **Communication**: Nodemailer (SMTP) for system emails.
*   **Security**: JWT (Authentication), Bcrypt (Hashing), Multer (File Handling).

---

## 9. Design Decisions
*   **Why Vanilla JS/CSS?**: To ensure maximum performance and avoid library bloat, allowing for a highly customized "MediConnect" look and feel.
*   **Why OTP before Register?**: To ensure only valid email owners can create records, maintaining a clean database.
*   **Unified Sidebar**: To provide a professional "SaaS-like" experience for all dashboard users (Admin/Doctor/Patient).
*   **Standardized Portal Access**: Refactored all login and registration portals (Patient, Doctor, Admin) to follow a unified design language and layout, ensuring a consistent brand experience across different system access points.
*   **Healthcare Teal Palette**: Transitioned from a maroon theme to a modern teal and slate palette to evoke feelings of trust, calmness, and professionalism suitable for a medical SaaS.
*   **Visual Depth & Contrast**: Implemented layered backgrounds with soft gradients and optimized card shadows to improve information hierarchy and dashboard readability.
*   **Vertical Spacing Optimization**: Implemented a balanced vertical rhythm by reducing excessive white space and oversized paddings, making the platform more compact and professional.
*   **Section Separation**: Utilized alternating background variations (Clean Slate, Soft Gradients, and White) to improve visual hierarchy and section clarity on the homepage.

---

## 10. Conclusion
The MediConnect Platform successfully bridges the gap between digital convenience and medical professional standards. By combining secure verification workflows with an intuitive user interface, it provides a robust foundation for modern healthcare management. The system is designed with a "Security-First" approach, ensuring patient data remains private while clinical workflows remain efficient.
