'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, FileText, Settings } from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();
  
  const navItems = [
    { href: '/admin/dashboard', label: 'Dashboard', icon: <Home size={18} /> },
    { href: '/dashboard/requests', label: 'Demandes', icon: <FileText size={18} /> },
    { href: '/dashboard/settings', label: 'Paramètres', icon: <Settings size={18} /> },
  ];

  return (
    <div className="hidden md:flex md:w-64 md:flex-col">
      <div className="fixed h-full w-64 border-r">
        <div className="p-6">
          <h1 className="text-xl font-semibold font-[family-name:var(--font-audiowided)]">IDExpress Admin</h1>
        </div>
        <nav className="p-4">
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center p-2 rounded-lg ${
                    pathname === item.href
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-white hover:bg-gray-100 hover:text-blue-600'
                  }`}
                >
                  <span className="mr-3">{item.icon}</span>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
}