import { fetchEmployeesAction } from "./actions";
import AttendanceData from "./AttendanceData";

interface AttendanceDashboardProps {
  searchParams?: {
    date?: string;
  };
}

export default async function AttendanceDashboard({ searchParams }: AttendanceDashboardProps) {
  const date = searchParams?.date || new Date().toISOString().split("T")[0];
  const employees = await fetchEmployeesAction();
  return (
    <div className="bg-gray-50 p-4 space-y-4 w-full">
      <h1 className="text-2xl font-semibold">Employee Attendance System</h1>
      {/* Date picker as a GET form */}
      <form method="get" className="mb-4">
        <label className="mr-2 font-medium">Select Date:</label>
        <input
          type="date"
          name="date"
          defaultValue={date}
          className="border px-2 py-1 rounded"
        />
        <button type="submit" className="ml-2 px-3 py-1 bg-blue-600 text-white rounded">
          Go
        </button>
      </form>

      <section>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200 opacity-70">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold">
                  Employee
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold">
                  Department
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold">
                  Check In
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold">
                  Check Out
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold">
                  Works Hours
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {employees.map((employee) => (
                <AttendanceData key={employee._id} employee={employee} />
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
