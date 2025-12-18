"use client";

import React, { useState, useRef } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchDocuments, uploadDocument } from "./documentAction";
import CustomDropdown from "@/components/CustomDropdown";
import {
  DocumentIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { formatDateYYYYMMDD } from "@/lib/formatDate";

interface Props {
  employeeId: string;
}

const documentTypes = [
  { value: "CV_RESUME", label: "CV / Resume" },
  { value: "NID_COPY", label: "NID Copy" },
  { value: "PASSPORT_PHOTO", label: "Passport Photo" },
  { value: "EMPLOYMENT_AGREEMENT", label: "Employment Agreement" },
  { value: "CERTIFICATE", label: "Certificate" },
  { value: "OTHERS", label: "Others" },
];

export default function EmployeeDocuments({ employeeId }: Props) {
  const [title, setTitle] = useState("");
  const [type, setType] = useState("CV_RESUME");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const queryClient = useQueryClient();

  const {
    data: documents = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["employee-documents", employeeId],
    queryFn: () => fetchDocuments(employeeId),
    enabled: !!employeeId,
  });

  console.log(documents);

  const uploadMutation = useMutation({
    mutationFn: uploadDocument,
    onSuccess: () => {
      setTitle("");
      setType("CV_RESUME");

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      queryClient.invalidateQueries({
        queryKey: ["employee-documents", employeeId],
      });
    },
  });

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile || !title) return;

    const formData = new FormData();
    formData.append("employeeId", employeeId);
    formData.append("title", title);
    formData.append("type", type);
    formData.append("file", selectedFile);

    uploadMutation.mutate(formData);
  };

  const handleViewDocument = (docId: string) => {
    const url = `${process.env.NEXT_PUBLIC_API_BASE}/api/documents/view/${docId}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="bg-gray-100 p-4 rounded border border-gray-200 space-y-6">
      <p className="text-2xl font-semibold">Employee Documents</p>

      <form className="flex items-center gap-3 h-10">
        <input
          type="text"
          className="block flex-1 h-full rounded-lg border border-slate-400 px-3 focus:outline-none focus:ring-1 focus:ring-primary placeholder:text-sm text-sm"
          placeholder="Document title (e.g., NID Copy, CV)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <CustomDropdown
          options={documentTypes}
          value={type}
          onChange={setType}
          className="w-48 h-10"
        />

        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileChange}
        />

        <button
          type="button"
          onClick={handleFileSelect}
          disabled={!title || uploadMutation.isPending}
          className="bg-primary text-white px-4 h-full rounded disabled:opacity-50"
        >
          {uploadMutation.isPending ? "Uploading..." : "Upload"}
        </button>
      </form>

      {uploadMutation.isError && (
        <p className="text-sm text-red-500">
          {(uploadMutation.error as Error).message}
        </p>
      )}

      <section className="h-auto min-h-40">
        {isLoading && (
          <p className="text-sm text-gray-500">Loading documents...</p>
        )}

        {isError && (
          <p className="text-sm text-red-500">Failed to load documents</p>
        )}

        {!isLoading && documents.length === 0 && (
          <section className="h-40 flex flex-col gap-3 items-center justify-center">
            <DocumentIcon className="w-10 opacity-50 h-auto" />
            <p className="opacity-70">No documents uploaded yet</p>
          </section>
        )}

        {documents.length > 0 && (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="border-b border-gray-200">
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">
                    Title
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">
                    Type
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">
                    Uploaded
                  </th>
                  <th className="px-4 py-2 text-right text-sm font-semibold text-gray-600">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200">
                {documents.map((doc: any) => (
                  <tr key={doc._id} className="hover:bg-gray-200/40">
                    <td className="px-4 py-2 text-sm">{doc.title}</td>

                    <td className="px-4 py-2 text-sm text-gray-500 ">
                      {doc.type.replace("_", " ")}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-500">
                      {formatDateYYYYMMDD(doc.updatedAt)}
                    </td>

                    <td className="px-4 py-2 text-right flex items-center gap-2">
                      <EyeIcon
                        className="w-4 cursor-pointer hover:text-blue-500"
                        onClick={() => handleViewDocument(doc._id)}
                      />

                      <PencilIcon className="w-4 cursor-pointer hover:text-yellow-500" />
                      <TrashIcon className="w-4 cursor-pointer hover:text-red-600" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
