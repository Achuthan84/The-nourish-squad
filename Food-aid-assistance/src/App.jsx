import { BrowserRouter, Routes, Route } from "react-router-dom";
import Analytics from "./Pages/Analytics";
import { Navbar } from "./Components/Navbar";
import RiskForm from "./Pages/Riskform";
// import Login from "./Pages/Login";

function App() {
    return (
        <BrowserRouter>
            <Navbar />
            <Routes>
                <Route path="/Analytics" element={<Analytics />} />
                <Route path="/RiskForm" element={<RiskForm />} />
                {/* <Route path="/Login" element={<Login />} /> */}
            </Routes>
        </BrowserRouter>
    );
}

export default App;
