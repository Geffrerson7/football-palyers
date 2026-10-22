import { BrowserRouter, Route, Routes } from "react-router";
import "./styles/plantel.css";
import PlayersPage from "./pages/PlayersPage";
import Layout from "./layouts/Layout";
import PlayerDetail from "./pages/PlayerDetail";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/jugadores" element={<PlayersPage />} />
          <Route path="/jugadores/:id" element={<PlayerDetail />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
