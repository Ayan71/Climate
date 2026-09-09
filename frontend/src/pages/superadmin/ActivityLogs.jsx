import React, { useEffect, useState } from 'react';
import API from '../../services/api';
import { Activity, Clock, User, ShieldAlert } from 'lucide-react';

const ActivityLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        setLoading(true);
        const res = await API.get('/analytics/activity-logs');
        setLogs(res.data.logs);
      } catch (err) {
        console.error('Failed to load logs', err);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  return (
    <div className="space-y-6 pb-12">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">System Audit Activity Logs</h1>
        <p className="text-xs text-slate-500">Track administrative logins, CSV dataset uploads, and approval workflow audit trails</p>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-xl space-y-4">
        <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
          <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
            <thead className="bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 uppercase text-[10px] font-extrabold tracking-wider border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="p-3.5">User</th>
                <th className="p-3.5">Action</th>
                <th className="p-3.5">Details</th>
                <th className="p-3.5">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {loading ? (
                <tr><td colSpan={4} className="p-8 text-center text-slate-400">Loading audit logs...</td></tr>
              ) : logs.length === 0 ? (
                <tr><td colSpan={4} className="p-8 text-center text-slate-500">No activity logs recorded yet.</td></tr>
              ) : (
                logs.map((log) => (
                  <tr key={log._id || log.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="p-3.5 font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                      <User className="w-4 h-4 text-teal-600" />
                      <span>{log.userName || log.userEmail || 'System'}</span>
                    </td>
                    <td className="p-3.5">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-slate-100 dark:bg-slate-800 font-mono">
                        {log.action}
                      </span>
                    </td>
                    <td className="p-3.5 text-slate-600 dark:text-slate-300">{log.details}</td>
                    <td className="p-3.5 text-slate-400 font-mono text-[11px]">{new Date(log.createdAt).toLocaleString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ActivityLogs;
