import { useEffect, useState } from 'react';
import { Search, TrendingUp } from 'lucide-react';
import { supabase } from './lib/supabase';
import type { Sector, StartupWithSector } from './lib/database.types';
import StartupCard from './components/StartupCard';
import StartupModal from './components/StartupModal';

function App() {
  const [startups, setStartups] = useState<StartupWithSector[]>([]);
  const [sectors, setSectors] = useState<Sector[]>([]);
  const [selectedSector, setSelectedSector] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStartup, setSelectedStartup] = useState<StartupWithSector | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [startupsResponse, sectorsResponse] = await Promise.all([
        supabase
          .from('startups')
          .select(`
            *,
            sector:sectors(*)
          `)
          .order('created_at', { ascending: false }),
        supabase
          .from('sectors')
          .select('*')
          .order('name')
      ]);

      if (startupsResponse.data) {
        setStartups(startupsResponse.data as StartupWithSector[]);
      }
      if (sectorsResponse.data) {
        setSectors(sectorsResponse.data);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredStartups = startups.filter(startup => {
    const matchesSector = selectedSector === 'all' || startup.sector_id === selectedSector;
    const matchesSearch =
      startup.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      startup.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSector && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-white">
      <header className="bg-white border-b border-slate-900/5 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">in</span>
            </div>
            <span className="text-2xl font-semibold text-slate-950">invest.in</span>
          </div>

          <div className="flex-1 max-w-md mx-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search opportunities..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent text-sm"
              />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12">
          <div className="mb-8">
            <h1 className="text-5xl font-light text-slate-950 mb-2">Investment Opportunities</h1>
            <p className="text-lg text-slate-600 font-light">Explore exceptional startups across industries</p>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            <button
              onClick={() => setSelectedSector('all')}
              className={`px-4 py-2 rounded-full font-medium whitespace-nowrap text-sm transition-all ${
                selectedSector === 'all'
                  ? 'bg-slate-950 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              All
            </button>
            {sectors.map((sector) => (
              <button
                key={sector.id}
                onClick={() => setSelectedSector(sector.id)}
                className={`px-4 py-2 rounded-full font-medium whitespace-nowrap text-sm transition-all ${
                  selectedSector === sector.id
                    ? 'bg-slate-950 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {sector.name}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-slate-200 border-t-slate-950"></div>
          </div>
        ) : filteredStartups.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-slate-500 text-lg">No opportunities found</div>
            <p className="text-slate-400 mt-2">Try adjusting your search</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStartups.map((startup) => (
              <StartupCard
                key={startup.id}
                startup={startup}
                onClick={() => setSelectedStartup(startup)}
              />
            ))}
          </div>
        )}
      </main>

      {selectedStartup && (
        <StartupModal
          startup={selectedStartup}
          onClose={() => setSelectedStartup(null)}
        />
      )}
    </div>
  );
}

export default App;
