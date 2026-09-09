import React from 'react';
import { CheckCircle2, Clock, XCircle } from 'lucide-react';

const StatusBadge = ({ status }) => {
  const s = String(status).toLowerCase();

  if (s === 'approved') {
    return (
      <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
        <CheckCircle2 className="w-3.5 h-3.5" />
        <span>Approved</span>
      </span>
    );
  }

  if (s === 'rejected') {
    return (
      <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 dark:bg-rose-950/70 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
        <XCircle className="w-3.5 h-3.5" />
        <span>Rejected</span>
      </span>
    );
  }

  return (
    <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 dark:bg-amber-950/70 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 animate-pulse">
      <Clock className="w-3.5 h-3.5" />
      <span>Pending</span>
    </span>
  );
};

export default StatusBadge;
