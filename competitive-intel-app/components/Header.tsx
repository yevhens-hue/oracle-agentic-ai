import Link from 'next/link';
import { ShieldCheck, Cpu, Database, History, Sparkles } from 'lucide-react';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-dark-900/80 border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/cp/competitive-intel" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-sky-500/20 group-hover:scale-105 transition-transform">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <span className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-200 to-gray-400">
              CompetitiveIntel AI
            </span>
            <span className="block text-[10px] text-sky-400 font-mono tracking-wider">
              ENTERPRISE GEO & THREAT SUITE
            </span>
          </div>
        </Link>

        <nav className="flex items-center gap-2 sm:gap-6">
          <Link
            href="/cp/competitive-intel"
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-800/60 transition-colors"
          >
            <Sparkles className="w-4 h-4 text-sky-400" />
            Dashboard
          </Link>

          <Link
            href="/history"
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-800/60 transition-colors"
          >
            <History className="w-4 h-4 text-indigo-400" />
            Saved Reports
          </Link>

          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
            <Database className="w-3.5 h-3.5" />
            Prisma DB Active
          </div>
        </nav>
      </div>
    </header>
  );
}
