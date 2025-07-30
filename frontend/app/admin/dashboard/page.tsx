"use client"

import { Card } from "@/components/ui/card";
import { AreaChartComponent } from "@/components/ui/area-chart";
import { theme } from "@/components/ui/theme";
import { Inbox, CheckCircle, XCircle } from "lucide-react";
import { useEffect, useState } from "react";

interface DashboardData {
  dailyStats: {
    dailyRequests: number;
    processed: number;
    rejected: number;
  };
  chartData: Array<{ date: string; demandes: number; traités: number }>;
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/dashboard');
        if (!response.ok) throw new Error('Erreur réseau');
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur inconnue');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (error) {
    return (
      <div className="flex justify-center py-20 text-red-500">
        Erreur: {error}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-slate-100">Tableau de Bord</h1>

      {/* Statistiques journalières ou skeletons */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {loading ? (
          [1, 2, 3].map((key) => (
            <SkeletonCard key={key} />
          ))
        ) : (
          <>
            <StatCard
              title="Demandes Aujourd'hui"
              value={data!.dailyStats.dailyRequests}
              icon={<Inbox className="text-blue-400" />}
            />
            <StatCard
              title="Traités"
              value={data!.dailyStats.processed}
              icon={<CheckCircle className="text-green-400" />}
            />
            <StatCard
              title="Rejetées"
              value={data!.dailyStats.rejected}
              icon={<XCircle className="text-red-400" />}
            />
          </>
        )}
      </div>

      {/* Graphique ou skeleton */}
      <Card className="bg-slate-700 border border-slate-600 p-6">
        <h2 className="text-xl font-semibold text-slate-100 mb-4 flex items-center">
          <span className="w-1.5 h-7 rounded-full bg-blue-400 mr-3" />
          Activité Mensuelle
        </h2>
        {loading ? (
          <div className="h-64 bg-slate-600 rounded animate-pulse" />
        ) : (
          <AreaChartComponent
            data={data!.chartData}
            categories={["traités", "demandes"]}
            index="date"
            colors={[theme.colors.secondary, theme.colors.primary]}
          />
        )}
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

function SkeletonCard() {
  return (
    <Card className="bg-slate-700 border border-slate-600 p-5 flex items-center">
      <div className="bg-slate-600 p-3 rounded-full animate-pulse" />
      <div className="ml-4 w-full">
        <div className="h-4 bg-slate-600 rounded w-1/2 mb-2 animate-pulse" />
        <div className="h-8 bg-slate-600 rounded w-1/4 animate-pulse" />
      </div>
    </Card>
  );
}
