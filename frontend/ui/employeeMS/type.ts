export interface Employee {
  _id: string;
  employeeId: string;
  fullName: string;
  department: string;
  designation: string;
  phoneNumber: string;
  joiningDate: string;
  baseSalary: number;
  email: string;
  gender: string;
  nidNumber: string;
  presentAddress: string;
  createdAt: string;
  updatedAt: string;
}

export interface Attendance {
  _id?: string; // MongoDB document ID
  employee: string; // Reference to Employee._id
  date: string; // ISO date string (or Date)
  status: string;
  check_in?: string; // ISO date string (or Date)
  check_out?: string; // ISO date string (or Date)
  notes?: string;
  worked_minutes: number; // total minutes worked
  createdAt?: string; // auto by timestamps
  updatedAt?: string; // auto by timestamps
}

export interface MenuItem {
  id: MenuId;
  label: string;
}

export interface AttendanceDataProps {
  employee: Employee;
}

export interface AttendanceQuery {
  employeeId?: string;
  date?: string;
}

export interface AttendanceActionsClientProps {
  attendanceId: string;
  employeeId: string;
}

export interface AttendancePayload {
  check_in?: Date | null;
  check_out?: Date | null;
  status?: "Checked In" | "Checked Out" | "leave" | "Absent" | "holiday";
  worked_minutes?: number;
}

export type MenuId = "employee" | "attendance" | "salary" | "reports";

export const VALID_MENU_ID_SET = new Set<string>([
  "employee",
  "attendance",
  "salary",
  "reports",
]);

export type Salary = {
  _id: string;
  employeeId: {
    _id: string;
    fullName: string;
  };
  year: number;
  month: number;
  baseSalary: number;
  totalAllowance: number;
  totalDeduction: number;
  netSalary: number;
  status: "DRAFT" | "PAID";
  paidAt?: string;
};

export type SalaryAdjustment = {
  title: string;
  amount: number;
};
