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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-blue-600 to-cyan-600 p-3 rounded-xl shadow-lg">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                  Shark Tank
                </h1>
                <p className="text-sm text-slate-600">Discover the next big thing</p>
              </div>
            </div>
          </div>

          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search startups..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm transition-all"
            />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            <button
              onClick={() => setSelectedSector('all')}
              className={`px-6 py-2.5 rounded-xl font-medium whitespace-nowrap transition-all shadow-sm ${
                selectedSector === 'all'
                  ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-md'
                  : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
              }`}
            >
              All Startups
            </button>
            {sectors.map((sector) => (
              <button
                key={sector.id}
                onClick={() => setSelectedSector(sector.id)}
                className={`px-6 py-2.5 rounded-xl font-medium whitespace-nowrap transition-all shadow-sm ${
                  selectedSector === sector.id
                    ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-md'
                    : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
                }`}
              >
                {sector.name}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : filteredStartups.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-slate-400 text-lg">No startups found</div>
            <p className="text-slate-500 mt-2">Try adjusting your search or filters</p>
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
