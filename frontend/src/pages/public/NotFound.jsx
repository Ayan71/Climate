import React from 'react';
import { Link } from 'react-router-dom';
import { HelpCircle, Home } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-6 space-y-4">
      <div className="w-16 h-16 rounded-2xl bg-teal-100 dark:bg-teal-950/80 text-teal-600 flex items-center justify-center shadow-lg">
        <HelpCircle className="w-10 h-10 animate-bounce" />
      </div>
      <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">404 - Page Not Found</h1>
      <p className="text-xs sm:text-sm text-slate-500 max-w-md">
        The route or visualization page you are looking for does not exist or has been removed.
      </p>
      <Link
        to="/"
        className="inline-flex items-center space-x-2 px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl text-xs shadow-lg transition-all"
      >
        <Home className="w-4 h-4" />
        <span>Return to Main Landing Page</span>
      </Link>
    </div>
  );
};

export default NotFound;
