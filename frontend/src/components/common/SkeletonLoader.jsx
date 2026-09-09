import React from 'react';

const SkeletonLoader = ({ count = 3, type = 'card' }) => {
  return (
    <div className="space-y-4 w-full">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="animate-pulse bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4"
        >
          <div className="h-5 bg-slate-200 dark:bg-slate-800 rounded w-1/3"></div>
          <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-2/3"></div>
          <div className="h-48 bg-slate-200 dark:bg-slate-800 rounded-xl w-full"></div>
        </div>
      ))}
    </div>
  );
};

export default SkeletonLoader;
