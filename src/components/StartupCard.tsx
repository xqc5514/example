import { TrendingUp, DollarSign, PieChart, Calendar } from 'lucide-react';
import type { StartupWithSector } from '../lib/database.types';

interface StartupCardProps {
  startup: StartupWithSector;
  onClick: () => void;
}

export default function StartupCard({ startup, onClick }: StartupCardProps) {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer border border-slate-200 overflow-hidden group"
    >
      <div className="h-48 bg-gradient-to-br from-blue-500 to-cyan-500 relative overflow-hidden">
        {startup.logo_url ? (
          <img
            src={startup.logo_url}
            alt={startup.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <TrendingUp className="w-20 h-20 text-white/80" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
        <div className="absolute bottom-4 left-4 right-4">
          <h3 className="text-2xl font-bold text-white mb-1 truncate">
            {startup.name}
          </h3>
          {startup.sector && (
            <span className="inline-block px-3 py-1 bg-white/90 text-blue-600 text-xs font-semibold rounded-full">
              {startup.sector.name}
            </span>
          )}
        </div>
      </div>

      <div className="p-6">
        <p className="text-slate-600 text-sm mb-4 line-clamp-2 min-h-[2.5rem]">
          {startup.description || 'No description available'}
        </p>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-emerald-50 rounded-xl p-3 border border-emerald-100">
            <div className="flex items-center gap-2 mb-1">
              <PieChart className="w-4 h-4 text-emerald-600" />
              <span className="text-xs font-medium text-emerald-700">Profit Margin</span>
            </div>
            <p className="text-xl font-bold text-emerald-900">{startup.profit_margin}%</p>
          </div>

          <div className="bg-blue-50 rounded-xl p-3 border border-blue-100">
            <div className="flex items-center gap-2 mb-1">
              <DollarSign className="w-4 h-4 text-blue-600" />
              <span className="text-xs font-medium text-blue-700">Seeking</span>
            </div>
            <p className="text-xl font-bold text-blue-900">
              ${(startup.funding_needed / 1000000).toFixed(1)}M
            </p>
          </div>

          <div className="bg-amber-50 rounded-xl p-3 border border-amber-100">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="w-4 h-4 text-amber-600" />
              <span className="text-xs font-medium text-amber-700">Equity</span>
            </div>
            <p className="text-xl font-bold text-amber-900">{startup.equity_offered}%</p>
          </div>

          <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
            <div className="flex items-center gap-2 mb-1">
              <Calendar className="w-4 h-4 text-slate-600" />
              <span className="text-xs font-medium text-slate-700">Founded</span>
            </div>
            <p className="text-xl font-bold text-slate-900">{startup.founded_year}</p>
          </div>
        </div>

        <button className="w-full mt-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-cyan-700 transition-all shadow-md group-hover:shadow-lg">
          View Details
        </button>
      </div>
    </div>
  );
}
