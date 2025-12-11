import { fetchAttendanceAction } from "./actions";
import AttendanceActionsClient from "./AttendanceActionsClient";
import { AttendanceDataProps } from "./type";

export function getStatusColor(status: string) {
  const map: Record<string, string> = {
    "Checked In": "text-blue-600 bg-blue-100",
    "Checked Out": "text-green-600 bg-green-100",
    leave: "text-yellow-700 bg-yellow-100",
    Absent: "text-red-600 bg-red-100",
    holiday: "text-purple-700 bg-purple-100",
  };

  return map[status] || "text-gray-600 bg-gray-100";
}

export default async function AttendanceData({
  employee,
}: AttendanceDataProps) {
  const today = new Date().toISOString().split("T")[0];

  const attendance = await fetchAttendanceAction({
    employeeId: employee._id,
    date: today,
  });

  const latest = attendance[0];

  return (
    <tr>
      <td className="px-6 py-4">{employee.fullName}</td>
      <td className="px-6 py-4">{employee.department}</td>

      <td className="px-6 py-4">
        {latest?.check_in
          ? new Date(latest.check_in).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })
          : "--"}
      </td>
      <td className="px-6 py-4">
        {latest?.check_out
          ? new Date(latest.check_out).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })
          : "--"}
      </td>
      <td className="px-6 py-4">
        {latest?.worked_minutes != null
          ? `${Math.floor(latest.worked_minutes / 60)}h ${
              latest.worked_minutes % 60
            }min`
          : "--"}
      </td>
      <td className="px-6 py-4">
        <span
          className={`
            px-3 py-1 rounded-full text-xs font-semibold 
            ${getStatusColor(latest?.status)}
          `}
        >
          {latest?.status}
        </span>
      </td>

      <td className="px-6 py-4">
        <AttendanceActionsClient
          attendanceId={latest._id}
          employee={employee}
          attendance={latest}
        />
      </td>
    </tr>
  );
}
