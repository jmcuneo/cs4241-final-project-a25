import {createRoot} from 'react-dom/client'
import Home from "./home.tsx";
import {StrictMode} from "react";
import {BrowserRouter, Route, Routes} from "react-router";
import Heat from "./Heat.tsx"
import Loading from "./loading.tsx";

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home/>}/>
                <Route path="/heat" element={<Heat/>}/>
                <Route path={"/loading"} element={<Loading/>}/>
            </Routes>
        </BrowserRouter>
    )
}

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <App/>
    </StrictMode>,
);
