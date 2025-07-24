import { Card } from "@/components/ui/card";
import { AreaChartComponent } from "@/components/ui/area-chart";
import { theme } from "@/components/ui/theme";
import { Inbox, CheckCircle, XCircle } from "lucide-react";

export default function DashboardPage() {
  const stats = { dailyRequests: 42, processed: 38, rejected: 4 };
  const chartData = [
    { date: "2023-06-01", demandes: 40, traités: 38 },
    { date: "2023-06-05", demandes: 65, traités: 60 },
    { date: "2023-06-10", demandes: 50, traités: 47 },
    { date: "2023-06-15", demandes: 75, traités: 68 },
    { date: "2023-06-20", demandes: 60, traités: 56 },
    { date: "2023-06-25", demandes: 80, traités: 74 },
    { date: "2023-06-30", demandes: 70, traités: 65 },
  ];

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-slate-100">Tableau de Bord</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Demandes Aujourd'hui"
          value={stats.dailyRequests}
          icon={<Inbox className="text-blue-400" />}
        />
        <StatCard
          title="Traités"
          value={stats.processed}
          icon={<CheckCircle className="text-green-400" />}
        />
        <StatCard
          title="Rejetées"
          value={stats.rejected}
          icon={<XCircle className="text-red-400" />}
        />
      </div>

      <Card className="bg-slate-700 border border-slate-600 p-6">
        <h2 className="text-xl font-semibold text-slate-100 mb-4 flex items-center">
          <span className="w-1.5 h-7 rounded-full bg-blue-400 mr-3" />
          Activité Mensuelle
        </h2>
        <AreaChartComponent
          data={chartData}
          categories={["traités", "demandes"]}
          index="date"
          colors={[theme.colors.secondary, theme.colors.primary]}
        />
      </Card>
    </div>
  );
}

function StatCard({ title, value, icon }: { title: string; value: number; icon: React.ReactNode }) {
  return (
    <Card className="bg-slate-700 border border-slate-600 p-5 flex items-center transition-transform hover:scale-[1.02] cursor-pointer">
      <div className="bg-slate-600 p-3 rounded-full">{icon}</div>
      <div className="ml-4">
        <h3 className="text-slate-300 text-sm font-medium">{title}</h3>
        <p className="text-2xl font-bold text-slate-100">{value}</p>
      </div>
    </Card>
  );
}
