import { Navigate, Route, Routes } from "react-router-dom";
import { HomePage } from "./pages/HomePage";
import { ExpensesPage } from "./pages/ExpensesPage";
import { GolfPage } from "./pages/GolfPage";
import { HotelPage } from "./pages/HotelPage";
import { MahjongPage } from "./pages/MahjongPage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { SchedulePage } from "./pages/SchedulePage";
import { SettlementPage } from "./pages/SettlementPage";
import { TripOverviewPage } from "./pages/TripOverviewPage";

const App = () => (
  <Routes>
    <Route path="/" element={<HomePage />} />
    <Route path="/trips/:tripId" element={<TripOverviewPage />} />
    <Route path="/trips/:tripId/schedule" element={<SchedulePage />} />
    <Route path="/trips/:tripId/golf" element={<GolfPage />} />
    <Route path="/trips/:tripId/hotel" element={<HotelPage />} />
    <Route path="/trips/:tripId/expenses" element={<ExpensesPage />} />
    <Route path="/trips/:tripId/settlement" element={<SettlementPage />} />
    <Route path="/trips/:tripId/mahjong" element={<MahjongPage />} />
    <Route path="/home" element={<Navigate replace to="/" />} />
    <Route path="*" element={<NotFoundPage />} />
  </Routes>
);

export default App;
