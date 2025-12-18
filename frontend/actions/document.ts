// actions/document.ts
import axios from "axios";

// const API_BASE = "/api/documents";
const apiUrl = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:5000";

export async function fetchDocuments(employeeId: string) {
  const { data } = await axios.get(`${apiUrl}?employeeId=${employeeId}`, {
    withCredentials: true,
  });
  return data;
}

export async function uploadDocument(
  employeeId: string,
  title: string,
  type: string,
  file: File
) {
  const formData = new FormData();
  formData.append("title", title);
  formData.append("type", type);
  formData.append("employeeId", employeeId);
  formData.append("file", file);

  const { data } = await axios.post(apiUrl, formData, {
    withCredentials: true,
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}

export async function deleteDocument(documentId: string) {
  const { data } = await axios.delete(`${apiUrl}/${documentId}`, {
    withCredentials: true,
  });
  return data;
}
