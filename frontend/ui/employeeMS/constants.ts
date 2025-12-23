export const DOCUMENT_TYPE_LABEL_MAP = {
  CV_RESUME: "CV / Resume",
  NID_COPY: "NID Copy",
  PASSPORT_PHOTO: "Passport Photo",
  EMPLOYMENT_AGREEMENT: "Employment Agreement",
  CERTIFICATE: "Certificate",
  OTHERS: "Others",
} as const;

/**
 * 🔐 This is the ONLY valid DocumentType
 */
export type DocumentType = keyof typeof DOCUMENT_TYPE_LABEL_MAP;

export const documentTypes = Object.entries(DOCUMENT_TYPE_LABEL_MAP).map(
  ([value, label]) => ({
    value,
    label,
  })
);

export interface EmployeeDocument {
  _id: string;
  title: string;
  type: DocumentType;
  updatedAt: string;
}

export const EMPLOYEE_HISTORY_TYPES = [
  "training",
  "leave application",
  "promotion",
  "warning",
  "appreciation",
  "other",
] as const;

export type EmployeeHistoryType = (typeof EMPLOYEE_HISTORY_TYPES)[number];

export const employeeHistoryOptions = EMPLOYEE_HISTORY_TYPES.map((type) => ({
  value: type,
  label: type
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" "),
}));

export interface EmployeeHistory {
  _id: string;
  employee: string;
  type: EmployeeHistoryType;
  title: string;
  description?: string;
  startDate: string;
  endDate?: string;
  createdAt: string;
  updatedAt: string;
}
