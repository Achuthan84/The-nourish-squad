import { BrowserRouter, Routes, Route } from "react-router-dom";
import Analytics from "./Pages/Analytics";
import RiskMap from "./Pages/Riskmap";
import { Navbar } from "./Components/Navbar";

function App() {
    return (
        <BrowserRouter>
            <Navbar />
            <Routes>
                <Route path="/Analytics" element={<Analytics />} />
                <Route path="/RiskMap" element={<RiskMap />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
