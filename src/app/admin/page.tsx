export default function AdminDashboardPage() {
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold font-heading">Dashboard Overview</h1>
            <p className="text-slate-400">Welcome back. Here is what's happening today.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: "Ideas to Review", value: "12", color: "text-amber-400" },
                    { label: "Active Bugs", value: "5", color: "text-rose-400" },
                    { label: "Roadmap Tasks", value: "8", color: "text-emerald-400" },
                    { label: "Blog Posts", value: "24", color: "text-blue-400" },
                ].map((stat) => (
                    <div key={stat.label} className="p-6 rounded-2xl bg-white/5 border border-white/10">
                        <p className="text-sm text-slate-500 font-medium uppercase tracking-wider">{stat.label}</p>
                        <p className={`text-4xl font-bold mt-2 ${stat.color}`}>{stat.value}</p>
                    </div>
                ))}
            </div>

            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 border-l-4 border-l-emerald-500">
                <h3 className="text-lg font-bold text-white mb-2">🚀 Quick Actions</h3>
                <div className="flex gap-4">
                    <button className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded-lg text-sm transition-colors">
                        Create Roadmap Task
                    </button>
                    <button className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-medium rounded-lg text-sm transition-colors border border-white/10">
                        Draft Changelog Release
                    </button>
                </div>
            </div>
        </div>
    );
}
