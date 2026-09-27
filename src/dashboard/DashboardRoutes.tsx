import { Route } from 'react-router-dom';
import { DashboardOverview } from './pages/DashboardOverview';
import { RecommendationsExplorer } from './pages/RecommendationsExplorer';
import { RecommendationDetail } from './pages/RecommendationDetail';

// Drop these <Route> elements inside your existing <Routes> in App.jsx
// (alongside your Team/Contact/Publications/Portals routes):
//
//   import { DashboardRoutes } from './dashboard/DashboardRoutes';
//   ...
//   <Routes>
//     {DashboardRoutes()}
//     {/* your other routes */}
//   </Routes>
//
// Or, if you prefer nested routes, mount them under a layout element instead.
export function DashboardRoutes() {
  return (
    <>
      <Route path="/dashboard" element={<DashboardOverview />} />
      <Route path="/dashboard/recommendations" element={<RecommendationsExplorer />} />
      <Route path="/dashboard/recommendations/:id" element={<RecommendationDetail />} />
    </>
  );
}
