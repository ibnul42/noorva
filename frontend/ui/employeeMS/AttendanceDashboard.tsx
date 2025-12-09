import React from "react";


// This component is written to maximize SSR usage in Next.js 15 (App Router).
// All static data rendering, layout, and non-interactive UI is SSR.
// Only the dropdown, buttons, and refresh actions become client-side when needed.


// --- Server Component Wrapper ---
export default async function AttendanceDashboard() {
// Example: fetch attendance summary from server (SSR)
const summary = await getAttendanceSummary();


return (
<div className="p-6 space-y-6">
<h1 className="text-2xl font-semibold">Employee Attendance System</h1>


<QuickActions />


<SummaryCards summary={summary} />


<AttendanceReports />


<TodayOverview />
</div>
);
}


// Example server function
async function getAttendanceSummary() {
return {
present: 0,
absent: 0,
monthlyAvg: 0,
workingDays: 0,
};
}