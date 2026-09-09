import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchAdminDatasets, approveDataset, rejectDataset } from '../../redux/datasetSlice';
import ChartRenderer from '../../components/visualizations/ChartRenderer';
import Modal from '../../components/common/Modal';
import { toast } from 'react-toastify';
import { CheckCircle2, XCircle, Eye, AlertCircle, User, Calendar } from 'lucide-react';

const DatasetApproval = () => {
  const dispatch = useDispatch();
  const { adminList, loading } = useSelector((state) => state.datasets);

  const [previewDataset, setPreviewDataset] = useState(null);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [targetRejectId, setTargetRejectId] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');

  useEffect(() => {
    dispatch(fetchAdminDatasets({ status: 'pending' }));
  }, [dispatch]);

  const pendingList = adminList.filter((d) => d.status === 'pending');

  const handleApprove = async (id) => {
    const result = await dispatch(approveDataset(id));
    if (approveDataset.fulfilled.match(result)) {
      toast.success('Dataset approved and automatically published on public portal!');
      dispatch(fetchAdminDatasets({ status: 'pending' }));
      if (previewDataset && (previewDataset._id === id || previewDataset.id === id)) {
        setPreviewDataset(null);
      }
    } else {
      toast.error(result.payload || 'Failed to approve dataset');
    }
  };

  const openRejectModal = (id) => {
    setTargetRejectId(id);
    setRejectionReason('');
    setRejectModalOpen(true);
  };

  const handleConfirmReject = async () => {
    if (!targetRejectId) return;
    const result = await dispatch(rejectDataset({ id: targetRejectId, rejectionReason }));
    if (rejectDataset.fulfilled.match(result)) {
      toast.info('Dataset marked as Rejected.');
      setRejectModalOpen(false);
      dispatch(fetchAdminDatasets({ status: 'pending' }));
      if (previewDataset && (previewDataset._id === targetRejectId || previewDataset.id === targetRejectId)) {
        setPreviewDataset(null);
      }
    } else {
      toast.error(result.payload || 'Failed to reject dataset');
    }
  };

  return (
    <div className="space-y-8 pb-12">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">Dataset Approval Queue</h1>
        <p className="text-xs text-slate-500">Review pending CSV telemetry datasets submitted by Admins before public release</p>
      </div>

      {pendingList.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 text-slate-500 space-y-2">
          <CheckCircle2 className="w-10 h-10 mx-auto text-emerald-500" />
          <p className="font-bold text-base text-slate-700 dark:text-slate-200">No Pending Approval Requests!</p>
          <p className="text-xs">All submitted datasets have been reviewed and published.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {pendingList.map((dataset) => (
            <div
              key={dataset._id || dataset.id}
              className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-xl space-y-4"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300">
                      Pending &bull; {dataset.domain}
                    </span>
                    <span className="text-xs font-semibold text-slate-400">
                      Chart Type: {dataset.chartType}
                    </span>
                  </div>
                  <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">{dataset.title}</h2>
                  <p className="text-xs text-slate-400">
                    Uploaded by: <strong>{dataset.uploadedBy?.name || 'Admin'}</strong> ({dataset.uploadedBy?.email}) on {new Date(dataset.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setPreviewDataset(dataset)}
                    className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold hover:bg-slate-200"
                  >
                    <Eye className="w-4 h-4" />
                    <span>Inspect Preview</span>
                  </button>

                  <button
                    onClick={() => openRejectModal(dataset._id || dataset.id)}
                    className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 text-xs font-bold border border-rose-200 dark:border-rose-800 hover:bg-rose-100"
                  >
                    <XCircle className="w-4 h-4" />
                    <span>Reject</span>
                  </button>

                  <button
                    onClick={() => handleApprove(dataset._id || dataset.id)}
                    className="flex items-center space-x-1.5 px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold shadow-md shadow-emerald-600/20"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Approve & Publish</span>
                  </button>
                </div>
              </div>

              {dataset.description && (
                <p className="text-xs text-slate-600 dark:text-slate-300">{dataset.description}</p>
              )}

              {/* Render Preview Component */}
              <div className="pt-2">
                <ChartRenderer dataset={dataset} />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Rejection Modal with Feedback Input */}
      <Modal
        isOpen={rejectModalOpen}
        onClose={() => setRejectModalOpen(false)}
        title="Reject Dataset Submission"
        maxWidth="max-w-md"
      >
        <div className="space-y-4">
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Please provide a rejection feedback reason for the Admin user:
          </p>
          <textarea
            rows={3}
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            placeholder="e.g. Malformed field values or wrong chart type selected..."
            className="w-full p-3 font-sans text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-rose-500 outline-none"
          />
          <div className="flex justify-end space-x-3 pt-2">
            <button
              onClick={() => setRejectModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 bg-slate-100 dark:bg-slate-800"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmReject}
              className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 shadow"
            >
              Confirm Rejection
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default DatasetApproval;
