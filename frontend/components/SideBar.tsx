// "use client";

// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import { Home, FileText, ChevronLeft, ChevronRight, Fingerprint } from "lucide-react";
// import { motion, AnimatePresence } from "framer-motion";

// interface SidebarProps {
//   isCollapsed: boolean;
//   toggleCollapse: () => void;
// }

// export default function Sidebar({ isCollapsed, toggleCollapse }: SidebarProps) {
//   const pathname = usePathname();
//   const navItems = [
//     { href: "/admin/dashboard", label: "Dashboard", icon: <Home size={20} /> },
//     { href: "/admin/dashboard/requests", label: "Demandes", icon: <FileText size={20} /> },
//     { href: "/admin/dashboard/biometry", label: "Biométrie", icon: <Fingerprint size={20} /> },
//   ];

//   return (
//     <motion.div
//       className="hidden md:flex flex-col h-full fixed bg-slate-900 border-r border-slate-800"
//       initial={false}
//       animate={{ width: isCollapsed ? "5rem" : "16rem" }}
//       transition={{ duration: 0.3, ease: "easeInOut" }}
//     >
//       <motion.div className="h-full overflow-hidden" layout>
//         <div className="p-4 flex justify-between items-center">
//           <AnimatePresence>
//             {!isCollapsed && (
//               <motion.h1
//                 className="text-xl font-semibold text-slate-100"
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 exit={{ opacity: 0 }}
//                 transition={{ duration: 0.15 }}
//               >
//                 IDExpress Admin
//               </motion.h1>
//             )}
//           </AnimatePresence>

//           <motion.button
//             onClick={toggleCollapse}
//             className="p-2 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-slate-100 cursor-pointer"
//             whileTap={{ scale: 0.95 }}
//           >
//             {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
//           </motion.button>
//         </div>

//         <nav className="p-4">
//           <ul className="space-y-2">
//             {navItems.map((item) => {
//               const isActive = pathname === item.href;
//               return (
//                 <li key={item.href}>
//                   <Link
//                     href={item.href}
//                     className={`flex items-center p-3 rounded-lg transition-colors ${
//                       isActive
//                         ? "bg-slate-800 text-slate-100"
//                         : "text-slate-400 hover:bg-slate-800 hover:text-slate-100"
//                     }`}
//                   >
//                     <span className="flex-shrink-0">{item.icon}</span>
//                     <AnimatePresence>
//                       {!isCollapsed && (
//                         <motion.span
//                           className="ml-3 truncate"
//                           initial={{ opacity: 0, width: 0 }}
//                           animate={{ opacity: 1, width: "auto" }}
//                           exit={{ opacity: 0, width: 0 }}
//                           transition={{ duration: 0.2 }}
//                         >
//                           {item.label}
//                         </motion.span>
//                       )}
//                     </AnimatePresence>
//                   </Link>
//                 </li>
//               );
//             })}
//           </ul>
//         </nav>
//       </motion.div>
//     </motion.div>
//   );
// }


"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Home, FileText, ChevronLeft, ChevronRight, Fingerprint, LogOut } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

interface SidebarProps {
  isCollapsed: boolean;
  toggleCollapse: () => void;
}

export default function Sidebar({ isCollapsed, toggleCollapse }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  
  const navItems = [
    { href: "/admin/dashboard", label: "Dashboard", icon: <Home size={20} /> },
    { href: "/admin/dashboard/requests", label: "Demandes", icon: <FileText size={20} /> },
    { href: "/admin/dashboard/biometry", label: "Biométrie", icon: <Fingerprint size={20} /> },
  ];

  const handleLogout = () => {
    // Supprimer le cookie d'authentification
    document.cookie = "authToken=; max-age=0; path=/";
    
    // Afficher un toast de confirmation
    toast.success("Déconnexion réussie");
    
    // Rediriger vers la page de login
    router.push("/login");
  };

  return (
    <motion.div
      className="hidden md:flex flex-col h-full fixed bg-slate-900 border-r border-slate-800"
      initial={false}
      animate={{ width: isCollapsed ? "5rem" : "16rem" }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      <motion.div className="h-full flex flex-col" layout>
        {/* En-tête */}
        <div className="p-4 flex justify-between items-center">
          <AnimatePresence>
            {!isCollapsed && (
              <motion.h1
                className="text-xl font-semibold text-slate-100"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                IDExpress Admin
              </motion.h1>
            )}
          </AnimatePresence>

          <motion.button
            onClick={toggleCollapse}
            className="p-2 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-slate-100 cursor-pointer"
            whileTap={{ scale: 0.95 }}
          >
            {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </motion.button>
        </div>

        {/* Navigation principale */}
        <div className="flex-grow p-4">
          <ul className="space-y-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`flex items-center p-3 rounded-lg transition-colors ${
                      isActive
                        ? "bg-slate-800 text-slate-100"
                        : "text-slate-400 hover:bg-slate-800 hover:text-slate-100"
                    }`}
                  >
                    <span className="flex-shrink-0">{item.icon}</span>
                    <AnimatePresence>
                      {!isCollapsed && (
                        <motion.span
                          className="ml-3 truncate"
                          initial={{ opacity: 0, width: 0 }}
                          animate={{ opacity: 1, width: "auto" }}
                          exit={{ opacity: 0, width: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          {item.label}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Section de déconnexion */}
        <div className="p-4 border-t border-slate-800">
          <button
            onClick={handleLogout}
            className="w-full flex items-center cursor-pointer p-3 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-rose-400 transition-colors"
          >
            <span className="flex-shrink-0">
              <LogOut size={20} />
            </span>
            <AnimatePresence>
              {!isCollapsed && (
                <motion.span
                  className="ml-3 truncate"
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  Déconnexion
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}