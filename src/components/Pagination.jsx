import React from "react";

export default function Pagination({ page, totalPages, onPage }) {
  if (totalPages <= 1) return null;
  return (
    <div className="flex items-center gap-2 mt-6">
      <button disabled={page <= 1} onClick={() => onPage(page - 1)} className="px-3 py-1 rounded border disabled:opacity-50">Prev</button>
      <div className="text-sm">Page {page} of {totalPages}</div>
      <button disabled={page >= totalPages} onClick={() => onPage(page + 1)} className="px-3 py-1 rounded border disabled:opacity-50">Next</button>
    </div>
  );
}