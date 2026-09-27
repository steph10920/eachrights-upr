import { Outlet } from 'react-router-dom';
import { StaffHeader } from './StaffHeader';
import { StaffSidebar } from './StaffSidebar';

export function StaffLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <StaffHeader />
      <div className="flex flex-1">
        <StaffSidebar />
        {/* StaffMobileNav.tsx (bottom/hamburger nav for small screens) slots
            in here later — omitted for now, sidebar covers desktop. */}
        <main className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
