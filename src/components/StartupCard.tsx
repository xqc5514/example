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
      className="bg-white border border-slate-200 rounded-xl overflow-hidden cursor-pointer group hover:border-slate-300 hover:shadow-md transition-all duration-300"
    >
      <div className="h-40 bg-slate-100 relative overflow-hidden flex items-center justify-center">
        {startup.logo_url ? (
          <img
            src={startup.logo_url}
            alt={startup.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="bg-slate-200 w-full h-full flex items-center justify-center">
            <TrendingUp className="w-16 h-16 text-slate-400" />
          </div>
        )}
      </div>

      <div className="p-6">
        <h3 className="text-xl font-semibold text-slate-950 mb-2 truncate">
          {startup.name}
        </h3>

        {startup.sector && (
          <span className="inline-block px-2 py-1 bg-slate-100 text-slate-600 text-xs font-medium rounded mb-3">
            {startup.sector.name}
          </span>
        )}

        <p className="text-slate-600 text-sm mb-4 line-clamp-2 min-h-[2.5rem]">
          {startup.description || 'No description available'}
        </p>

        <div className="space-y-3 mb-4">
          <div className="flex justify-between items-center py-2 border-t border-slate-100">
            <span className="text-xs text-slate-500 font-medium">Profit Margin</span>
            <span className="text-sm font-semibold text-slate-950">{startup.profit_margin}%</span>
          </div>
          <div className="flex justify-between items-center py-2 border-t border-slate-100">
            <span className="text-xs text-slate-500 font-medium">Seeking</span>
            <span className="text-sm font-semibold text-slate-950">${(startup.funding_needed / 1000000).toFixed(1)}M</span>
          </div>
          <div className="flex justify-between items-center py-2 border-t border-slate-100">
            <span className="text-xs text-slate-500 font-medium">Equity</span>
            <span className="text-sm font-semibold text-slate-950">{startup.equity_offered}%</span>
          </div>
          <div className="flex justify-between items-center py-2 border-t border-slate-100">
            <span className="text-xs text-slate-500 font-medium">Founded</span>
            <span className="text-sm font-semibold text-slate-950">{startup.founded_year}</span>
          </div>
        </div>

        <button className="w-full bg-slate-950 text-white py-2.5 rounded-lg font-medium text-sm hover:bg-slate-800 transition-colors">
          View Opportunity
        </button>
      </div>
    </div>
  );
}
