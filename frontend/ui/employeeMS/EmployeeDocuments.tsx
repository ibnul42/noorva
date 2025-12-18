"use client";

import React, { useState, useRef } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  deleteDocument,
  fetchDocuments,
  updateDocument,
  uploadDocument,
} from "./documentAction";
import CustomDropdown from "@/components/CustomDropdown";
import {
  ArrowUpTrayIcon,
  DocumentIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { formatDateYYYYMMDD } from "@/lib/formatDate";
import {
  DOCUMENT_TYPE_LABEL_MAP,
  documentTypes,
  EmployeeDocument,
  type DocumentType,
} from "./constants";
import Modal from "@/components/Modal";

interface Props {
  employeeId: string;
}

export default function EmployeeDocuments({ employeeId }: Props) {
  const [title, setTitle] = useState("");
  const [type, setType] = useState("CV_RESUME");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [editDoc, setEditDoc] = useState<EmployeeDocument | null>(null);
  const [deleteDocId, setDeleteDocId] = useState<string | null>(null);

  const queryClient = useQueryClient();

  const { data: documents = [], isLoading } = useQuery<EmployeeDocument[]>({
    queryKey: ["employee-documents", employeeId],
    queryFn: () => fetchDocuments(employeeId),
  });

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

  const deleteMutation = useMutation({
    mutationFn: deleteDocument,
    onSuccess: () => {
      setDeleteDocId(null);
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
                {documents.map((doc) => (
                  <tr key={doc._id} className="hover:bg-gray-200/40">
                    <td className="px-4 py-2 text-sm">{doc.title}</td>

                    <td className="px-4 py-2 text-sm">
                      {DOCUMENT_TYPE_LABEL_MAP[doc.type]}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-500">
                      {formatDateYYYYMMDD(doc.updatedAt)}
                    </td>

                    <td className="px-4 py-2 text-right flex items-center justify-end gap-3">
                      <EyeIcon
                        onClick={() => handleViewDocument(doc._id)}
                        className="w-4 cursor-pointer hover:text-blue-500"
                      />

                      <PencilIcon
                        onClick={() => setEditDoc(doc)}
                        className="w-4 cursor-pointer hover:text-yellow-500"
                      />
                      <TrashIcon
                        onClick={() => setDeleteDocId(doc._id)}
                        className="w-4 cursor-pointer hover:text-red-600"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Delete document modal */}
      <Modal
        isOpen={!!deleteDocId}
        onClose={() => setDeleteDocId(null)}
        size="sm"
      >
        <h2 className="text-lg font-semibold mb-2">Delete Document</h2>
        <p className="text-sm text-gray-600 mb-4">
          Are you sure you want to delete this document? This action cannot be
          undone.
        </p>

        <div className="flex justify-end gap-2">
          <button
            onClick={() => setDeleteDocId(null)}
            className="px-4 py-2 text-sm rounded border"
          >
            Cancel
          </button>

          <button
            onClick={() => deleteMutation.mutate(deleteDocId!)}
            disabled={deleteMutation.isPending}
            className="px-4 py-2 text-sm rounded bg-red-600 text-white disabled:opacity-50"
          >
            {deleteMutation.isPending ? "Deleting..." : "Delete"}
          </button>
        </div>
      </Modal>

      {/* Edit document modal */}
      {editDoc && (
        <Modal isOpen={true} onClose={() => setEditDoc(null)} size="sm">
          <EditDocumentForm
            document={editDoc}
            onClose={() => setEditDoc(null)}
            employeeId={employeeId}
          />
        </Modal>
      )}
    </div>
  );
}

function EditDocumentForm({
  document,
  onClose,
  employeeId,
}: {
  document: EmployeeDocument;
  onClose: () => void;
  employeeId: string;
}) {
  const [title, setTitle] = useState(document.title);
  const [titleChanged, setTitleChanged] = useState(false);

  const updateFileInputRef = useRef<HTMLInputElement>(null);

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (formData: FormData) => {
      return updateDocument(document._id, formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["employee-documents", employeeId],
      });
      onClose();
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append("file", selectedFile);

    mutation.mutate(formData);
  };

  const handleFileSelect = () => {
    updateFileInputRef.current?.click();
  };

  const handleSave = () => {
    const formData = new FormData();
    if (titleChanged) {
      formData.append("title", title);
    }

    mutation.mutate(formData);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Edit Document</h2>

      <section>
        <label className="" htmlFor="">
          Title
        </label>
        <input
          value={title}
          onChange={(e) => {
            setTitleChanged(true);
            setTitle(e.target.value);
          }}
          className="block w-full h-10 my-1 rounded-lg border border-slate-400 px-3 focus:outline-none focus:ring-1 focus:ring-primary placeholder:text-sm text-sm"
          placeholder="Title"
        />
      </section>

      <input
        type="file"
        ref={updateFileInputRef}
        className="hidden"
        onChange={handleFileChange}
      />

      <button
        type="button"
        onClick={handleFileSelect}
        disabled={!title || mutation.isPending}
        className="px-4 py-2 border border-gray-100 hover:bg-gray-100/95 cursor-pointer h-full rounded disabled:opacity-50 flex items-center gap-2"
      >
        {mutation.isPending ? (
          <div className="flex justify-center">
            <div
              className="w-4 h-4 border-2 border-primary
                        border-t-transparent rounded-full 
                        animate-spin"
            ></div>
          </div>
        ) : (
          <ArrowUpTrayIcon className="w-4" />
        )}
        <span>Replace File</span>
      </button>

      <div className="flex justify-end gap-2 pt-2">
        <button
          onClick={onClose}
          className="px-4 py-2 text-sm border border-gray-100 hover:bg-gray-100/95 rounded cursor-pointer"
        >
          Cancel
        </button>

        <button
          onClick={handleSave}
          disabled={mutation.isPending}
          className="px-4 py-2 text-sm bg-primary hover:bg-primary/90 text-white rounded cursor-pointer"
        >
          {mutation.isPending ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
}
