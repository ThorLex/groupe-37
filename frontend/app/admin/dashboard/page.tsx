/* eslint-disable @typescript-eslint/no-unused-vars */
import { Card } from '@/components/ui/card';
import { AreaChartComponent } from '@/components/ui/area-chart';
import { theme } from '@/components/ui/theme';

export default function DashboardPage() {
  // Statistiques
  const stats = {
    dailyRequests: 42,
    processed: 38,
    rejected: 4
  };

  // Données pour le graphique
  const chartData = [
    { date: '2023-06-01', demandes: 40, traités: 38 },
    { date: '2023-06-05', demandes: 65, traités: 60 },
    { date: '2023-06-10', demandes: 50, traités: 47 },
    { date: '2023-06-15', demandes: 75, traités: 68 },
    { date: '2023-06-20', demandes: 60, traités: 56 },
    { date: '2023-06-25', demandes: 80, traités: 74 },
    { date: '2023-06-30', demandes: 70, traités: 65 },
  ];

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-8">Tableau de Bord Administrateur</h1>
      
      {/* Cartes de statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard 
          title="Demandes Aujourd'hui" 
          value={stats.dailyRequests} 
          icon="Inbox"
          color="bg-blue-100 text-blue-600"
        />
        <StatCard 
          title="Demandes Traitées" 
          value={stats.processed} 
          icon="CheckCircle"
          color="bg-green-100 text-green-600"
        />
        <StatCard 
          title="Demandes Rejetées" 
          value={stats.rejected} 
          icon="XCircle"
          color="bg-red-100 text-red-600"
        />
      </div>

      {/* Graphique Area Chart */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold text-black mb-4">Activité Mensuelle</h2>
        <AreaChartComponent 
          data={chartData}
          categories={['traités', 'demandes']}
          index="date"
          colors={[theme.colors.secondary, theme.colors.primary]}
        />
      </Card>
    </div>
  );
}

// Composant de carte statistique
function StatCard({ title, value, icon, color }: { 
  title: string; 
  value: number;
  icon: string;
  color: string;
}) {
  const IconComponent = ({ name }: { name: string }) => {
    return <div className={`w-10 h-10 rounded-full ${color.split(' ')[0]} flex items-center justify-center`}>
      <span className="text-lg">📥</span>
    </div>;
  };

  return (
    <Card className="p-6 flex items-center">
      <IconComponent name={icon} />
      <div className="ml-4">
        <h3 className="text-gray-500 text-sm">{title}</h3>
        <p className="text-2xl text-black font-bold">{value}</p>
      </div>
    </Card>
  );
}
// app/admin/dashboard/page.tsx
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { AreaChartComponent } from "@/components/ui/area-chart";
// import NavButton from "@/components/macro-element/NavButton";
// import { ArrowUpRight, FileText, CheckCircle2, XCircle } from "lucide-react";

// export default function DashboardPage() {
//   // Statistiques
//   const stats = {
//     dailyRequests: 42,
//     processed: 38,
//     rejected: 4
//   };

//   // Données pour le graphique
//   const chartData = [
//     { date: '2023-06-01', demandes: 40, rejets: 2 },
//     { date: '2023-06-05', demandes: 65, rejets: 5 },
//     { date: '2023-06-10', demandes: 50, rejets: 3 },
//     { date: '2023-06-15', demandes: 75, rejets: 7 },
//     { date: '2023-06-20', demandes: 60, rejets: 4 },
//     { date: '2023-06-25', demandes: 80, rejets: 6 },
//     { date: '2023-06-30', demandes: 70, rejets: 5 },
//   ];

//   return (
//     <div className="space-y-6">
//       <div className="flex justify-between items-center">
//         <h1 className="text-2xl font-bold">Tableau de Bord</h1>
//         <NavButton variant="outline">
//           Télécharger le rapport <ArrowUpRight size={16} className="ml-2" />
//         </NavButton>
//       </div>
      
//       {/* Cartes de statistiques */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//         <StatCard 
//           title="Demandes Aujourd'hui" 
//           value={stats.dailyRequests} 
//           icon={<FileText className="text-blue-500" />}
//           trend="+20% depuis hier"
//         />
//         <StatCard 
//           title="Demandes Traitées" 
//           value={stats.processed} 
//           icon={<CheckCircle2 className="text-green-500" />}
//           trend="90% de taux de traitement"
//         />
//         <StatCard 
//           title="Demandes Rejetées" 
//           value={stats.rejected} 
//           icon={<XCircle className="text-red-500" />}
//           trend="10% de taux de rejet"
//         />
//       </div>

//       {/* Graphique Area Chart */}
//       <Card>
//         <CardHeader>
//           <CardTitle>Activité Mensuelle</CardTitle>
//         </CardHeader>
//         <CardContent className="pt-0">
//           <AreaChartComponent 
//             data={chartData}
//             categories={['demandes', 'rejets']}
//             index="date"
//           />
//         </CardContent>
//       </Card>

//       {/* Dernières demandes */}
//       <Card>
//         <CardHeader>
//           <div className="flex justify-between items-center">
//             <CardTitle>Dernières Demandes</CardTitle>
//             <NavButton variant="language" className="text-blue-600">
//               Voir toutes les demandes
//             </NavButton>
//           </div>
//         </CardHeader>
//         <CardContent>
//           <div className="overflow-x-auto">
//             <table className="min-w-full">
//               <thead>
//                 <tr className="border-b">
//                   <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">ID</th>
//                   <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Nom</th>
//                   <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Date</th>
//                   <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Statut</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {[
//                   { id: 'CNI-001', name: 'Jean Dupont', date: '2023-06-15', status: 'En attente' },
//                   { id: 'CNI-002', name: 'Marie Martin', date: '2023-06-15', status: 'Approuvé' },
//                   { id: 'CNI-003', name: 'Paul Durand', date: '2023-06-14', status: 'Rejeté' },
//                   { id: 'CNI-004', name: 'Sophie Lambert', date: '2023-06-14', status: 'En attente' },
//                 ].map((item) => (
//                   <tr key={item.id} className="border-b hover:bg-gray-50">
//                     <td className="py-3 px-4">{item.id}</td>
//                     <td className="py-3 px-4">{item.name}</td>
//                     <td className="py-3 px-4">{item.date}</td>
//                     <td className="py-3 px-4">
//                       <span className={`px-3 py-1 rounded-full text-xs ${
//                         item.status === 'En attente' ? 'bg-yellow-100 text-yellow-800' : 
//                         item.status === 'Approuvé' ? 'bg-green-100 text-green-800' : 
//                         'bg-red-100 text-red-800'
//                       }`}>
//                         {item.status}
//                       </span>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }

// // Composant de carte statistique
// function StatCard({ title, value, icon, trend }: { 
//   title: string; 
//   value: number;
//   icon: React.ReactNode;
//   trend?: string;
// }) {
//   return (
//     <Card className="hover:shadow-md transition-shadow">
//       <CardHeader className="flex flex-row items-center justify-between pb-4">
//         <CardTitle className="text-sm font-medium">{title}</CardTitle>
//         <div className="p-2 bg-gray-100 rounded-lg">
//           {icon}
//         </div>
//       </CardHeader>
//       <CardContent>
//         <div className="text-2xl font-bold">{value}</div>
//         {trend && (
//           <p className="text-xs text-gray-500 mt-2">
//             {trend}
//           </p>
//         )}
//       </CardContent>
//     </Card>
//   );
// }