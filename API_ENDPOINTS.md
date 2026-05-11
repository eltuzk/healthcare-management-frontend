# API Endpoints

## AccountController

| Method | URL | Request Body / Params | Response | Roles được phép |
|--------|-----|------------------------|----------|----------------|
| GET | /api/accounts | Params: ?page=0&size=10 | `Page<AccountResponse>` | ADMIN |
| GET | /api/accounts/{id} | Path: id | `AccountResponse` | ADMIN |
| POST | /api/accounts | Body: `AccountRequest` | `AccountResponse` | ADMIN |
| PUT | /api/accounts/{id} | Path: id; Body: `AccountRequest` | `AccountResponse` | ADMIN |
| DELETE | /api/accounts/{id} | Path: id | 204 | ADMIN |
| GET | /api/accounts/me | - | `AccountResponse` | ANY |

## AccountPermissionController

| Method | URL | Request Body / Params | Response | Roles được phép |
|--------|-----|------------------------|----------|----------------|
| POST | /api/account-permissions | Body: `AccountPermissionRequest` | `AccountPermissionResponse` | ADMIN |
| DELETE | /api/account-permissions | Body: `AccountPermissionRequest` | 204 | ADMIN |
| GET | /api/account-permissions/account/{accountId} | Path: accountId | `List<AccountPermissionResponse>` | ADMIN |

## AdmissionController

| Method | URL | Request Body / Params | Response | Roles được phép |
|--------|-----|------------------------|----------|----------------|
| GET | /api/admission-requests | - | `List<AdmissionRequestResponse>` | ADMIN, DOCTOR, RECEPTIONIST |
| GET | /api/admission-requests/{id} | Path: id | `AdmissionRequestResponse` | ADMIN, DOCTOR, RECEPTIONIST |
| GET | /api/patients/{patientId}/admissions | Path: patientId | `List<AdmissionRequestResponse>` | DOCTOR, PATIENT |
| POST | /api/admission-requests | Body: `AdmissionRequestRequest` | `AdmissionRequestResponse` | DOCTOR |
| PUT | /api/admission-requests/{id}/status | Path: id; Body: `AdmissionStatusUpdateRequest` | `AdmissionRequestResponse` | DOCTOR, RECEPTIONIST |
| GET | /api/admission-requests/{admissionId}/records | Path: admissionId | `List<AdmissionRecordResponse>` | DOCTOR, NURSE |
| POST | /api/admission-requests/{admissionId}/records | Path: admissionId; Body: `AdmissionRecordRequest` | `AdmissionRecordResponse` | DOCTOR, NURSE |
| PUT | /api/admission-records/{id} | Path: id; Body: `AdmissionRecordRequest` | `AdmissionRecordResponse` | DOCTOR, NURSE |

## AppointmentController

| Method | URL | Request Body / Params | Response | Roles được phép |
|--------|-----|------------------------|----------|----------------|
| POST | /api/appointments | Body: `CreateAppointmentRequest` | `AppointmentResponse` | PUBLIC |
| POST | /api/appointments/walk-in | Body: `CreateWalkInAppointmentRequest` | `AppointmentResponse` | RECEPTIONIST |
| GET | /api/appointments/{id} | Path: id | `AppointmentResponse` | PUBLIC |
| GET | /api/appointments | Params: patientId, doctorScheduleId, status | `List<AppointmentResponse>` | PUBLIC |
| POST | /api/appointments/{id}/check-in | Path: id | `AppointmentResponse` | PUBLIC |
| POST | /api/appointments/{id}/start | Path: id | `AppointmentResponse` | PUBLIC |
| POST | /api/appointments/{id}/cancel | Path: id | `AppointmentResponse` | PUBLIC |
| POST | /api/appointments/sepay/webhook | Body: `SepayWebhookRequest`; Header: X-Secret-Key | `Map<String, Object>` | PUBLIC |

## AuthController

| Method | URL | Request Body / Params | Response | Roles được phép |
|--------|-----|------------------------|----------|----------------|
| POST | /api/auth/register | Body: `RegisterRequest` | `RegisterResponse` | PUBLIC |
| POST | /api/auth/register/verification-email | Params: token | `String` | PUBLIC |
| POST | /api/auth/login | Body: `AuthRequest` | `AuthResponse` | PUBLIC |
| POST | /api/auth/forgot-password | Body: `ForgotPasswordRequest` | `String` | PUBLIC |
| POST | /api/auth/reset-password | Params: token; Body: `ResetPasswordRequest` | `String` | PUBLIC |
| POST | /api/auth/change-password | Body: `ChangePasswordRequest` | 204 | ANY |

## BedController

| Method | URL | Request Body / Params | Response | Roles được phép |
|--------|-----|------------------------|----------|----------------|
| GET | /api/rooms/{roomId}/beds | Path: roomId | `List<BedResponse>` | PUBLIC |
| POST | /api/rooms/{roomId}/beds | Path: roomId; Body: `BedRequest` | `BedResponse` | PUBLIC |
| PUT | /api/beds/{id} | Path: id; Body: `BedRequest` | `BedResponse` | PUBLIC |
| DELETE | /api/beds/{id} | Path: id | 204 | PUBLIC |

## BranchController

| Method | URL | Request Body / Params | Response | Roles được phép |
|--------|-----|------------------------|----------|----------------|
| GET | /api/branches | - | `List<BranchResponse>` | ADMIN |
| GET | /api/branches/{id} | Path: id | `BranchResponse` | ADMIN |
| POST | /api/branches | Body: `BranchRequest` | `BranchResponse` | ADMIN |
| PUT | /api/branches/{id} | Path: id; Body: `BranchRequest` | `BranchResponse` | ADMIN |
| DELETE | /api/branches/{id} | Path: id | 204 | ADMIN |

## ConsultationFeeController

| Method | URL | Request Body / Params | Response | Roles được phép |
|--------|-----|------------------------|----------|----------------|
| POST | /api/consultation-fees | Body: `ConsultationFeeRequest` | `ConsultationFeeResponse` | ADMIN |
| GET | /api/consultation-fees | - | `List<ConsultationFeeResponse>` | ADMIN, RECEPTIONIST, DOCTOR |
| GET | /api/consultation-fees/{id} | Path: id | `ConsultationFeeResponse` | ADMIN, RECEPTIONIST, DOCTOR |
| PUT | /api/consultation-fees/{id} | Path: id; Body: `ConsultationFeeRequest` | `ConsultationFeeResponse` | ADMIN |
| PATCH | /api/consultation-fees/{id}/deactivate | Path: id | `ConsultationFeeResponse` | ADMIN |

## DoctorController

| Method | URL | Request Body / Params | Response | Roles được phép |
|--------|-----|------------------------|----------|----------------|
| GET | /api/doctors | Params: ?page=0&size=10 | `Page<DoctorResponse>` | ADMIN, RECEPTIONIST |
| GET | /api/doctors/{doctorId} | Path: doctorId | `DoctorResponse` | ADMIN, RECEPTIONIST |
| POST | /api/doctors | Body: `DoctorRequest` | `DoctorResponse` | ADMIN |
| PUT | /api/doctors/{doctorId} | Path: doctorId; Body: `DoctorRequest` | `DoctorResponse` | ADMIN |
| DELETE | /api/doctors/{doctorId} | Path: doctorId | 204 | ADMIN |

## DoctorScheduleController

| Method | URL | Request Body / Params | Response | Roles được phép |
|--------|-----|------------------------|----------|----------------|
| POST | /api/doctor-schedules | Body: `CreateDoctorScheduleRequest` | `DoctorScheduleResponse` | PUBLIC |
| POST | /api/doctor-schedules/import | Params: file (multipart/form-data) | `DoctorScheduleImportResponse` | PUBLIC |
| GET | /api/doctor-schedules | Params: date, doctorId, roomId | `List<DoctorScheduleResponse>` | PUBLIC |
| GET | /api/doctor-schedules/{id} | Path: id | `DoctorScheduleResponse` | PUBLIC |
| PUT | /api/doctor-schedules/{id} | Path: id; Body: `UpdateDoctorScheduleRequest` | `DoctorScheduleResponse` | PUBLIC |
| DELETE | /api/doctor-schedules/{id} | Path: id | 204 | PUBLIC |

## LabTestController

| Method | URL | Request Body / Params | Response | Roles được phép |
|--------|-----|------------------------|----------|----------------|
| GET | /api/lab-tests | - | `List<LabTestResponse>` | ADMIN, DOCTOR, RECEPTIONIST, TECHNICIAN |
| GET | /api/lab-tests/{id} | Path: id | `LabTestResponse` | ADMIN, DOCTOR, RECEPTIONIST, TECHNICIAN |
| POST | /api/lab-tests | Body: `LabTestRequest` | `LabTestResponse` | ADMIN |
| PUT | /api/lab-tests/{id} | Path: id; Body: `LabTestRequest` | `LabTestResponse` | ADMIN |
| PATCH | /api/lab-tests/{id}/deactivate | Path: id | `LabTestResponse` | ADMIN |

## LabTestRequestController

| Method | URL | Request Body / Params | Response | Roles được phép |
|--------|-----|------------------------|----------|----------------|
| POST | /api/lab-test-requests | Body: `CreateLabTestRequestRequest` | `ApiResponse<LabTestRequestResponse>` | DOCTOR |
| GET | /api/lab-test-requests | Params: medRecordId, status; ?page=0&size=10 | `ApiResponse<Page<LabTestRequestResponse>>` | ADMIN, DOCTOR, TECHNICIAN |
| GET | /api/lab-test-requests/{id} | Path: id | `ApiResponse<LabTestRequestResponse>` | ADMIN, DOCTOR, TECHNICIAN, PATIENT |
| PUT | /api/lab-test-requests/{id}/status | Path: id; Body: `UpdateLabTestRequestStatusRequest` | `ApiResponse<LabTestRequestResponse>` | TECHNICIAN, ADMIN |
| GET | /api/lab-test-requests/medical-record/{medRecordId} | Path: medRecordId | `ApiResponse<List<LabTestRequestResponse>>` | ADMIN, DOCTOR, TECHNICIAN |
| POST | /api/lab-test-requests/{requestId}/results | Path: requestId; Body: `CreateLabTestResultRequest` | `ApiResponse<LabTestResultResponse>` | TECHNICIAN |
| GET | /api/lab-test-requests/{requestId}/results | Path: requestId | `ApiResponse<LabTestResultResponse>` | DOCTOR, TECHNICIAN, PATIENT |

## LabTestResultController

| Method | URL | Request Body / Params | Response | Roles được phép |
|--------|-----|------------------------|----------|----------------|
| PUT | /api/lab-test-results/{id} | Path: id; Body: `UpdateLabTestResultRequest` | `ApiResponse<LabTestResultResponse>` | TECHNICIAN |

## MedicalRecordController

| Method | URL | Request Body / Params | Response | Roles được phép |
|--------|-----|------------------------|----------|----------------|
| POST | /api/medical-records/from-appointment/{appointmentId} | Path: appointmentId; Body: `CreateMedicalRecordRequest` | `MedicalRecordResponse` | DOCTOR |
| GET | /api/medical-records/{id} | Path: id | `MedicalRecordResponse` | DOCTOR, ADMIN, RECEPTIONIST |
| GET | /api/medical-records | Params: patientId, doctorId, status, date | `List<MedicalRecordResponse>` | DOCTOR, ADMIN, RECEPTIONIST |
| PUT | /api/medical-records/{id} | Path: id; Body: `UpdateMedicalRecordRequest` | `MedicalRecordResponse` | DOCTOR |
| POST | /api/medical-records/{id}/complete | Path: id | `MedicalRecordResponse` | DOCTOR |
| POST | /api/medical-records/{id}/lock | Path: id | `MedicalRecordResponse` | DOCTOR |

## MedicalServiceController

| Method | URL | Request Body / Params | Response | Roles được phép |
|--------|-----|------------------------|----------|----------------|
| GET | /api/medical-services | - | `List<MedicalServiceResponse>` | ADMIN, DOCTOR, RECEPTIONIST, TECHNICIAN |
| GET | /api/medical-services/{id} | Path: id | `MedicalServiceResponse` | ADMIN, DOCTOR, RECEPTIONIST, TECHNICIAN |
| POST | /api/medical-services | Body: `MedicalServiceRequest` | `MedicalServiceResponse` | ADMIN |
| PUT | /api/medical-services/{id} | Path: id; Body: `MedicalServiceRequest` | `MedicalServiceResponse` | ADMIN |
| PATCH | /api/medical-services/{id}/deactivate | Path: id | `MedicalServiceResponse` | ADMIN |

## MedicalServiceRequestController

| Method | URL | Request Body / Params | Response | Roles được phép |
|--------|-----|------------------------|----------|----------------|
| POST | /api/medical-service-requests | Body: `CreateMedicalServiceRequestRequest` | `ApiResponse<MedicalServiceRequestResponse>` | DOCTOR |
| GET | /api/medical-service-requests | Params: medRecordId, status; ?page=0&size=10 | `ApiResponse<Page<MedicalServiceRequestResponse>>` | ADMIN, DOCTOR, TECHNICIAN |
| GET | /api/medical-service-requests/{id} | Path: id | `ApiResponse<MedicalServiceRequestResponse>` | ADMIN, DOCTOR, TECHNICIAN |
| PUT | /api/medical-service-requests/{id}/status | Path: id; Body: `UpdateMedicalServiceRequestStatusRequest` | `ApiResponse<MedicalServiceRequestResponse>` | ADMIN, TECHNICIAN |
| POST | /api/medical-service-requests/{requestId}/results | Path: requestId; Body: `UpdateMedicalServiceResultRequest` | `ApiResponse<MedicalServiceResultResponse>` | ADMIN, TECHNICIAN |
| GET | /api/medical-service-requests/{requestId}/results | Path: requestId | `ApiResponse<MedicalServiceResultResponse>` | ADMIN, DOCTOR, PATIENT |

## MedicalServiceResultController

| Method | URL | Request Body / Params | Response | Roles được phép |
|--------|-----|------------------------|----------|----------------|
| PUT | /api/medical-service-results/{id} | Path: id; Body: `UpdateMedicalServiceResultRequest` | `ApiResponse<MedicalServiceResultResponse>` | ADMIN, TECHNICIAN |

## PatientController

| Method | URL | Request Body / Params | Response | Roles được phép |
|--------|-----|------------------------|----------|----------------|
| GET | /api/patients | Params: ?page=0&size=10 | `Page<PatientResponse>` | ADMIN, RECEPTIONIST |
| GET | /api/patients/{id} | Path: id | `PatientResponse` | ADMIN, RECEPTIONIST |
| GET | /api/patients/me | - | `PatientResponse` | PATIENT |
| POST | /api/patients | Body: `PatientRequest` | `PatientResponse` | ADMIN, RECEPTIONIST |
| PUT | /api/patients/{id} | Path: id; Body: `PatientRequest` | `PatientResponse` | ADMIN, RECEPTIONIST |
| DELETE | /api/patients/{id} | Path: id | 204 | ADMIN, RECEPTIONIST |

## PatientInsuranceController

| Method | URL | Request Body / Params | Response | Roles được phép |
|--------|-----|------------------------|----------|----------------|
| GET | /api/patient-insurances/patient/{patientId} | Path: patientId | `List<PatientInsuranceResponse>` | ADMIN, RECEPTIONIST, ACCOUNTANT |
| POST | /api/patient-insurances | Body: `PatientInsuranceRequest` | `PatientInsuranceResponse` | ADMIN, RECEPTIONIST |
| PUT | /api/patient-insurances/{id} | Path: id; Body: `PatientInsuranceRequest` | `PatientInsuranceResponse` | ADMIN, RECEPTIONIST |
| DELETE | /api/patient-insurances/{id} | Path: id | 204 | ADMIN |

## PaymentRecordController

| Method | URL | Request Body / Params | Response | Roles được phép |
|--------|-----|------------------------|----------|----------------|
| GET | /api/payment-records | Params: paymentStatus, appointmentId, medicalRecordId | `List<PaymentRecordResponse>` | ADMIN, ACCOUNTANT, RECEPTIONIST |
| GET | /api/payment-records/{id} | Path: id | `PaymentRecordResponse` | ADMIN, ACCOUNTANT, RECEPTIONIST |
| POST | /api/payment-records/medical-records/{medicalRecordId}/cash | Path: medicalRecordId; Body: `RecordMedicalRecordPaymentRequest` | `PaymentRecordResponse` | ADMIN, ACCOUNTANT, RECEPTIONIST |

## PermissionController

| Method | URL | Request Body / Params | Response | Roles được phép |
|--------|-----|------------------------|----------|----------------|
| GET | /api/permissions | - | `List<PermissionResponse>` | ADMIN |
| GET | /api/permissions/{id} | Path: id | `PermissionResponse` | ADMIN |
| POST | /api/permissions | Body: `PermissionRequest` | `PermissionResponse` | ADMIN |
| PUT | /api/permissions/{id} | Path: id; Body: `PermissionRequest` | `PermissionResponse` | ADMIN |
| DELETE | /api/permissions/{id} | Path: id | 204 | ADMIN |

## RevenueReportController

| Method | URL | Request Body / Params | Response | Roles được phép |
|--------|-----|------------------------|----------|----------------|
| GET | /api/reports/revenue | Params: fromDate, toDate, gateway, ownerType | `RevenueReportResponse` | ADMIN, ACCOUNTANT |

## RoleController

| Method | URL | Request Body / Params | Response | Roles được phép |
|--------|-----|------------------------|----------|----------------|
| GET | /api/roles | - | `List<RoleResponse>` | ADMIN |
| GET | /api/roles/{id} | Path: id | `RoleResponse` | ADMIN |
| POST | /api/roles | Body: `RoleRequest` | `RoleResponse` | ADMIN |
| PUT | /api/roles/{id} | Path: id; Body: `RoleRequest` | `RoleResponse` | ADMIN |
| DELETE | /api/roles/{id} | Path: id | 204 | ADMIN |

## RolePermissionController

| Method | URL | Request Body / Params | Response | Roles được phép |
|--------|-----|------------------------|----------|----------------|
| POST | /api/role-permissions | Body: `RolePermissionRequest` | `RolePermissionResponse` | ADMIN |
| DELETE | /api/role-permissions | Body: `RolePermissionRequest` | 204 | ADMIN |
| GET | /api/role-permissions/role/{roleId} | Path: roleId | `List<RolePermissionResponse>` | ADMIN |

## RoomController

| Method | URL | Request Body / Params | Response | Roles được phép |
|--------|-----|------------------------|----------|----------------|
| GET | /api/rooms | Params: roomTypeId | `List<RoomResponse>` | PUBLIC |
| GET | /api/rooms/{id} | Path: id | `RoomResponse` | PUBLIC |
| POST | /api/rooms | Body: `RoomRequest` | `RoomResponse` | PUBLIC |
| PUT | /api/rooms/{id} | Path: id; Body: `RoomRequest` | `RoomResponse` | PUBLIC |
| DELETE | /api/rooms/{id} | Path: id | 204 | PUBLIC |

## RoomTypeController

| Method | URL | Request Body / Params | Response | Roles được phép |
|--------|-----|------------------------|----------|----------------|
| GET | /api/room-types | - | `List<RoomTypeResponse>` | PUBLIC |
| GET | /api/room-types/{id} | Path: id | `RoomTypeResponse` | PUBLIC |
| POST | /api/room-types | Body: `RoomTypeRequest` | `RoomTypeResponse` | PUBLIC |
| PUT | /api/room-types/{id} | Path: id; Body: `RoomTypeRequest` | `RoomTypeResponse` | PUBLIC |
| DELETE | /api/room-types/{id} | Path: id | 204 | PUBLIC |

## SpecialtyController

| Method | URL | Request Body / Params | Response | Roles được phép |
|--------|-----|------------------------|----------|----------------|
| POST | /api/specialties | Body: `SpecialtyRequest` | `SpecialtyResponse` | ADMIN |
| GET | /api/specialties | - | `List<SpecialtyResponse>` | ADMIN, RECEPTIONIST, DOCTOR |
| GET | /api/specialties/{id} | Path: id | `SpecialtyResponse` | ADMIN, RECEPTIONIST, DOCTOR |
| PUT | /api/specialties/{id} | Path: id; Body: `SpecialtyRequest` | `SpecialtyResponse` | ADMIN |
| PATCH | /api/specialties/{id}/deactivate | Path: id | `SpecialtyResponse` | ADMIN |