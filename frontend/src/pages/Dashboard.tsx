import { useEffect, useState } from 'react';
import api from '../api/axios';
import { Lead } from '../types';
import { useDebounce } from '../hooks/useDebounce';
import toast from 'react-hot-toast';

const Dashboard = ({ onLogout }: { onLogout: () => void }) => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  
  // New Stats State
  const [stats, setStats] = useState({ totalLeads: 0, newLeads: 0, qualifiedLeads: 0, lostLeads: 0 });

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  const [formData, setFormData] = useState({
    name: '', email: '', status: 'New', source: 'Website'
  });

  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 500);
  const [statusFilter, setStatusFilter] = useState('');
  const [sourceFilter, setSourceFilter] = useState('');
  const [sortBy, setSortBy] = useState('Latest');

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, statusFilter, sourceFilter, sortBy]);

  // Fetch Stats
  const fetchStats = async () => {
    try {
      const response = await api.get('/leads/stats');
      setStats(response.data.data);
    } catch (error) {
      console.error("Error fetching stats", error);
    }
  };

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        ...(debouncedSearch && { search: debouncedSearch }),
        ...(statusFilter && { status: statusFilter }),
        ...(sourceFilter && { source: sourceFilter }),
        ...(sortBy && { sort: sortBy }),
        page: page.toString(),
      });

      const response = await api.get(`/leads?${queryParams}`);
      setLeads(response.data.data);
      setTotalPages(response.data.pagination.pages || 1);
    } catch (error) {
      console.error("Error fetching leads", error);
    } finally {
      setLoading(false);
    }
  };

  // Run on mount and when filters/page change
  useEffect(() => {
    fetchLeads();
    fetchStats(); // Update stats whenever we fetch leads
  }, [debouncedSearch, statusFilter, sourceFilter, sortBy, page]);

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  try {
    await api.post('/leads', formData);
    setFormData({ name: '', email: '', status: 'New', source: 'Website' });
    fetchLeads(); 
    fetchStats(); 

    // NEW: Fire the success toast!
    toast.success('Lead created successfully!'); 

  } catch (error) {
    // NEW: Fire the error toast instead of an alert!
    toast.error("Failed to add lead. Email might already exist.");
  }
};

  return (
    <div className="min-h-screen bg-[#F9FAFB] p-8 font-sans text-gray-800">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-gray-900">Pipeline Overview</h1>
            <p className="text-gray-500 mt-1 text-sm">Manage and track your customer relationships.</p>
          </div>
          <button 
            onClick={() => {
            onLogout();
            toast('Goodbye!', { icon: '👋' });
          }} 
  className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
>
  Log out
</button>
        </div>

        {/* NEW: Analytics Cards Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-center">
            <p className="text-sm font-medium text-gray-500 mb-1">Total Leads</p>
            <p className="text-3xl font-bold text-gray-900">{stats.totalLeads}</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-blue-100 flex flex-col justify-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
            <p className="text-sm font-medium text-blue-600 mb-1">New Leads</p>
            <p className="text-3xl font-bold text-gray-900">{stats.newLeads}</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-emerald-100 flex flex-col justify-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500"></div>
            <p className="text-sm font-medium text-emerald-600 mb-1">Qualified</p>
            <p className="text-3xl font-bold text-gray-900">{stats.qualifiedLeads}</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-rose-100 flex flex-col justify-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-rose-500"></div>
            <p className="text-sm font-medium text-rose-600 mb-1">Lost</p>
            <p className="text-3xl font-bold text-gray-900">{stats.lostLeads}</p>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 items-center">
          <input 
            type="text" 
            placeholder="Search name or email..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 w-full bg-gray-50 border border-gray-200 text-sm rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500/20"
          />
          <div className="flex gap-3 w-full md:w-auto">
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="bg-gray-50 border border-gray-200 text-sm rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer">
              <option value="">All Statuses</option>
              <option value="New">New</option>
              <option value="Contacted">Contacted</option>
              <option value="Qualified">Qualified</option>
              <option value="Lost">Lost</option>
            </select>
            <select value={sourceFilter} onChange={(e) => setSourceFilter(e.target.value)} className="bg-gray-50 border border-gray-200 text-sm rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer">
              <option value="">All Sources</option>
              <option value="Website">Website</option>
              <option value="Instagram">Instagram</option>
              <option value="Referral">Referral</option>
            </select>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="bg-gray-50 border border-gray-200 text-sm rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer">
              <option value="Latest">Latest</option>
              <option value="Oldest">Oldest</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          
          {/* Add Lead Form */}
          <div className="xl:col-span-1 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-fit">
            <h2 className="text-base font-semibold mb-5">New Lead</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <input required type="text" placeholder="Full Name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full bg-gray-50 border border-gray-200 text-sm rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" />
              </div>
              <div>
                <input required type="email" placeholder="Email Address" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full bg-gray-50 border border-gray-200 text-sm rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <select value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})} className="w-full bg-gray-50 border border-gray-200 text-sm rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer">
                  <option value="New">New</option>
                  <option value="Contacted">Contacted</option>
                  <option value="Qualified">Qualified</option>
                  <option value="Lost">Lost</option>
                </select>
                <select value={formData.source} onChange={(e) => setFormData({...formData, source: e.target.value})} className="w-full bg-gray-50 border border-gray-200 text-sm rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer">
                  <option value="Website">Website</option>
                  <option value="Instagram">Instagram</option>
                  <option value="Referral">Referral</option>
                </select>
              </div>
              <button type="submit" className="w-full bg-gray-900 text-white text-sm py-2.5 rounded-xl hover:bg-gray-800 transition-colors font-medium mt-2">
                Create Lead
              </button>
            </form>
          </div>

          {/* Table & Pagination Container */}
          <div className="xl:col-span-3 flex flex-col gap-4">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              {loading ? (
                <div className="p-12 text-center text-sm text-gray-400">Syncing data...</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-white border-b border-gray-100">
                      <tr>
                        <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Contact</th>
                        <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Source</th>
                        <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Added</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {leads.length === 0 ? (
                        <tr><td colSpan={4} className="p-12 text-center text-sm text-gray-400">No leads match your criteria.</td></tr>
                      ) : (
                        leads.map((lead) => (
                          <tr key={lead._id} className="hover:bg-gray-50/50 transition-colors group">
                            <td className="px-6 py-4">
                              <p className="text-sm font-medium text-gray-900">{lead.name}</p>
                              <p className="text-xs text-gray-400 mt-0.5">{lead.email}</p>
                            </td>
                            <td className="px-6 py-4">
                              <span className={`inline-flex items-center px-2.5 py-1 text-[11px] font-medium rounded-full border
                                ${lead.status === 'New' ? 'bg-blue-50 text-blue-600 border-blue-100' : 
                                  lead.status === 'Qualified' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                                  lead.status === 'Lost' ? 'bg-rose-50 text-rose-600 border-rose-100' : 
                                  'bg-purple-50 text-purple-600 border-purple-100'}`}>
                                <span className={`w-1.5 h-1.5 rounded-full mr-1.5 
                                  ${lead.status === 'New' ? 'bg-blue-500' : lead.status === 'Qualified' ? 'bg-emerald-500' : lead.status === 'Lost' ? 'bg-rose-500' : 'bg-purple-500'}`}></span>
                                {lead.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-500">{lead.source}</td>
                            <td className="px-6 py-4 text-sm text-gray-400">
                              {new Date(lead.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                <button 
                  onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                  disabled={page === 1}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all outline-none focus:ring-2 focus:ring-blue-500/20"
                >
                  Previous
                </button>
                <span className="text-sm text-gray-500">
                  Page <span className="font-semibold text-gray-900">{page}</span> of <span className="font-semibold text-gray-900">{totalPages}</span>
                </span>
                <button 
                  onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={page === totalPages}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all outline-none focus:ring-2 focus:ring-blue-500/20"
                >
                  Next
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;