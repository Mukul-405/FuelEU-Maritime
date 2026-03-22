import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const dummyData = [
  { name: 'Route Alpha', emission: 4200, compliance: 2400 },
  { name: 'Route Beta', emission: 3100, compliance: -1398 },
  { name: 'Route Gamma', emission: 2800, compliance: 9800 },
  { name: 'Route Delta', emission: 2980, compliance: 3908 },
];

export const ComparePage = () => {
  return (
    <div className="flex flex-col gap-6 h-full">
      <h1 className="text-3xl font-extrabold text-white">Compare Routes</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-neutral-800 border border-neutral-700 rounded-2xl p-6 shadow-xl flex flex-col items-center justify-center min-h-[150px]">
              <div className="text-neutral-400 text-sm font-medium uppercase tracking-wider mb-2">Total Fleet Balance</div>
              <div className="text-4xl font-black text-emerald-400 text-shadow-sm">+14,710</div>
          </div>
          <div className="bg-neutral-800 border border-neutral-700 rounded-2xl p-6 shadow-xl flex flex-col items-center justify-center min-h-[150px]">
              <div className="text-neutral-400 text-sm font-medium uppercase tracking-wider mb-2">Highest Emission Route</div>
              <div className="text-4xl font-black text-rose-400 text-shadow-sm">Route Alpha</div>
          </div>
      </div>

      <div className="bg-neutral-800 border border-neutral-700 rounded-2xl p-6 shadow-xl flex-1 min-h-[400px]">
        <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <span className="w-2 h-6 bg-blue-500 rounded-full inline-block"></span>
            Emissions vs Compliance Balance
        </h2>
        <div className="h-[90%] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dummyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#404040" vertical={false} />
              <XAxis dataKey="name" stroke="#a3a3a3" axisLine={false} tickLine={false} />
              <YAxis stroke="#a3a3a3" axisLine={false} tickLine={false} />
              <Tooltip cursor={{fill: '#262626'}} contentStyle={{ backgroundColor: '#171717', borderColor: '#404040', color: '#fff', borderRadius: '8px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)' }} />
              <Legend wrapperStyle={{ color: '#d4d4d4', paddingTop: '20px' }} iconType="circle" />
              <Bar dataKey="emission" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Emissions (tCO2)" />
              <Bar dataKey="compliance" fill="#10b981" radius={[4, 4, 0, 0]} name="Compliance Balance" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
