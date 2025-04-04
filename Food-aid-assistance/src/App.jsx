import { BrowserRouter, Routes, Route } from "react-router-dom";
import Analytics from "./Pages/Analytics";
import { Navbar } from "./Components/Navbar";
function App() {
    return (
        <BrowserRouter>
            <Navbar />
            <Routes>
                <Route path="/Analytics" element={<Analytics />} />
            </Routes>

        </BrowserRouter>
    )
}

export default App;
