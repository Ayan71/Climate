import React, { useEffect, useState } from 'react';
import API from '../../services/api';
import { User } from 'lucide-react';

const ActivityLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        setLoading(true);
        const res = await API.get('/analytics/activity-logs');
        setLogs(res.data.logs || []);
      } catch (err) {
        console.error('Failed to load logs', err);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  return (
    <div className="space-y-6 pb-12 font-sans">
      <div className="border-b border-slate-200 pb-3">
        <h1 className="text-xl font-bold text-slate-900">System Audit Activity Logs</h1>
        <p className="text-xs text-slate-500">Track administrative logins, CSV dataset uploads, and approval workflow audit trails</p>
      </div>

      <div className="bg-white rounded border border-slate-200 p-5 shadow-sm space-y-4">
        <div className="overflow-x-auto border border-slate-200 rounded">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-100 text-slate-900 uppercase text-[10px] font-bold tracking-wider border-b border-slate-200">
              <tr>
                <th className="p-3">User</th>
                <th className="p-3">Action</th>
                <th className="p-3">Details</th>
                <th className="p-3">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {loading ? (
                <tr><td colSpan={4} className="p-8 text-center text-slate-400">Loading audit logs...</td></tr>
              ) : logs.length === 0 ? (
                <tr><td colSpan={4} className="p-8 text-center text-slate-500">No activity logs recorded yet.</td></tr>
              ) : (
                logs.map((log) => (
                  <tr key={log._id || log.id} className="hover:bg-slate-50">
                    <td className="p-3 font-bold text-slate-900 flex items-center space-x-2">
                      <User className="w-3.5 h-3.5 text-slate-500" />
                      <span>{log.userName || log.userEmail || 'System'}</span>
                    </td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 border border-slate-200 text-slate-800 font-mono">
                        {log.action}
                      </span>
                    </td>
                    <td className="p-3 text-slate-700">{log.details}</td>
                    <td className="p-3 text-slate-500 font-mono text-[11px]">{new Date(log.createdAt).toLocaleString()}</td>
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
