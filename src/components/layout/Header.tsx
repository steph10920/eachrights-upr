import { Link } from "react-router-dom";
import {
  Menu,
  Search,
  LogIn,
} from "lucide-react";

interface HeaderProps {
  onMenuClick?: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-20 max-w-[1600px] items-center justify-between px-5 sm:px-8 lg:px-10">

        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={onMenuClick}
            className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
            aria-label="Open navigation"
          >
            <Menu size={22} />
          </button>

          <Link
            to="/"
            className="flex items-center gap-3"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-700 text-sm font-bold text-white">
              ER
            </div>

            <div>
              <div className="text-sm font-bold tracking-wide text-slate-900">
                EACHRights
              </div>

              <div className="text-xs text-slate-500">
                UPR Dashboard
              </div>
            </div>
          </Link>
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <Link
            to="/recommendations"
            className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
          >
            Explore
          </Link>

          <Link
            to="/recommendations"
            className="rounded-lg p-2.5 text-slate-600 hover:bg-slate-100"
            aria-label="Search recommendations"
          >
            <Search size={19} />
          </Link>

          <Link
            to="/login"
            className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800"
          >
            <LogIn size={17} />
            Sign in
          </Link>
        </div>

      </div>
    </header>
  );
}