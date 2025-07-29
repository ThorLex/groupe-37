// "use client";

// import { useState, useMemo, useCallback } from "react";
// import { format } from "date-fns";
// import { fr } from "date-fns/locale";
// import { Skeleton } from "@/components/ui/skeleton";
// import { useRequests } from "@/utils/useRequests"; 
// import { SearchBar } from "@/components/macro-element/SearchBarAdmin"; 
// import { StatusFilter } from "@/components/macro-element/StatusFilter"; 
// import { DatePicker } from "@/components/macro-element/DatePicker";
// import { RequestTable } from "@/components/macro-element/RequestTable";
// import { RequestDetails } from "@/components/macro-element/RequestDetails"; 
// import { EmptyState } from "@/components/macro-element/EmptyState";
// import { Request } from "@/utils/types";

// export default function RequestPage() {
//   const [selectedDate, setSelectedDate] = useState(new Date());
//   const [search, setSearch] = useState("");
//   const [filter, setFilter] = useState("all");
//   const [selectedReq, setSelectedReq] = useState<Request | null>(null);

//   const { data: requests, loading } = useRequests(selectedDate);

//   const filtered = useMemo(
//     () =>
//       requests.filter((r) => {
//         const txt = r.fullName.toLowerCase().includes(search.toLowerCase()) ||
//                     r.cinNumber.includes(search);
//         const st = filter === "all" || r.status === filter;
//         return txt && st;
//       }),
//     [requests, search, filter]
//   );

//   const handleSelect = useCallback((r: Request) => setSelectedReq(r), []);

//   return (
//     <div className="p-6 bg-slate-800">
//       <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
//         <div>
//           <h1 className="text-2xl font-bold text-slate-100">
//             Gestion des Demandes
//           </h1>
//           <p className="text-slate-400">
//             pour le {format(selectedDate, "dd MMMM yyyy", { locale: fr })}
//           </p>
//         </div>
//         <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
//           <SearchBar value={search} onChange={setSearch} />
//           <div className="flex gap-2">
//             <StatusFilter value={filter} onChange={setFilter} />
//             <DatePicker
//               date={selectedDate}
//               onChange={(d) => {
//                 if (d) setSelectedDate(d);
//               }}
//             />
//           </div>
//         </div>
//       </div>

//       {loading ? (
//         <div className="space-y-4">
//           {Array.from({ length: 4 }).map((_, i) => (
//             <Skeleton key={i} className="h-16 rounded-lg bg-slate-700" />
//           ))}
//         </div>
//       ) : filtered.length === 0 ? (
//         <EmptyState type="no-results" />
//       ) : (
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//           <div className="lg:col-span-2">
//             <RequestTable
//               requests={filtered}
//               selectedId={selectedReq?.id || null}
//               onSelect={handleSelect}
//             />
//           </div>
//           <div className="lg:col-span-1">
//             {selectedReq ? (
//               <RequestDetails
//                 request={selectedReq}
//                 onClose={() => setSelectedReq(null)}
//               />
//             ) : (
//               <EmptyState type="no-selection" />
//             )}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

"use client"

"use client";

import { useState, useMemo, useCallback } from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Skeleton } from "@/components/ui/skeleton";
import { useRequests } from "@/utils/useRequests"; 
import { SearchBar } from "@/components/macro-element/SearchBarAdmin"; 
import { StatusFilter } from "@/components/macro-element/StatusFilter"; 
import { DatePicker } from "@/components/macro-element/DatePicker";
import { RequestTable } from "@/components/macro-element/RequestTable";
import { RequestDetails } from "@/components/macro-element/RequestDetails"; 
import { EmptyState } from "@/components/macro-element/EmptyState";
import { Request } from "@/utils/types";

export default function RequestPage() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [selectedReq, setSelectedReq] = useState<Request | null>(null);

  const { data: requests, loading, updateRequest } = useRequests(selectedDate);

  const filtered = useMemo(
    () =>
      requests.filter((r) => {
        const txt = r.fullName.toLowerCase().includes(search.toLowerCase()) ||
                    r.cinNumber.includes(search);
        const st = filter === "all" || r.status === filter;
        return txt && st;
      }),
    [requests, search, filter]
  );

  const handleSelect = useCallback((r: Request) => setSelectedReq(r), []);

  const handleApprove = useCallback((id: string, biometryDate: Date) => {
    updateRequest(id, { 
      status: "approved", 
      biometryDate: biometryDate.toISOString() 
    });
    setSelectedReq(null);
  }, [updateRequest]);

  const handleReject = useCallback((id: string, reason: string) => {
    updateRequest(id, { 
      status: "rejected", 
      rejectionReason: reason 
    });
    setSelectedReq(null);
  }, [updateRequest]);

  return (
    <div className="p-6 bg-slate-800">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">
            Gestion des Demandes
          </h1>
          <p className="text-slate-400">
            pour le {format(selectedDate, "dd MMMM yyyy", { locale: fr })}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <SearchBar value={search} onChange={setSearch} />
          <div className="flex gap-2">
            <StatusFilter value={filter} onChange={setFilter} />
            <DatePicker
              date={selectedDate}
              onChange={(d) => {
                if (d) setSelectedDate(d);
              }}
            />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-16 rounded-lg bg-slate-700" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState type="no-results" />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <RequestTable
              requests={filtered}
              selectedId={selectedReq?.id || null}
              onSelect={handleSelect}
            />
          </div>
          <div className="lg:col-span-1">
            {selectedReq ? (
              <RequestDetails
                request={selectedReq}
                onClose={() => setSelectedReq(null)}
                onApprove={handleApprove}
                onReject={handleReject}
              />
            ) : (
              <EmptyState type="no-selection" />
            )}
          </div>
        </div>
      )}
    </div>
  );
}