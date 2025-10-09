import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./LandingPage";
import TrackerPage from "./TrackerPage";

export default function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/tracker" element={<TrackerPage />} />
            </Routes>
        </Router>
    );
}
