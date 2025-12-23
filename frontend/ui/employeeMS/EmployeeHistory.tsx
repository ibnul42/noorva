"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  DocumentIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { toast } from "react-toastify";

import Modal from "@/components/Modal";
import { formatDateYYYYMMDD } from "@/lib/formatDate";

import {
  fetchEmployeeHistoryAction,
  deleteEmployeeHistoryAction,
} from "./actions";

import { EmployeeHistory as HistoryType } from "./constants";
import EmployeeHistoryForm from "./EmployeeHistoryForm";

interface Props {
  employeeId: string;
}

export default function EmployeeHistory({ employeeId }: Props) {
  const queryClient = useQueryClient();

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editRecord, setEditRecord] = useState<HistoryType | null>(null);

  const [deleteRecordId, setDeleteRecordId] = useState<string | null>(null);

  // 🔹 Fetch history
  const { data: history = [], isLoading } = useQuery<HistoryType[]>({
    queryKey: ["employee-history", employeeId],
    queryFn: () => fetchEmployeeHistoryAction(employeeId),
  });

  // 🔹 Delete mutation
  const { mutate: deleteHistory, isPending: isDeleting } = useMutation({
    mutationFn: deleteEmployeeHistoryAction,
    onSuccess: () => {
      toast.success("History record deleted");
      queryClient.invalidateQueries({
        queryKey: ["employee-history", employeeId],
      });
      setDeleteRecordId(null);
    },
    onError: () => {
      toast.error("Failed to delete history record");
    },
  });

  const confirmDelete = () => {
    if (!deleteRecordId) return;
    deleteHistory(deleteRecordId);
  };

  return (
    <div className="bg-gray-100 p-4 rounded border border-gray-200 space-y-6">
      {/* Header */}
      <section className="flex justify-between items-center">
        <p className="text-2xl font-semibold">Employee History</p>

        <button
          onClick={() => {
            setEditRecord(null);
            setIsFormModalOpen(true);
          }}
          className="py-2 px-4 bg-primary text-white rounded hover:bg-primary/90 cursor-pointer"
        >
          + Add Record
        </button>
      </section>

      {/* Empty State */}
      {!isLoading && history.length === 0 && (
        <section className="h-40 flex flex-col gap-3 items-center justify-center">
          <DocumentIcon className="w-10 opacity-50" />
          <p className="opacity-70">No history records yet</p>
        </section>
      )}

      {/* Table */}
      {history.length > 0 && (
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="border-b border-gray-200">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">
                  Type
                </th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">
                  Title
                </th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">
                  Date Range
                </th>
                <th className="px-4 py-2 text-right text-sm font-semibold text-gray-600">
                  Action
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {history.map((record) => (
                <tr key={record._id} className="">
                  <td className="px-4 py-2 h-14 text-sm capitalize">
                    <span className="bg-gray-200 py-1 px-2 rounded">{record.type}</span>
                  </td>

                  <td className="px-4 py-2 text-sm">{record.title}</td>

                  <td className="px-4 py-2 text-sm text-gray-500">
                    {formatDateYYYYMMDD(record.startDate)}
                    {record.endDate &&
                      ` - ${formatDateYYYYMMDD(record.endDate)}`}
                  </td>

                  <td className="px-4 py-2 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <EyeIcon className="w-4 cursor-pointer hover:text-blue-500" />

                      <PencilIcon
                        onClick={() => {
                          setEditRecord(record);
                          setIsFormModalOpen(true);
                        }}
                        className="w-4 cursor-pointer hover:text-yellow-500"
                      />

                      <TrashIcon
                        onClick={() => setDeleteRecordId(record._id)}
                        className="w-4 cursor-pointer hover:text-red-600"
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add / Edit Modal */}
      <Modal isOpen={isFormModalOpen} onClose={() => setIsFormModalOpen(false)}>
        <EmployeeHistoryForm
          employeeId={employeeId}
          initialData={editRecord}
          onClose={() => setIsFormModalOpen(false)}
        />
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={!!deleteRecordId} onClose={() => setDeleteRecordId(null)}>
        <div className="space-y-4">
          <p className="text-lg font-semibold text-gray-800">
            Delete History Record
          </p>

          <p className="text-sm text-gray-600">
            Are you sure you want to delete this history record? This action
            cannot be undone.
          </p>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setDeleteRecordId(null)}
              className="px-4 py-2 border rounded hover:bg-gray-100 cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={confirmDelete}
              disabled={isDeleting}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50 cursor-pointer"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
