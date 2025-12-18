import axios from "axios";

const apiUrl = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:5000";

export async function fetchDocuments(employeeId: string) {
  const { data } = await axios.get(`${apiUrl}/api/documents`, {
    params: { employeeId },
    withCredentials: true,
  });
  return data;
}

export async function uploadDocument(formData: FormData) {
  const res = await fetch(`${apiUrl}/api/documents`, {
    method: "POST",
    body: formData,
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Failed to upload document");
  }

  return res.json();
}
