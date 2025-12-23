"use client";

import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

import {
  createEmployeeHistoryAction,
  updateEmployeeHistoryAction,
} from "./actions";

import {
  EmployeeHistory,
  EmployeeHistoryType,
  employeeHistoryOptions,
} from "./constants";

import CustomDropdown from "@/components/CustomDropdown";

interface Props {
  employeeId: string;
  initialData?: EmployeeHistory | null;
  onClose: () => void;
}

export default function EmployeeHistoryForm({
  employeeId,
  initialData,
  onClose,
}: Props) {
  const queryClient = useQueryClient();

  const isEdit = Boolean(initialData);

  const [type, setType] = useState<EmployeeHistoryType>("training");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // 🔹 Populate form when editing
  useEffect(() => {
    if (initialData) {
      setType(initialData.type);
      setTitle(initialData.title);
      setDescription(initialData.description || "");
      setStartDate(initialData.startDate?.slice(0, 10));
      setEndDate(initialData.endDate?.slice(0, 10) || "");
    }
  }, [initialData]);

  const isDateRangeValid =
    !endDate || new Date(endDate) >= new Date(startDate);

  // 🔹 Create / Update mutation
  const { mutate, isPending } = useMutation({
    mutationFn: (payload: any) =>
      isEdit
        ? updateEmployeeHistoryAction(initialData!._id, payload)
        : createEmployeeHistoryAction(payload),

    onSuccess: () => {
      toast.success(
        isEdit ? "History updated successfully" : "History added successfully"
      );

      queryClient.invalidateQueries({
        queryKey: ["employee-history", employeeId],
      });

      onClose();
    },

    onError: () => {
      toast.error(
        isEdit ? "Failed to update history" : "Failed to add history"
      );
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error("Title is required");
      return;
    }

    if (!startDate) {
      toast.error("Start date is required");
      return;
    }

    if (!isDateRangeValid) {
      toast.error("End date cannot be earlier than start date");
      return;
    }

    mutate({
      employee: employeeId,
      type,
      title: title.trim(),
      description: description.trim() || undefined,
      startDate,
      endDate: endDate || undefined,
    });
  };

  return (
    <div className="space-y-4">
      <p className="font-semibold text-xl">
        {isEdit ? "Edit History Record" : "Add History Record"}
      </p>

      <form className="space-y-4" onSubmit={handleSubmit}>
        {/* Type */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">History Type</label>
          <CustomDropdown
            options={employeeHistoryOptions}
            value={type}
            onChange={(val) => setType(val as EmployeeHistoryType)}
            className="bg-white h-10"
          />
        </div>

        {/* Title */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">Title</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="h-10 w-full px-3 py-2 border border-gray-300 rounded outline-0 focus:border-primary transition-all"
            placeholder="e.g. Promotion 2024"
          />
        </div>

        {/* Description */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">Description (Optional)</label>
          <input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="h-10 w-full px-3 py-2 border border-gray-300 rounded outline-0 focus:border-primary transition-all"
          />
        </div>

        {/* Dates */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="h-10 w-full px-3 py-2 border border-gray-300 rounded outline-0 focus:border-primary transition-all"
            />
          </div>

          <div>
            <label className="text-sm font-medium">End Date (Optional)</label>
            <input
              type="date"
              value={endDate}
              min={startDate || undefined}
              onChange={(e) => setEndDate(e.target.value)}
              className="h-10 w-full px-3 py-2 border border-gray-300 rounded outline-0 focus:border-primary transition-all"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="border px-4 py-2 rounded cursor-pointer"
          >
            Cancel
          </button>

          <button
            disabled={isPending}
            className="bg-primary hover:bg-primary/80 text-white px-4 py-2 rounded disabled:opacity-50 cursor-pointer"
          >
            {isPending
              ? isEdit
                ? "Updating Record..."
                : "Adding Record..."
              : isEdit
              ? "Update Record"
              : "Add Record"}
          </button>
        </div>
      </form>
    </div>
  );
}
