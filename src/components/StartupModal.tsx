import { useEffect, useState } from 'react';
import { X, TrendingUp, DollarSign, PieChart, Calendar, Globe, Phone, Mail, User } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { StartupWithSector, Investor } from '../lib/database.types';

interface StartupModalProps {
  startup: StartupWithSector;
  onClose: () => void;
}

export default function StartupModal({ startup, onClose }: StartupModalProps) {
  const [investors, setInvestors] = useState<Investor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadInvestors();
  }, [startup.id]);

  const loadInvestors = async () => {
    try {
      const { data } = await supabase
        .from('investors')
        .select('*')
        .eq('startup_id', startup.id);

      if (data) {
        setInvestors(data);
      }
    } catch (error) {
      console.error('Error loading investors:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="sticky top-0 bg-white border-b border-slate-100 px-8 py-6 flex items-center justify-between z-10">
          <h2 className="text-4xl font-light text-slate-950">{startup.name}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-slate-600" />
          </button>
        </div>

        <div className="p-8">
          <div className="mb-10">
            <div className="h-56 bg-slate-100 rounded-lg relative overflow-hidden mb-8 flex items-center justify-center">
              {startup.logo_url ? (
                <img
                  src={startup.logo_url}
                  alt={startup.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <TrendingUp className="w-24 h-24 text-slate-300" />
                </div>
              )}
            </div>

            {startup.sector && (
              <span className="inline-block px-3 py-1 bg-slate-100 text-slate-600 text-xs font-semibold rounded mb-4">
                {startup.sector.name}
              </span>
            )}

            <p className="text-slate-600 text-base leading-relaxed mb-6 font-light">
              {startup.description || 'No description available'}
            </p>

            {startup.website && (
              <a
                href={startup.website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-slate-950 hover:text-slate-700 font-medium text-sm"
              >
                <Globe className="w-4 h-4" />
                Visit Website
              </a>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-10">
            <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
              <span className="text-xs text-slate-500 font-medium block mb-2">Profit Margin</span>
              <p className="text-2xl font-semibold text-slate-950">{startup.profit_margin}%</p>
            </div>

            <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
              <span className="text-xs text-slate-500 font-medium block mb-2">Funding Needed</span>
              <p className="text-2xl font-semibold text-slate-950">${(startup.funding_needed / 1000000).toFixed(1)}M</p>
            </div>

            <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
              <span className="text-xs text-slate-500 font-medium block mb-2">Equity Offered</span>
              <p className="text-2xl font-semibold text-slate-950">{startup.equity_offered}%</p>
            </div>

            <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
              <span className="text-xs text-slate-500 font-medium block mb-2">Founded</span>
              <p className="text-2xl font-semibold text-slate-950">{startup.founded_year}</p>
            </div>
          </div>

          <div className="border-t border-slate-100 pt-8">
            <h3 className="text-2xl font-light text-slate-950 mb-6">Interested Investors</h3>

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-slate-200 border-t-slate-950"></div>
              </div>
            ) : investors.length === 0 ? (
              <div className="text-center py-12 bg-slate-50 rounded-lg border border-slate-200">
                <p className="text-slate-500 text-sm">No investors listed yet</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {investors.map((investor) => (
                  <div
                    key={investor.id}
                    className="bg-slate-50 rounded-lg p-5 border border-slate-200 hover:border-slate-300 transition-all hover:shadow-sm"
                  >
                    <div className="flex items-start gap-3">
                      <div className="bg-slate-200 rounded-full p-2.5 flex-shrink-0">
                        <User className="w-4 h-4 text-slate-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-slate-950 text-sm truncate mb-2">
                          {investor.name}
                        </h4>
                        <div className="space-y-1.5">
                          {investor.phone && (
                            <div className="flex items-center gap-2 text-slate-600 text-xs">
                              <Phone className="w-3 h-3 flex-shrink-0" />
                              <span className="truncate">{investor.phone}</span>
                            </div>
                          )}
                          {investor.email && (
                            <div className="flex items-center gap-2 text-slate-600 text-xs">
                              <Mail className="w-3 h-3 flex-shrink-0" />
                              <span className="truncate">{investor.email}</span>
                            </div>
                          )}
                          {investor.investment_amount && (
                            <div className="flex items-center gap-2 text-slate-950 font-medium text-xs">
                              <DollarSign className="w-3 h-3 flex-shrink-0" />
                              <span>${(investor.investment_amount / 1000000).toFixed(2)}M</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
