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
      className="bg-white border border-slate-200 rounded-xl overflow-hidden cursor-pointer group hover:border-slate-400 hover:shadow-xl transition-all duration-500 hover:-translate-y-1"
    >
      <div className="h-40 bg-gradient-to-br from-slate-100 to-slate-200 relative overflow-hidden flex items-center justify-center group-hover:from-slate-150 group-hover:to-slate-250 transition-all duration-500">
        {startup.logo_url ? (
          <img
            src={startup.logo_url}
            alt={startup.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div className="bg-slate-200 w-full h-full flex items-center justify-center">
            <TrendingUp className="w-16 h-16 text-slate-400 group-hover:text-slate-500 group-hover:scale-110 transition-all duration-500" />
          </div>
        )}
      </div>

      <div className="p-6">
        <h3 className="text-xl font-semibold text-slate-950 mb-2 truncate group-hover:text-slate-700 transition-colors duration-300">
          {startup.name}
        </h3>

        {startup.sector && (
          <span className="inline-block px-2 py-1 bg-slate-100 text-slate-600 text-xs font-medium rounded mb-3 group-hover:bg-slate-200 transition-colors duration-300">
            {startup.sector.name}
          </span>
        )}

        <p className="text-slate-600 text-sm mb-4 line-clamp-2 min-h-[2.5rem] group-hover:text-slate-700 transition-colors duration-300">
          {startup.description || 'No description available'}
        </p>

        <div className="space-y-3 mb-4">
          <div className="flex justify-between items-center py-2 border-t border-slate-100 group-hover:border-slate-200 transition-colors duration-300">
            <span className="text-xs text-slate-500 font-medium">Profit Margin</span>
            <span className="text-sm font-semibold text-slate-950 group-hover:text-slate-700 transition-colors duration-300">{startup.profit_margin}%</span>
          </div>
          <div className="flex justify-between items-center py-2 border-t border-slate-100 group-hover:border-slate-200 transition-colors duration-300">
            <span className="text-xs text-slate-500 font-medium">Seeking</span>
            <span className="text-sm font-semibold text-slate-950 group-hover:text-slate-700 transition-colors duration-300">${(startup.funding_needed / 1000000).toFixed(1)}M</span>
          </div>
          <div className="flex justify-between items-center py-2 border-t border-slate-100 group-hover:border-slate-200 transition-colors duration-300">
            <span className="text-xs text-slate-500 font-medium">Equity</span>
            <span className="text-sm font-semibold text-slate-950 group-hover:text-slate-700 transition-colors duration-300">{startup.equity_offered}%</span>
          </div>
          <div className="flex justify-between items-center py-2 border-t border-slate-100 group-hover:border-slate-200 transition-colors duration-300">
            <span className="text-xs text-slate-500 font-medium">Founded</span>
            <span className="text-sm font-semibold text-slate-950 group-hover:text-slate-700 transition-colors duration-300">{startup.founded_year}</span>
          </div>
        </div>

        <button className="w-full bg-slate-950 text-white py-2.5 rounded-lg font-medium text-sm hover:bg-slate-800 active:scale-95 transition-all duration-200 group-hover:shadow-md">
          View Opportunity
        </button>
      </div>
    </div>
  );
}
