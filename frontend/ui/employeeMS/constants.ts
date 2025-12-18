

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

export const documentTypes = Object.entries(
  DOCUMENT_TYPE_LABEL_MAP
).map(([value, label]) => ({
  value,
  label,
}));

export interface EmployeeDocument {
  _id: string;
  title: string;
  type: DocumentType;
  updatedAt: string;
}
