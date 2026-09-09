import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchDomainDatasets } from '../../redux/datasetSlice';
import ChartRenderer from '../../components/visualizations/ChartRenderer';
import SkeletonLoader from '../../components/common/SkeletonLoader';
import { Activity, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';

const Power = () => {
  const dispatch = useDispatch();
  const { domainLists, loading } = useSelector((state) => state.datasets);
  const powerList = domainLists.Power || [];

  useEffect(() => {
    dispatch(fetchDomainDatasets('Power'));
  }, [dispatch]);

  return (
    <div className="space-y-8 pb-12">
      <div className="p-8 rounded-3xl bg-gradient-to-r from-blue-900 via-indigo-950 to-slate-900 text-white border border-blue-800 shadow-xl space-y-3">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 text-xs font-semibold">
          <Activity className="w-4 h-4" />
          <span>Explicit Route: /power</span>
        </div>
        <h1 className="text-3xl font-extrabold">National Power Grid & Demand Metrics</h1>
        <p className="text-slate-300 text-xs sm:text-sm max-w-2xl leading-relaxed">
          Peak electricity demand vs met power availability, per capita consumption indices, and high-voltage grid substation mapping.
        </p>
      </div>

      {loading ? (
        <SkeletonLoader count={2} />
      ) : powerList.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 text-slate-500">
          <Activity className="w-10 h-10 mx-auto mb-2 text-blue-500" />
          <p className="font-bold">No approved Power datasets published yet.</p>
        </div>
      ) : (
        <div className="space-y-10">
          {powerList.map((dataset) => (
            <article
              key={dataset._id || dataset.id}
              className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xl space-y-6"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
                <div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                    Power Domain &bull; {dataset.chartType}
                  </span>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-1">
                    {dataset.title}
                  </h2>
                </div>
                <Link
                  to={`/dataset/${dataset._id || dataset.id}`}
                  className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-xl text-xs font-bold bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Inspect Data Table</span>
                </Link>
              </div>

              {dataset.description && (
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  {dataset.description}
                </p>
              )}

              <ChartRenderer dataset={dataset} />
            </article>
          ))}
        </div>
      )}
    </div>
  );
};

export default Power;
