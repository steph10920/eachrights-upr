import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import Overview from "./pages/public/Overview";
import Recommendations from "./pages/public/Recommendations";
import RecommendationDetail from "./pages/public/RecommendationDetail";
import Implementation from "./pages/public/Implementation";
import Themes from "./pages/public/Themes";
import Institutions from "./pages/public/Institutions";
import Evidence from "./pages/public/Evidence";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Overview />} />

        <Route
          path="/recommendations"
          element={<Recommendations />}
        />

        <Route
          path="/recommendations/:id"
          element={<RecommendationDetail />}
        />

        <Route
          path="/implementation"
          element={<Implementation />}
        />

        <Route
          path="/themes"
          element={<Themes />}
        />

        <Route
          path="/institutions"
          element={<Institutions />}
        />

        <Route
          path="/evidence"
          element={<Evidence />}
        />

        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;