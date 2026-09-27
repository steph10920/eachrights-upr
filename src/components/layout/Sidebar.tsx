import { NavLink } from "react-router-dom";
import {
  BarChart3,
  Building2,
  FileSearch,
  Home,
  Layers3,
  Scale,
} from "lucide-react";

const navigation = [
  {
    label: "Overview",
    to: "/",
    icon: Home,
  },
  {
    label: "Recommendations",
    to: "/recommendations",
    icon: Scale,
  },
  {
    label: "Implementation",
    to: "/implementation",
    icon: BarChart3,
  },
  {
    label: "Themes",
    to: "/themes",
    icon: Layers3,
  },
  {
    label: "Institutions",
    to: "/institutions",
    icon: Building2,
  },
  {
    label: "Evidence",
    to: "/evidence",
    icon: FileSearch,
  },
];

interface SidebarProps {
  open?: boolean;
  onClose?: () => void;
}

export default function Sidebar({
  open = false,
  onClose,
}: SidebarProps) {
  return (
    <>
      {open && (
        <button
          type="button"
          aria-label="Close navigation"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-950/40 lg:hidden"
        />
      )}

      <aside
        className={[
          "fixed left-0 top-20 z-50 h-[calc(100vh-5rem)] w-64 border-r border-slate-200 bg-white transition-transform lg:sticky lg:top-20 lg:z-0 lg:block lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        ].join(" ")}
      >
        <div className="flex h-full flex-col px-4 py-6">

          <div className="mb-4 px-3 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">
            Explore UPR
          </div>

          <nav className="space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={onClose}
                  className={({ isActive }) =>
                    [
                      "flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition",
                      isActive
                        ? "bg-emerald-50 text-emerald-800"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900",
                    ].join(" ")
                  }
                >
                  <Icon size={18} />
                  {item.label}
                </NavLink>
              );
            })}
          </nav>

          <div className="mt-auto rounded-2xl bg-slate-50 p-4">
            <div className="text-xs font-semibold text-slate-700">
              EACHRights
            </div>

            <p className="mt-1 text-xs leading-5 text-slate-500">
              Tracking implementation, accountability and evidence through the Universal Periodic Review.
            </p>
          </div>

        </div>
      </aside>
    </>
  );
}