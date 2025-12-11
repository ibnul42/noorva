"use client";

import { useRouter } from "next/navigation";
import { updateAttendanceAction } from "./actions";
import { Attendance, AttendancePayload, Employee } from "./type";

export default function AttendanceActionsClient({
  attendanceId,
  employee,
  attendance,
}: {
  attendanceId: string;
  employee: Employee;
  attendance: Attendance;
}) {
  const router = useRouter();

  async function update(type: string) {
    const payload: AttendancePayload = {};

    switch (type) {
      case "leave":
        payload.check_in = null;
        payload.check_out = null;
        payload.worked_minutes = 0;
        payload.status = "leave";
        break;

      case "check-in":
        payload.check_in = new Date();
        payload.check_out = null;
        payload.worked_minutes = 0;
        payload.status = "Checked In";
        break;

      case "check-out":
        payload.check_out = new Date();
        payload.status = "Checked Out";
        if (attendance.check_in) {
          const diff =
            payload.check_out.getTime() -
            new Date(attendance.check_in).getTime();
          payload.worked_minutes = Math.floor(diff / 60000); // minutes
        } else {
          payload.worked_minutes = 0;
        }
        break;

      case "absent":
        payload.check_in = null;
        payload.check_out = null;
        payload.worked_minutes = 0;
        payload.status = "Absent";
        break;

      case "holiday":
        payload.check_in = null;
        payload.check_out = null;
        payload.worked_minutes = 0;
        payload.status = "holiday";
        break;
    }

    await updateAttendanceAction(attendanceId, payload, employee._id);
    router.refresh();
  }

  return (
    <div className="space-x-2">
      {attendance.status !== "Checked In" && (
        <button
          onClick={() => update("check-in")}
          className="text-blue-600 border border-blue-600 hover:bg-blue-500 hover:text-white px-2 rounded cursor-pointer transition-all"
        >
          Check In
        </button>
      )}
      {attendance.status !== "Checked Out" && (
        <button
          onClick={() => update("check-out")}
          className="text-green-600 border border-green-600 hover:bg-green-500 hover:text-white px-2 rounded cursor-pointer transition-all"
        >
          Check Out
        </button>
      )}
      <button
        onClick={() => update("leave")}
        className="text-yellow-600 border border-yellow-600 hover:bg-yellow-500 hover:text-white px-2 rounded cursor-pointer transition-all"
      >
        Leave
      </button>
      <button
        onClick={() => update("absent")}
        className="text-red-600 border border-red-600 hover:bg-red-500 hover:text-white px-2 rounded cursor-pointer transition-all"
      >
        Absent
      </button>
    </div>
  );
}
