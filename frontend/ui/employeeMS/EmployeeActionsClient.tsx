"use client";

import React, { useState } from "react";
import Modal from "@/components/Modal";
import AddEmployeeForm from "./AddEmployeeForm";
import { useRouter } from "next/navigation";

export default function EmployeeActionsClient() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleSuccessClose = () => {
    setOpen(false);
    // Refresh the current route to re-run server components and fetch fresh data
    router.refresh();
  };

  return (
    <div className="flex justify-between items-center w-full">
      <p className="font-semibold">Employee List</p>
      <button
        onClick={handleOpen}
        className="px-4 py-1.5 cursor-pointer bg-primary text-white rounded flex items-center gap-2"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4v16m8-8H4"
          />
        </svg>
        Add Employee
      </button>

      <Modal isOpen={open} onClose={handleClose} size="lg">
        <AddEmployeeForm onClose={handleSuccessClose} />
      </Modal>
    </div>
  );
}
