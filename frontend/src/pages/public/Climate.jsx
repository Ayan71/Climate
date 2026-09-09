import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchDomainDatasets } from '../../redux/datasetSlice';
import ChartRenderer from '../../components/visualizations/ChartRenderer';
import SkeletonLoader from '../../components/common/SkeletonLoader';
import { Wind, ShieldCheck, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';

const Climate = () => {
  const dispatch = useDispatch();
  const { domainLists, loading } = useSelector((state) => state.datasets);
  const climateList = domainLists.Climate || [];

  useEffect(() => {
    dispatch(fetchDomainDatasets('Climate'));
  }, [dispatch]);

  return (
    <div className="space-y-8 pb-12">
      {/* Header Banner */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-teal-900 via-emerald-950 to-slate-900 text-white border border-teal-800 shadow-xl space-y-3">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30 text-xs font-semibold">
          <Wind className="w-4 h-4" />
          <span>Explicit Route: /climate</span>
        </div>
        <h1 className="text-3xl font-extrabold">Climate Telemetry & Indicators</h1>
        <p className="text-slate-300 text-xs sm:text-sm max-w-2xl leading-relaxed">
          Official telemetry datasets tracking ambient surface temperature anomalies, heatwave alerts, and air quality index monitoring stations across India.
        </p>
      </div>

      {/* Dataset List */}
      {loading ? (
        <SkeletonLoader count={2} />
      ) : climateList.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 text-slate-500">
          <Wind className="w-10 h-10 mx-auto mb-2 text-teal-500" />
          <p className="font-bold">No approved Climate datasets published yet.</p>
        </div>
      ) : (
        <div className="space-y-10">
          {climateList.map((dataset) => (
            <article
              key={dataset._id || dataset.id}
              className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xl space-y-6"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
                <div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300">
                    Climate Domain &bull; {dataset.chartType}
                  </span>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-1">
                    {dataset.title}
                  </h2>
                </div>
                <Link
                  to={`/dataset/${dataset._id || dataset.id}`}
                  className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-xl text-xs font-bold bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800"
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

export default Climate;
