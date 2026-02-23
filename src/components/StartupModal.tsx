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
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="sticky top-0 bg-white border-b border-slate-200 px-8 py-6 flex items-center justify-between z-10">
          <h2 className="text-3xl font-bold text-slate-900">{startup.name}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-xl transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-8">
          <div className="mb-8">
            <div className="h-64 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl relative overflow-hidden mb-6">
              {startup.logo_url ? (
                <img
                  src={startup.logo_url}
                  alt={startup.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <TrendingUp className="w-32 h-32 text-white/80" />
                </div>
              )}
            </div>

            {startup.sector && (
              <span className="inline-block px-4 py-2 bg-blue-100 text-blue-700 text-sm font-semibold rounded-full mb-4">
                {startup.sector.name}
              </span>
            )}

            <p className="text-slate-700 text-lg leading-relaxed mb-6">
              {startup.description || 'No description available'}
            </p>

            {startup.website && (
              <a
                href={startup.website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
              >
                <Globe className="w-5 h-5" />
                Visit Website
              </a>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-2xl p-6 border border-emerald-200">
              <div className="flex items-center gap-2 mb-2">
                <PieChart className="w-5 h-5 text-emerald-600" />
                <span className="text-sm font-semibold text-emerald-700">Profit Margin</span>
              </div>
              <p className="text-3xl font-bold text-emerald-900">{startup.profit_margin}%</p>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-200">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-semibold text-blue-700">Funding Needed</span>
              </div>
              <p className="text-3xl font-bold text-blue-900">
                ${(startup.funding_needed / 1000000).toFixed(1)}M
              </p>
            </div>

            <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-2xl p-6 border border-amber-200">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5 text-amber-600" />
                <span className="text-sm font-semibold text-amber-700">Equity Offered</span>
              </div>
              <p className="text-3xl font-bold text-amber-900">{startup.equity_offered}%</p>
            </div>

            <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl p-6 border border-slate-200">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-5 h-5 text-slate-600" />
                <span className="text-sm font-semibold text-slate-700">Founded</span>
              </div>
              <p className="text-3xl font-bold text-slate-900">{startup.founded_year}</p>
            </div>
          </div>

          <div className="border-t border-slate-200 pt-8">
            <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <User className="w-6 h-6 text-blue-600" />
              Interested Investors
            </h3>

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
              </div>
            ) : investors.length === 0 ? (
              <div className="text-center py-12 bg-slate-50 rounded-2xl">
                <p className="text-slate-500 text-lg">No investors yet</p>
                <p className="text-slate-400 text-sm mt-2">Be the first to show interest!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {investors.map((investor) => (
                  <div
                    key={investor.id}
                    className="bg-gradient-to-br from-slate-50 to-white rounded-2xl p-6 border border-slate-200 hover:border-blue-300 transition-all hover:shadow-md"
                  >
                    <div className="flex items-start gap-4">
                      <div className="bg-blue-100 rounded-full p-3">
                        <User className="w-6 h-6 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-lg text-slate-900 mb-3">
                          {investor.name}
                        </h4>
                        <div className="space-y-2">
                          {investor.phone && (
                            <div className="flex items-center gap-2 text-slate-600">
                              <Phone className="w-4 h-4" />
                              <span className="text-sm">{investor.phone}</span>
                            </div>
                          )}
                          {investor.email && (
                            <div className="flex items-center gap-2 text-slate-600">
                              <Mail className="w-4 h-4" />
                              <span className="text-sm">{investor.email}</span>
                            </div>
                          )}
                          {investor.investment_amount && (
                            <div className="flex items-center gap-2 text-emerald-600 font-semibold">
                              <DollarSign className="w-4 h-4" />
                              <span className="text-sm">
                                ${(investor.investment_amount / 1000000).toFixed(2)}M invested
                              </span>
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
