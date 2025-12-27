import React, { useState, useMemo } from 'react';
import { 
  LayoutDashboard, 
  Activity, 
  Calendar, 
  Users, 
  Flag, 
  Settings, 
  LogOut, 
  Plus, 
  Trash2, 
  RefreshCw,
  Database,
  BarChart2,
  Menu,
  Check,
  Trophy,
  MapPin,
  Clock,
  ArrowRight,
  X
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer
} from 'recharts';

// --- Constants & Config ---

// High-Accuracy Livery Colors (Matches provided HTML)
const TEAM_COLORS = {
  "red-bull-racing": "#3671C6", 
  "ferrari": "#E80020",
  "mercedes": "#27F4D2",
  "mclaren": "#FF8000",
  "aston-martin": "#229971",
  "alpine": "#0093CC",
  "williams": "#64C4FF",
  "racing-bulls": "#1634CB",
  "kick-sauber": "#52E252",
  "haas": "#B6BABD",
  "reserve": "#666666"
};

const TEAMS = [
  {id:'red-bull-racing', name:'Red Bull Racing'}, 
  {id:'ferrari', name:'Ferrari'}, 
  {id:'mercedes', name:'Mercedes-AMG'},
  {id:'mclaren', name:'McLaren'}, 
  {id:'aston-martin', name:'Aston Martin'}, 
  {id:'alpine', name:'Alpine'},
  {id:'williams', name:'Williams'}, 
  {id:'racing-bulls', name:'Visa Cash App RB'}, 
  {id:'kick-sauber', name:'Kick Sauber'},
  {id:'haas', name:'Haas F1 Team'}, 
  {id:'reserve', name:'Reserve Driver'}
];

const getTeamColor = (teamId) => {
  if (!teamId) return TEAM_COLORS["reserve"];
  if (TEAM_COLORS[teamId]) return TEAM_COLORS[teamId];
  const foundTeam = TEAMS.find(t => t.name.toLowerCase() === teamId.toLowerCase() || t.id === teamId);
  return foundTeam && TEAM_COLORS[foundTeam.id] ? TEAM_COLORS[foundTeam.id] : TEAM_COLORS["reserve"];
};

const getTeamName = (teamId) => {
  const found = TEAMS.find(t => t.id === teamId || t.name.toLowerCase() === teamId.toLowerCase());
  return found ? found.name : teamId;
}

// --- Mock Data ---
const INITIAL_TRACKS = [
  { id: 'bahrain', name: 'Bahrain GP', date: '2024-03-02', weather: 'Dry' },
  { id: 'saudi', name: 'Saudi Arabian GP', date: '2024-03-09', weather: 'Dry' },
  { id: 'australia', name: 'Australian GP', date: '2024-03-24', weather: 'Dry' },
  { id: 'japan', name: 'Japanese GP', date: '2024-04-07', weather: 'Wet' },
];

const INITIAL_DRIVERS = [
  { 
    id: 'd1', name: 'Max Verstappen', team: 'red-bull-racing', 
    results: { 'bahrain': { pos: 1, pts: 25 }, 'saudi': { pos: 1, pts: 25 }, 'australia': { pos: "DNF", pts: 0 } } 
  },
  { 
    id: 'd2', name: 'Charles Leclerc', team: 'ferrari', 
    results: { 'bahrain': { pos: 4, pts: 12 }, 'saudi': { pos: 3, pts: 15 }, 'australia': { pos: 2, pts: 18 } } 
  },
  { 
    id: 'd3', name: 'Carlos Sainz', team: 'ferrari', 
    results: { 'bahrain': { pos: 3, pts: 15 }, 'australia': { pos: 1, pts: 25 } } 
  },
  { 
    id: 'd4', name: 'Lando Norris', team: 'mclaren', 
    results: { 'bahrain': { pos: 6, pts: 8 }, 'saudi': { pos: 8, pts: 4 }, 'australia': { pos: 3, pts: 15 } } 
  },
];

// --- Components ---

const Sidebar = ({ currentView, setView, isMobileOpen, setIsMobileOpen }) => {
  const menuGroups = [
    {
      title: 'OVERVIEW',
      items: [
        { id: 'dashboard', label: 'DASHBOARD', icon: LayoutDashboard },
        { id: 'telemetry', label: 'LIVE TELEMETRY', icon: Activity },
        { id: 'analytics', label: 'ANALYTICS', icon: BarChart2 },
      ]
    },
    {
      title: 'OPERATIONS',
      items: [
        { id: 'calendar', label: 'CALENDAR EDITOR', icon: Calendar },
        { id: 'onboard', label: 'DRIVER ONBOARD', icon: Users },
        { id: 'driver_edit', label: 'DRIVER EDITOR', icon: Settings },
        { id: 'race_edit', label: 'RACE EDITOR', icon: Flag },
      ]
    }
  ];

  return (
    <>
      <div className={`sidebar ${isMobileOpen ? 'open' : ''}`}>
        <div className="logo-area">
          <div className="h-8 w-8 bg-cyan-500 rounded flex items-center justify-center font-bold text-white shadow-lg shadow-cyan-900/50">T</div>
          <div className="logo-text">PITWALL</div>
          {isMobileOpen && (
             <button onClick={() => setIsMobileOpen(false)} className="ml-auto text-slate-500 md:hidden">
                <X size={24} />
             </button>
          )}
        </div>
        
        <div className="nav-links">
          {menuGroups.map((group, idx) => (
            <div key={idx} className="mb-6">
              <div className="nav-group-label">{group.title}</div>
              <div className="space-y-1">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentView === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setView(item.id);
                        setIsMobileOpen(false);
                      }}
                      className={`nav-btn ${isActive ? 'active' : ''}`}
                    >
                      <Icon size={18} />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="user-panel">
          <div className="user-panel-row">
            <div className="user-name">OPERATOR</div>
            <div className="user-role">ADMIN</div>
          </div>
          <button className="btn btn-danger w-full justify-center text-xs">
            <LogOut size={14} /> <span>DISCONNECT</span>
          </button>
        </div>
      </div>
      
      {/* Overlay for mobile */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}
    </>
  );
};

const TopBar = ({ season, setSeason, toggleSidebar }) => {
  return (
    <header className="top-bar">
      <div className="flex items-center gap-4">
        <button className="toggle-sidebar md:hidden text-slate-500 hover:text-cyan-600 transition-colors" onClick={toggleSidebar}>
          <Menu size={24} />
        </button>
        <div className="season-control">
          <span className="season-label">ACTIVE SEASON:</span>
          <input 
            type="text" 
            value={season}
            onChange={(e) => setSeason(e.target.value)}
            className="season-input"
          />
          <button className="icon-btn border-none hover:bg-transparent hover:text-cyan-600">
            <RefreshCw size={14} />
          </button>
        </div>
      </div>

      <div className="action-cluster">
        <button className="btn"><Database size={14} /> MIGRATE</button>
        <button className="btn"><RefreshCw size={14} /> IMPORT CSV</button>
      </div>
    </header>
  );
};

// --- View Components ---

const Dashboard = ({ drivers, tracks }) => {
  const activeGrid = drivers.length;
  const scheduledRaces = tracks.length;
  const completedRaces = tracks.filter(t => new Date(t.date) < new Date()).length;
  const progress = scheduledRaces > 0 ? Math.round((completedRaces / scheduledRaces) * 100) : 0;
  
  const getStats = () => {
    if(drivers.length === 0) return { leader: { name: "N/A", pts: 0 }, topTeam: { name: "N/A", pts: 0 } };
    
    const driversSorted = [...drivers].map(d => ({
        ...d,
        total: Object.values(d.results).reduce((acc, curr) => acc + (curr.pts || 0), 0)
    })).sort((a,b) => b.total - a.total);
    const leader = driversSorted[0];

    const teams = {};
    drivers.forEach(d => {
        Object.values(d.results).forEach(r => {
            const t = r.team || d.team; 
            if(!teams[t]) teams[t] = 0;
            teams[t] += (r.pts || 0);
        });
    });
    const topTeamKey = Object.keys(teams).sort((a,b) => teams[b] - teams[a])[0];
    const topTeam = { name: getTeamName(topTeamKey), pts: teams[topTeamKey] || 0 };

    return { leader: { name: leader.name, pts: leader.total }, topTeam };
  };

  const { leader, topTeam } = getStats();

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex justify-between items-center">
        <div>
           <h2 className="text-2xl font-display font-extrabold text-slate-800">MISSION OVERVIEW</h2>
           <div className="text-sm font-ui text-slate-500 font-semibold">SEASON ACTIVE</div>
        </div>
      </div>

      <div className="dashboard-grid-full">
        <div className="stat-card card-accent-blue">
          <Users className="stat-icon" />
          <div className="stat-label">GRID SIZE</div>
          <div className="stat-value">{activeGrid}</div>
          <div className="stat-footer text-emerald-600"><Check size={14} /> Active Drivers</div>
        </div>
        <div className="stat-card card-accent-green">
          <MapPin className="stat-icon" />
          <div className="stat-label">CALENDAR</div>
          <div className="stat-value">{scheduledRaces}</div>
          <div className="stat-footer text-slate-500"><Flag size={14} /> Scheduled Races</div>
        </div>
        <div className="stat-card card-accent-purple">
          <Trophy className="stat-icon" />
          <div className="stat-label">LEADER</div>
          <div className="stat-value text-xl truncate">{leader.name}</div>
          <div className="stat-footer text-purple-600 font-bold">{leader.pts} PTS</div>
        </div>
        <div className="stat-card card-accent-red">
          <Settings className="stat-icon" />
          <div className="stat-label">TOP TEAM</div>
          <div className="stat-value text-xl truncate">{topTeam.name}</div>
          <div className="stat-footer text-red-600 font-bold">{topTeam.pts} PTS</div>
        </div>
      </div>

      <div className="dashboard-grid-full grid-cols-1 md:grid-cols-3">
         <div className="stat-card border-l-4 border-amber-400 pl-6">
            <div className="flex items-center gap-4">
                <div className="text-4xl text-amber-400"><Clock size={40} /></div>
                <div>
                    <div className="stat-label mb-0">FASTEST LAP</div>
                    <div className="text-xl font-bold text-slate-800">1:29.123</div>
                </div>
            </div>
         </div>
         <div className="stat-card border-l-4 border-cyan-500 pl-6">
            <div className="flex items-center gap-4">
                <div className="text-4xl text-cyan-500"><Activity size={40} /></div>
                <div>
                    <div className="stat-label mb-0">CONDITIONS</div>
                    <div className="text-xl font-bold text-slate-800">DRY</div>
                </div>
            </div>
         </div>
         <div className="stat-card border-l-4 border-emerald-500 pl-6">
            <div className="flex items-center gap-4">
                <div className="text-4xl text-emerald-500"><Flag size={40} /></div>
                <div>
                    <div className="stat-label mb-0">STATUS</div>
                    <div className="text-xl font-bold text-slate-800">GREEN</div>
                </div>
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="panel col-span-2 min-h-[400px]">
           <div className="panel-header">
              <div className="panel-title"><Calendar size={18} /> SEASON PROGRESS</div>
           </div>
           <div className="panel-body">
              <div className="flex justify-between items-end mb-3">
                 <div className="stat-value text-5xl">{progress}%</div>
                 <div className="stat-footer text-lg">{completedRaces} / {scheduledRaces} RACES</div>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-3 mb-8 overflow-hidden">
                 <div className="bg-emerald-500 h-3 rounded-full transition-all duration-1000" style={{width: `${progress}%`}}></div>
              </div>
              
              <div className="panel-title mb-4 text-sm text-slate-400">SCHEDULE</div>
              <div className="overflow-y-auto max-h-[300px] pr-2 custom-scrollbar">
                 {tracks.map((t, i) => {
                    const isComplete = new Date(t.date) < new Date();
                    return (
                        <div key={t.id} className="flex justify-between items-center py-3 border-b border-slate-100 last:border-0 hover:bg-slate-50 px-2 rounded transition-colors group">
                            <div className="flex items-center gap-3">
                                <span className="font-mono text-slate-400 text-sm font-bold">R{String(i+1).padStart(2, '0')}</span>
                                <span className={`font-bold ${isComplete ? 'text-emerald-600 line-through opacity-70' : 'text-slate-800'}`}>{t.name}</span>
                            </div>
                            <div className="text-xs font-mono text-slate-500 flex items-center gap-2 font-bold">
                                {t.date}
                                {isComplete && <Check size={14} className="text-emerald-500" />}
                            </div>
                        </div>
                    )
                 })}
              </div>
           </div>
        </div>

        <div className="flex flex-col gap-6">
           <div className="stat-card bg-slate-900 text-white border-none shadow-lg">
              <div className="stat-label text-slate-400">NEXT EVENT</div>
              <div className="stat-value text-white">JAPAN</div>
              <div className="stat-footer text-cyan-400 font-bold">Coming Up</div>
           </div>
           <div className="stat-card bg-white border border-slate-200 shadow-sm">
              <div className="stat-label">LATEST VICTOR</div>
              <div className="stat-value text-2xl truncate">CARLOS SAINZ</div>
              <div className="stat-footer text-slate-400 font-bold">AUSTRALIAN GP</div>
           </div>
        </div>
      </div>
    </div>
  );
};

const Telemetry = ({ drivers }) => {
  const standings = useMemo(() => {
    return drivers.map(d => {
      const total = Object.values(d.results).reduce((acc, curr) => acc + (curr.pts || 0), 0);
      return { ...d, total };
    }).sort((a, b) => b.total - a.total);
  }, [drivers]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in">
       <div className="panel">
          <div className="panel-header">
             <div className="panel-title text-cyan-600"><Trophy size={18} /> DRIVERS CHAMPIONSHIP</div>
          </div>
          <div className="panel-body p-0 overflow-x-auto">
             <table className="tech-table w-full">
                <thead>
                   <tr>
                      <th className="w-16">POS</th>
                      <th>DRIVER</th>
                      <th className="text-right">PTS</th>
                   </tr>
                </thead>
                <tbody>
                   {standings.map((d, i) => (
                      <tr key={d.id}>
                         <td className="font-bold text-slate-400 text-center">{String(i + 1).padStart(2, '0')}</td>
                         <td>
                            <div className="font-bold text-slate-800">{d.name}</div>
                            <div className="text-xs font-bold uppercase" style={{color: getTeamColor(d.team)}}>{getTeamName(d.team)}</div>
                         </td>
                         <td className="text-right font-mono font-bold text-cyan-600 text-lg">{d.total}</td>
                      </tr>
                   ))}
                </tbody>
             </table>
          </div>
       </div>
       
       <div className="panel">
          <div className="panel-header">
             <div className="panel-title text-red-500"><Settings size={18} /> CONSTRUCTORS</div>
          </div>
          <div className="panel-body p-0">
             <div className="p-12 text-center text-slate-400 italic font-medium">
                Constructors data aggregation active...
             </div>
          </div>
       </div>
    </div>
  );
};

const Analytics = ({ drivers, tracks }) => {
    const [selectedId, setSelectedId] = useState(drivers[0]?.id);
    const driver = drivers.find(d => d.id === selectedId);

    const chartData = useMemo(() => {
        if(!driver) return [];
        let cum = 0;
        return tracks.map((t) => {
            const res = driver.results[t.id];
            const pts = res ? (res.pts || 0) : 0;
            cum += pts;
            return { name: t.id.substring(0,3).toUpperCase(), pts, total: cum };
        });
    }, [driver, tracks]);

    return (
        <div className="animate-fade-in space-y-6">
            <div className="panel">
                <div className="panel-header">
                    <div className="panel-title"><BarChart2 size={18}/> PERFORMANCE ANALYTICS</div>
                </div>
                <div className="panel-body">
                    <div className="max-w-md mb-8">
                        <label className="input-label">SELECT DRIVER</label>
                        <select className="form-control" value={selectedId} onChange={e => setSelectedId(e.target.value)}>
                            {drivers.map(d => <option key={d.id} value={d.id}>{d.name.toUpperCase()}</option>)}
                        </select>
                    </div>

                    {driver && (
                        <>
                            <div className="flex flex-col md:flex-row justify-between md:items-end mb-8 gap-4">
                                <div>
                                    <h1 className="font-display font-extrabold text-4xl text-slate-800 m-0">{driver.name.toUpperCase()}</h1>
                                    <div className="font-data font-semibold text-cyan-600 uppercase mt-1">{getTeamName(driver.team)}</div>
                                </div>
                                <div className="stat-value text-amber-400">
                                    {Object.values(driver.results).reduce((a,b) => a+(b.pts||0),0)} <span className="text-lg text-slate-400 font-bold">PTS</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                                <div className="panel mb-0 min-h-[350px] shadow-none border border-slate-200">
                                    <div className="panel-header bg-slate-50 py-3"><div className="panel-title text-xs text-slate-500">CUMULATIVE POINTS</div></div>
                                    <div className="h-[300px] w-full p-4">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <LineChart data={chartData}>
                                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                                                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                                                <Tooltip contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                                                <Line type="monotone" dataKey="total" stroke="#2563eb" strokeWidth={3} dot={{r:4, fill: '#2563eb', strokeWidth: 2, stroke: '#fff'}} />
                                            </LineChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                                <div className="panel mb-0 min-h-[350px] shadow-none border border-slate-200">
                                    <div className="panel-header bg-slate-50 py-3"><div className="panel-title text-xs text-slate-500">RACE RESULTS</div></div>
                                    <div className="h-[300px] w-full p-4">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={chartData}>
                                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                                                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                                                <Tooltip cursor={{fill: 'transparent'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                                                <Bar dataKey="pts" fill="#ef4444" radius={[4,4,0,0]} />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

// --- Operations ---

const CalendarEditor = ({ tracks, setTracks }) => {
    const [newTrack, setNewTrack] = useState({ name: '', date: '', weather: 'Dry' });

    const addTrack = () => {
        if(!newTrack.name || !newTrack.date) return;
        setTracks([...tracks, { ...newTrack, id: `t${Date.now()}` }]);
        setNewTrack({ name: '', date: '', weather: 'Dry' });
    }

    const removeTrack = (id) => setTracks(tracks.filter(t => t.id !== id));

    return (
        <div className="animate-fade-in panel h-[calc(100%-2rem)] flex flex-col">
            <div className="panel-header">
                <div className="panel-title"><Calendar size={18} /> CALENDAR EDITOR</div>
                <button className="btn btn-danger text-xs"><Trash2 size={14} /> DELETE ALL</button>
            </div>
            <div className="panel-body flex-1 overflow-hidden flex flex-col">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end mb-6">
                    <div className="md:col-span-2">
                        <label className="input-label">CIRCUIT NAME</label>
                        <input className="form-control" value={newTrack.name} onChange={e => setNewTrack({...newTrack, name: e.target.value})} placeholder="e.g. Monaco GP" />
                    </div>
                    <div>
                        <label className="input-label">DATE</label>
                        <input type="date" className="form-control" value={newTrack.date} onChange={e => setNewTrack({...newTrack, date: e.target.value})} />
                    </div>
                    <button className="btn btn-primary h-[42px] justify-center" onClick={addTrack}><Plus size={18} /></button>
                </div>

                <div className="overflow-y-auto space-y-3 pr-2 custom-scrollbar flex-1">
                    {tracks.map(t => (
                        <div key={t.id} className="bg-white border border-slate-200 p-4 rounded-lg flex justify-between items-center shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex items-center gap-3">
                                <div className="h-8 w-8 bg-slate-100 rounded flex items-center justify-center text-slate-400 font-bold">
                                    <MapPin size={16} />
                                </div>
                                <span className="font-bold text-slate-800">{t.name}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-mono text-slate-500 font-bold">{t.date}</span>
                                <button className="icon-btn hover:text-red-500 hover:bg-red-50" onClick={() => removeTrack(t.id)}><Trash2 size={14} /></button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const DriverOnboard = ({ drivers, setDrivers }) => {
    const [name, setName] = useState('');
    const [team, setTeam] = useState(TEAMS[0].id);

    const addDriver = () => {
        if(!name) return;
        setDrivers([...drivers, { id: `d${Date.now()}`, name, team, results: {} }]);
        setName('');
    }

    return (
        <div className="animate-fade-in panel">
            <div className="panel-header">
                <div className="panel-title"><Users size={18} /> DRIVER ONBOARDING</div>
            </div>
            <div className="panel-body">
                <div className="flex flex-col md:flex-row gap-4 mb-8">
                    <div className="flex-1">
                        <label className="input-label">NAME</label>
                        <input className="form-control" placeholder="Driver Name" value={name} onChange={e => setName(e.target.value)} />
                    </div>
                    <div className="flex-1">
                         <label className="input-label">TEAM</label>
                         <select className="form-control" value={team} onChange={e => setTeam(e.target.value)}>
                            {TEAMS.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                        </select>
                    </div>
                    <div className="flex items-end">
                        <button className="btn btn-primary h-[42px] px-6" onClick={addDriver}>ADD</button>
                    </div>
                </div>

                <div className="data-grid">
                    {drivers.map(d => (
                        <div key={d.id} className="driver-card" style={{'--team-color': getTeamColor(d.team)}}>
                            <div className="driver-info">
                                <h4>{d.name}</h4>
                                <p>{getTeamName(d.team)}</p>
                            </div>
                            <button className="icon-btn delete" onClick={() => setDrivers(drivers.filter(x => x.id !== d.id))}>
                                <Trash2 size={14} />
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const DriverEditor = ({ drivers, setDrivers, tracks }) => {
    const [selectedId, setSelectedId] = useState(null);
    const driver = drivers.find(d => d.id === selectedId);

    const updateResult = (trackId, field, val) => {
        setDrivers(drivers.map(d => {
            if(d.id === selectedId) {
                const res = d.results[trackId] || {};
                return { ...d, results: { ...d.results, [trackId]: { ...res, [field]: val } } };
            }
            return d;
        }));
    };

    if (selectedId) {
        return (
            <div className="animate-fade-in panel h-[calc(100%-1rem)] flex flex-col">
                <div className="panel-header sticky top-0 z-10">
                    <div className="panel-title flex items-center gap-2">
                        <button onClick={() => setSelectedId(null)} className="icon-btn w-8 h-8"><ArrowRight className="rotate-180" size={14}/></button>
                        EDITING: <span className="text-cyan-600">{driver.name.toUpperCase()}</span>
                    </div>
                </div>
                <div className="panel-body flex-1 overflow-y-auto custom-scrollbar">
                    <div className="data-grid">
                        {tracks.map(t => {
                            const res = driver.results[t.id] || {};
                            const currentTeam = res.team || driver.team;
                            const color = getTeamColor(currentTeam);
                            
                            return (
                                <div key={t.id} className="bg-white border border-slate-200 rounded-lg p-4 relative overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                                    <div className="absolute left-0 top-0 bottom-0 w-2" style={{background: color}}></div>
                                    <div className="pl-4">
                                        <label className="input-label mb-2 text-slate-700">{t.name}</label>
                                        <div className="flex gap-2">
                                            <input 
                                                className="form-control text-center font-bold w-16" 
                                                placeholder="POS" 
                                                value={res.pos || ''}
                                                onChange={e => updateResult(t.id, 'pos', e.target.value)}
                                            />
                                            <input 
                                                className="form-control text-center font-bold text-cyan-600 w-20" 
                                                placeholder="PTS" 
                                                type="number"
                                                value={res.pts || ''}
                                                onChange={e => updateResult(t.id, 'pts', parseInt(e.target.value) || 0)}
                                            />
                                            <select 
                                                className="form-control text-xs flex-1 font-semibold"
                                                value={currentTeam}
                                                onChange={e => updateResult(t.id, 'team', e.target.value)}
                                            >
                                                {TEAMS.map(tm => <option key={tm.id} value={tm.id}>{tm.name}</option>)}
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="animate-fade-in panel">
            <div className="panel-header"><div className="panel-title"><Settings size={18}/> INDIVIDUAL ADJUSTMENT</div></div>
            <div className="panel-body">
                <div className="data-grid">
                    {drivers.map(d => (
                        <div 
                            key={d.id} 
                            className="driver-card cursor-pointer hover:bg-slate-50" 
                            style={{'--team-color': getTeamColor(d.team)}}
                            onClick={() => setSelectedId(d.id)}
                        >
                            <div className="driver-info">
                                <h4>{d.name}</h4>
                                <p>{getTeamName(d.team)}</p>
                            </div>
                            <div className="font-display font-extrabold text-xl text-cyan-600">
                                {Object.values(d.results).reduce((a,b) => a+(b.pts||0),0)} PTS
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const RaceEditor = ({ drivers, setDrivers, tracks }) => {
    const [trackId, setTrackId] = useState(tracks[0]?.id);
    
    const updateBatch = (driverId, field, val) => {
        setDrivers(drivers.map(d => {
            if(d.id === driverId) {
                const res = d.results[trackId] || {};
                return { ...d, results: { ...d.results, [trackId]: { ...res, [field]: val } } };
            }
            return d;
        }));
    };

    return (
        <div className="animate-fade-in panel">
            <div className="panel-header"><div className="panel-title"><Flag size={18}/> RACE EDITOR</div></div>
            <div className="panel-body">
                <div className="max-w-md mb-8">
                    <label className="input-label">SELECT EVENT</label>
                    <select className="form-control font-bold" value={trackId} onChange={e => setTrackId(e.target.value)}>
                        {tracks.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                    </select>
                </div>

                <div className="data-grid">
                    {drivers.map(d => {
                        const res = d.results[trackId] || {};
                        const team = res.team || d.team;
                        return (
                            <div key={d.id} className="driver-card" style={{'--team-color': getTeamColor(team)}}>
                                <div className="driver-info">
                                    <h4>{d.name}</h4>
                                    <p>{getTeamName(team)}</p>
                                </div>
                                <div className="flex gap-2 relative z-10">
                                    <input 
                                        className="form-control w-16 text-center font-bold" 
                                        placeholder="POS"
                                        value={res.pos || ''}
                                        onChange={e => updateBatch(d.id, 'pos', e.target.value)} 
                                    />
                                    <input 
                                        className="form-control w-20 text-center font-bold text-cyan-600" 
                                        placeholder="PTS"
                                        type="number"
                                        value={res.pts || ''}
                                        onChange={e => updateBatch(d.id, 'pts', parseInt(e.target.value)||0)} 
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

// --- Login ---

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');

  return (
    <div className="fixed inset-0 bg-slate-100 flex items-center justify-center bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] bg-[length:24px_24px]">
      <div className="bg-white p-12 rounded-xl shadow-lg border border-slate-200 border-t-4 border-t-cyan-500 w-[420px] text-center">
        <div className="h-12 w-12 bg-cyan-500 rounded mx-auto mb-4 flex items-center justify-center text-white font-bold text-2xl shadow-lg shadow-cyan-200">T</div>
        <h2 className="font-display text-2xl font-extrabold text-slate-800 mb-2">PITWALL ACCESS</h2>
        <p className="text-slate-500 text-sm font-medium mb-8">Secure Management Console</p>
        
        <button onClick={() => onLogin({email: 'google@ttrl.com'})} className="btn btn-primary w-full justify-center mb-6 py-3 text-base shadow-lg shadow-cyan-100">
           AUTHENTICATE WITH GOOGLE
        </button>
        
        <div className="flex items-center gap-3 my-6">
           <div className="h-px bg-slate-200 flex-1"></div>
           <span className="text-xs font-bold text-slate-400">OR MANUAL LOGIN</span>
           <div className="h-px bg-slate-200 flex-1"></div>
        </div>

        <input 
            className="form-control mb-3 text-center" 
            placeholder="Operator ID"
            value={email}
            onChange={e => setEmail(e.target.value)} 
        />
        <input 
            type="password"
            className="form-control mb-6 text-center" 
            placeholder="Access Key"
            value={pass}
            onChange={e => setPass(e.target.value)} 
        />
        
        <button onClick={() => onLogin({email})} className="btn w-full justify-center border-slate-300 text-slate-800 hover:bg-slate-50 py-3">
            INITIALIZE CONNECTION
        </button>
      </div>
    </div>
  );
};

// --- Main App ---

const App = () => {
  const [user, setUser] = useState(null);
  const [view, setView] = useState('dashboard');
  const [season, setSeason] = useState('season_8');
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  
  // Data State
  const [drivers, setDrivers] = useState(INITIAL_DRIVERS);
  const [tracks, setTracks] = useState(INITIAL_TRACKS);

  if (!user) return <Login onLogin={setUser} />;

  const renderContent = () => {
    switch(view) {
      case 'dashboard': return <Dashboard drivers={drivers} tracks={tracks} />;
      case 'telemetry': return <Telemetry drivers={drivers} />;
      case 'analytics': return <Analytics drivers={drivers} tracks={tracks} />;
      case 'calendar': return <CalendarEditor tracks={tracks} setTracks={setTracks} />;
      case 'onboard': return <DriverOnboard drivers={drivers} setDrivers={setDrivers} />;
      case 'driver_edit': return <DriverEditor drivers={drivers} setDrivers={setDrivers} tracks={tracks} />;
      case 'race_edit': return <RaceEditor drivers={drivers} setDrivers={setDrivers} tracks={tracks} />;
      default: return <Dashboard drivers={drivers} tracks={tracks} />;
    }
  };

  return (
    <div className="app-layout">
       {/* Injecting Fonts & Styles directly for self-contained file requirement */}
       <style>{`
         @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Manrope:wght@500;700;800&family=JetBrains+Mono:wght@500;700&display=swap');
       `}</style>
       
       <Sidebar 
         currentView={view} 
         setView={setView} 
         isMobileOpen={isMobileOpen}
         setIsMobileOpen={setIsMobileOpen} 
       />
       
       <div className="main-wrapper">
          <TopBar 
            season={season} 
            setSeason={setSeason} 
            toggleSidebar={() => setIsMobileOpen(!isMobileOpen)} 
          />
          <main className="workspace">
             {renderContent()}
          </main>
       </div>
    </div>
  );
};

export default App;
