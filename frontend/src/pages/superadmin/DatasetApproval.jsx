import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchAdminDatasets, approveDataset, rejectDataset } from '../../redux/datasetSlice';
import ChartRenderer from '../../components/visualizations/ChartRenderer';
import Modal from '../../components/common/Modal';
import { toast } from 'react-toastify';
import { CheckCircle2, XCircle, Eye } from 'lucide-react';

const DatasetApproval = () => {
  const dispatch = useDispatch();
  const { adminList } = useSelector((state) => state.datasets);

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
    <div className="space-y-6 pb-12 font-sans">
      <div className="border-b border-slate-200 pb-3">
        <h1 className="text-xl font-bold text-slate-900">Dataset Approval Queue</h1>
        <p className="text-xs text-slate-500">Review pending CSV telemetry datasets submitted by Admins before public release</p>
      </div>

      {pendingList.length === 0 ? (
        <div className="p-12 text-center bg-white rounded border border-slate-200 text-slate-500 space-y-2">
          <CheckCircle2 className="w-8 h-8 mx-auto text-green-600" />
          <p className="font-bold text-sm text-slate-900">No Pending Approval Requests</p>
          <p className="text-xs">All submitted datasets have been reviewed and published.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {pendingList.map((dataset) => (
            <div
              key={dataset._id || dataset.id}
              className="bg-white rounded border border-slate-200 p-5 shadow-sm space-y-4"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-50 text-amber-800 border border-amber-200">
                      Pending Review &bull; {dataset.domain}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">
                      Type: {dataset.chartType}
                    </span>
                  </div>
                  <h2 className="text-lg font-bold text-slate-900">{dataset.title}</h2>
                  <p className="text-xs text-slate-500">
                    Uploaded by: <strong>{dataset.uploadedBy?.name || 'Admin'}</strong> ({dataset.uploadedBy?.email}) on {new Date(dataset.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setPreviewDataset(dataset)}
                    className="flex items-center space-x-1 px-3 py-1.5 rounded border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-bold"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Inspect</span>
                  </button>

                  <button
                    onClick={() => openRejectModal(dataset._id || dataset.id)}
                    className="flex items-center space-x-1 px-3 py-1.5 rounded bg-red-50 text-red-700 text-xs font-bold border border-red-200 hover:bg-red-100"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    <span>Reject</span>
                  </button>

                  <button
                    onClick={() => handleApprove(dataset._id || dataset.id)}
                    className="flex items-center space-x-1 px-4 py-1.5 rounded bg-slate-900 hover:bg-black text-white text-xs font-bold shadow-sm"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-green-400" />
                    <span>Approve & Publish</span>
                  </button>
                </div>
              </div>

              {dataset.description && (
                <p className="text-xs text-slate-600 leading-relaxed">{dataset.description}</p>
              )}

              {/* Render Preview Component */}
              <div className="pt-1">
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
        <div className="space-y-4 font-sans">
          <p className="text-xs text-slate-600">
            Please provide rejection feedback for the Admin user:
          </p>
          <textarea
            rows={3}
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            placeholder="e.g. Malformed field values or incorrect state name format..."
            className="w-full p-2.5 text-xs rounded border border-slate-300 bg-white focus:border-slate-800 outline-none"
          />
          <div className="flex justify-end space-x-2 pt-2">
            <button
              onClick={() => setRejectModalOpen(false)}
              className="px-3 py-1.5 rounded text-xs font-semibold text-slate-600 border border-slate-300 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmReject}
              className="px-4 py-1.5 rounded text-xs font-bold text-white bg-red-600 hover:bg-red-700 shadow-sm"
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
