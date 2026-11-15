export type UserStatus = 'ACTIVE' | 'INACTIVE';

export type LanguageCode = 'ro' | 'ru' | 'en';

export type UserRole = 'ADMIN' | 'MANAGER' | 'DOCTOR' | 'ASSISTANT' | 'RECEPTIONIST';

export interface AuthResponse {
  accessToken: string;
  userId: string;
  role: string;
  email: string;
  mustChangePassword: boolean;
}

export interface AuthRequest {
  email: string;
  password: string;
}

export interface UpdatePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface UserResponse {
  userId: string;
  branchIds: string[];
  name: string;
  surname: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  calendarColor?: string;
  role: UserRole;
  status: UserStatus;
  preferredLanguage: LanguageCode;
}

export interface DoctorResponse {
  doctorId: string;
  name: string;
  surname: string;
  calendarColor: string;
}

export interface UserRequest {
  branchIds: string[];
  name: string;
  surname: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  calendarColor?: string | null;
  role: UserRole;
  status: UserStatus;
}

export interface UpdateMeRequest {
  name?: string | null;
  surname?: string | null;
  email?: string | null;
  phone?: string | null;
  dateOfBirth?: string | null;
  calendarColor?: string | null;
  preferredLanguage?: LanguageCode | null;
}

export interface CreateUserRequest extends UserRequest {
  password: string;
}
