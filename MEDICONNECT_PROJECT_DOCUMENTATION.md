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

### Problem Statement
Traditional healthcare management often relies on manual, fragmented processes leading to:
*   **Long Waiting Times**: Patients face unpredictable delays due to manual queue management.
*   **Verification Gaps**: Difficulty in verifying the credentials and authenticity of healthcare providers.
*   **Disconnected Records**: Patients lose access to their medical history as records are often physical or siloed in different clinics.
*   **Inefficient Communication**: Lack of automated notifications for appointment confirmations and health updates.

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

### 1. Patient Portal (User Experience)
*   **Purpose**: Designed to give patients full control over their healthcare journey.
*   **Key Features**:
    *   **Smart Search**: Filter doctors by specialization (e.g., Cardiology, Dental).
    *   **Instant Booking**: Real-time slot selection for appointments.
    *   **Health Timeline**: A chronological view of all past prescriptions and diagnoses.
    *   **Secure Profile**: Manage personal details and contact information.
*   **Workflow**: Verify Email via OTP -> Search Specialists -> Book Appointment -> Receive Email Alert -> Access Records Post-Session.

### 2. Doctor Portal (Clinical Management)
*   **Purpose**: A robust workstation for healthcare professionals to manage their practice.
*   **Key Features**:
    *   **Practice Dashboard**: At-a-glance view of daily and weekly appointments.
    *   **Credential Manager**: Securely upload medical licenses for Admin verification.
    *   **Patient Queue**: Approve, cancel, or reschedule pending requests.
    *   **Digital Prescription**: Integrated tool to add diagnoses and medications instantly.
*   **Workflow**: Register Credentials -> Await Admin Approval -> Login -> Manage Appointment Queue -> Conduct Session -> Mark as Completed.

### 3. Admin Panel (Platform Governance)
*   **Purpose**: The central command center for system-wide monitoring and security.
*   **Key Features**:
    *   **Verification Hub**: Review doctor documents and activate/deactivate accounts.
    *   **Category Management**: Add or update medical specializations.
    *   **Global Overview**: Monitor all users and active appointments across the platform.
    *   **User Management**: View and manage patient and doctor records.
*   **Workflow**: Login -> Review Pending Doctors -> Verify Licenses -> Approve/Reject -> Manage Platform Data.

### 4. Authentication & Security (Guardianship)
*   **Purpose**: Ensures every interaction on MediConnect is verified and private.
*   **Key Features**:
    *   **Dual OTP Verification**: Mandatory email checks for both patients and doctors.
    *   **Role-Based Access**: Specialized dashboards for each user type (RBAC).
    *   **Data Encryption**: Industry-standard password hashing (Bcrypt).
    *   **JWT Sessions**: Secure, stateless session management for persistent login.

### 5. Automated Notification System (Communication)
*   **Purpose**: Keeps all parties informed with real-time updates.
*   **Key Features**:
    *   **Email Alerts**: Automated confirmation for bookings and status changes.
    *   **Security Codes**: Instant delivery of verification OTPs via SMTP.
    *   **Status Sync**: Real-time status updates from "Pending" to "Approved" or "Completed".

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

### Database Tables

| Table Name | Purpose | Important Fields | Relationships |
| :--- | :--- | :--- | :--- |
| `patients` | Stores patient personal data. | `full_name`, `email`, `password`, `is_verified` | Referenced by `appointments`. |
| `doctors` | Stores professional details. | `license_number`, `consultation_fee`, `verification_status` | Linked to `specializations`. |
| `specializations` | Categorizes doctors. | `name`, `description` | Referenced by `doctors` and `appointments`. |
| `appointments` | The core transaction table. | `appointment_number`, `status`, `diagnosis`, `prescription` | Joins `patients`, `doctors`, and `specializations`. |
| `verification_otps` | Handles temporary security codes. | `otp_code`, `otp_expiry`, `is_verified` | Tied to email identifiers. |
| `doctor_availability`| Stores doctor schedules. | `available_date`, `start_time`, `end_time` | Referenced by `doctors`. |
| `admins` | System management accounts. | `role (superadmin/admin)` | Independent access. |

### System Architecture
MediConnect follows a **3-Tier Architecture**:
1.  **Presentation Tier (Frontend)**: Built with HTML5, CSS3, and Vanilla JavaScript, ensuring a responsive and premium UI.
2.  **Application Tier (Backend)**: A Node.js and Express.js server handling business logic, authentication, and API routing.
3.  **Data Tier (Database)**: A MySQL relational database for persistent and structured data storage.

---

## 5. Key Features
*   **Email-First OTP Verification**: Prevents fake accounts by requiring verification before registration.
*   **Admin Verification Workflow**: Doctors cannot practice on the platform until their license is manually reviewed.
*   **Medical History Timeline**: A chronological view of all past diagnoses and prescriptions for the patient.
*   **Automated Notifications**: Real-time emails for OTPs, appointment approvals, and status updates via Nodemailer.
*   **Modern Healthcare UI**: High-fidelity design using a modern teal and slate-based healthcare palette.

---

## 6. Validation & Security
*   **Data Integrity**: Server-side validation using Express for all incoming API data to prevent SQL injection and XSS.
*   **Password Security**: Hashed using **Bcryptjs** (10 salt rounds).
*   **Session Management**: Secure **JWT** (JSON Web Tokens) with a 24-hour expiration for persistent sessions.
*   **Role-Based Access Control (RBAC)**: Strict separation of API access; middleware ensures users can only access their respective dashboards.
*   **File Security**: Doctor licenses and documents are stored securely with unique filenames and restricted access.

---

## 7. Test Cases (Unified Platform Testing)

| ID | Module | Scenario | Input Data | Expected Result |
| :--- | :--- | :--- | :--- | :--- |
| **TC-P01** | Patient | Email OTP Verification | Valid Email | 6-digit code sent to user email via SMTP. |
| **TC-P02** | Patient | Valid Registration | Verified Email + Details | Record created; redirected to Login page. |
| **TC-P03** | Patient | Secure Login | Valid Credentials | JWT stored; Redirect to Patient Dashboard. |
| **TC-P04** | Patient | Doctor Search | Selection by Category | Displays filtered list of specialized doctors. |
| **TC-P05** | Patient | Appointment Booking | Selected Slot + Notes | Status set to 'pending'; Booking ID generated. |
| **TC-P06** | Patient | Status Tracking | Booking ID Search | Displays current status (Pending/Approved). |
| **TC-P07** | Patient | View Medical History | History Dashboard | Timeline of all past prescriptions visible. |
| **TC-P08** | Patient | Profile Management | Update Name/Phone | Personal details updated in patient database. |
| **TC-D01** | Doctor | Practice Dashboard | Daily Queue View | Displays all appointments scheduled for the day. |
| **TC-D02** | Doctor | Manage Requests | Click "Approve" | Slot reserved; status updated for patient view. |
| **TC-D03** | Doctor | Clinical Record | Diagnosis + Rx Data | Appointment marked 'Completed'; History updated. |
| **TC-D04** | Doctor | Profile Update | Bio/Consultation Fee | Public profile updated with new professional data. |
| **TC-A01** | Admin | Admin Login | Admin Credentials | Redirect to Admin Master Dashboard. |
| **TC-A02** | Admin | Dashboard Analytics | View Stats | Displays total count of Doctors and Patients. |
| **TC-A03** | Admin | Pending Verifications | Review List | Displays all doctors awaiting license approval. |
| **TC-A04** | Admin | Document Review | Click "View License" | License document opens for manual verification. |
| **TC-A05** | Admin | Profile Approval | Click "Approve" | Status set to 'approved'; Doctor account activated. |
| **TC-A06** | Admin | Profile Rejection | Click "Reject" | Status set to 'rejected'; Account remains inactive. |
| **TC-A07** | Admin | Add Specialization | New Category Name | Category added to search filters globally. |
| **TC-A08** | Admin | Global Appointments | View All List | Filterable list of all bookings across platform. |

![MediConnect Complete 20 Test Cases](file:///C:/Users/AsuS/.gemini/antigravity/brain/6f9216c1-6386-4fb7-83ae-363d254156e0/mediconnect_complete_20_test_cases_1778826881787.png)

---

## 8. Tech Stack
*   **Frontend**: HTML5, CSS3 (Vanilla), JavaScript (ES6+).
*   **Backend**: Node.js, Express.js.
*   **Database**: MySQL (Relational).
*   **Communication**: Nodemailer (SMTP) for system emails.
*   **Security**: JWT (Authentication), Bcrypt (Hashing), Multer (File Handling).

---

## 9. Architecture
The system is built on a **Modular RESTful Architecture**:
*   **Stateless Authentication**: Uses JWT to maintain user state without server-side sessions, allowing for easy horizontal scaling.
*   **MVC Pattern**: The backend is structured into Models (DB Schema), Views (Frontend), and Controllers (API Routes) to ensure clean code separation.
*   **Connection Pooling**: Uses MySQL connection pooling to handle high concurrency and improve database performance.

---

## 10. Conclusion
The MediConnect Platform successfully bridges the gap between digital convenience and medical professional standards. By combining secure verification workflows with an intuitive user interface, it provides a robust foundation for modern healthcare management. The system is designed with a "Security-First" approach, ensuring patient data remains private while clinical workflows remain efficient.
