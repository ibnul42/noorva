"use client";

import React, { useEffect, useState } from "react";

type User = {
  _id: string;
  name?: string;
  email: string;
  username?: string;
  requestedSystemsAccess?: Record<string, boolean>;
};

export default function PendingList() {
  const [items, setItems] = useState<User[]>([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(25);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchPage = async (p = 1) => {
    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE}/api/users/review/pending?page=${p}&limit=${limit}`,
        { credentials: "include" }
      );
      if (!res.ok) throw new Error("Failed to load");
      const data = await res.json();
      console.log(data);
      setItems(data.items || []);
      setPage(data.page || p);
      setTotal(data.total || 0);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const doAction = async (id: string, action: "approve" | "reject") => {
    if (!confirm(`Are you sure you want to ${action} this user?`)) return;
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE}/api/users/review/${id}/${action}`,
        {
          method: "POST",
          credentials: "include",
        }
      );
      if (!res.ok) {
        const t = await res.text();
        throw new Error(t || "action failed");
      }
      // refresh
      fetchPage(page);
    } catch (err) {
      console.error(err);
      alert("Action failed");
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Pending requests</h2>
        <div className="text-sm text-slate-500">Total: {total}</div>
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : items.length === 0 ? (
        <div className="text-slate-600">No pending requests</div>
      ) : (
        <div className="space-y-3">
          {items.map((u) => (
            <div
              key={u._id}
              className="p-3 border rounded-md flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
            >
              <div>
                <div className="font-medium">
                  {u.name || u.username || u.email}
                </div>
                <div className="text-sm text-slate-500">
                  {u.email}
                  {u.username ? ` • @${u.username}` : ""}
                </div>
                {u.requestedSystemsAccess && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {Object.entries(u.requestedSystemsAccess)
                      .filter((entry) => entry[1])
                      .map((entry) => {
                        const key = entry[0];
                        return (
                          <span
                            key={key}
                            className="text-xs bg-emerald-50 text-emerald-700 px-2 py-1 rounded"
                          >
                            {key}
                          </span>
                        );
                      })}
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => doAction(u._id, "approve")}
                  className="px-3 py-1 rounded bg-emerald-600 text-white cursor-pointer"
                >
                  Approve
                </button>
                <button
                  onClick={() => doAction(u._id, "reject")}
                  className="px-3 py-1 rounded bg-gray-200 cursor-pointer"
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-4 flex items-center justify-between">
        <div className="text-sm text-slate-500">Page {page}</div>
        <div className="flex gap-2">
          <button
            disabled={page <= 1}
            onClick={() => fetchPage(page - 1)}
            className="px-3 py-1 rounded bg-gray-100"
          >
            Prev
          </button>
          <button
            disabled={page * limit >= total}
            onClick={() => fetchPage(page + 1)}
            className="px-3 py-1 rounded bg-gray-100"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
