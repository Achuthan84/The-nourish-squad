import { BrowserRouter, Routes, Route } from "react-router-dom";
import Analytics from "./Pages/Analytics";
import RiskMap from "./Pages/Riskmap";
import { Navbar } from "./Components/Navbar";
import RiskForm from "./Pages/Riskform";

function App() {
    return (
        <BrowserRouter>
            <Navbar />
            <Routes>
                <Route path="/Analytics" element={<Analytics />} />
                <Route path="/RiskMap" element={<RiskMap />} />
                <Route path="/RiskForm" element={<RiskForm />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
