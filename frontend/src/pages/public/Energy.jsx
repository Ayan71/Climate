import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchDomainDatasets } from '../../redux/datasetSlice';
import ChartRenderer from '../../components/visualizations/ChartRenderer';
import SkeletonLoader from '../../components/common/SkeletonLoader';
import { Zap, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';

const Energy = () => {
  const dispatch = useDispatch();
  const { domainLists, loading } = useSelector((state) => state.datasets);
  const energyList = domainLists.Energy || [];

  useEffect(() => {
    dispatch(fetchDomainDatasets('Energy'));
  }, [dispatch]);

  return (
    <div className="space-y-8 pb-12">
      <div className="p-8 rounded-3xl bg-gradient-to-r from-amber-900 via-yellow-950 to-slate-900 text-white border border-amber-800 shadow-xl space-y-3">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold">
          <Zap className="w-4 h-4" />
          <span>Explicit Route: /energy</span>
        </div>
        <h1 className="text-3xl font-extrabold">Renewable & Clean Energy Datasets</h1>
        <p className="text-slate-300 text-xs sm:text-sm max-w-2xl leading-relaxed">
          State-level solar installed capacity, utility-scale wind power generation trends, and clean energy transition metrics across India.
        </p>
      </div>

      {loading ? (
        <SkeletonLoader count={2} />
      ) : energyList.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 text-slate-500">
          <Zap className="w-10 h-10 mx-auto mb-2 text-amber-500" />
          <p className="font-bold">No approved Energy datasets published yet.</p>
        </div>
      ) : (
        <div className="space-y-10">
          {energyList.map((dataset) => (
            <article
              key={dataset._id || dataset.id}
              className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xl space-y-6"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
                <div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300">
                    Energy Domain &bull; {dataset.chartType}
                  </span>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-1">
                    {dataset.title}
                  </h2>
                </div>
                <Link
                  to={`/dataset/${dataset._id || dataset.id}`}
                  className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800"
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

export default Energy;
