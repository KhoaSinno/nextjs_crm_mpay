// Employee related types
export type Role = "employee" | "accounting" | "hr";
export type Gender = "male" | "female" | "other";

import type { PayrollSchedule } from "../generated/prisma";

export interface Employee {
  id: number;
  fullName: string; // required
  email: string; // unique, required
  password: string; // required (hashed)
  phoneNumber?: string; // optional
  walletAddress?: string; // optional
  salary?: number; // optional, used for employees only
  status?: "active" | "inactive"; // default 'active'
  role: Role; // required
  dateOfBirth?: string; // ISO date string (DATEONLY)
  gender?: Gender;
  address?: string;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}
