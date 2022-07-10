import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom"
import Login from "../pages/Login"
import Home from "../pages/Home"
import Review from "../pages/Review"
import ExportPdfSPMT from "../pages/ExportPdfSPMT"
import Layout from "../layout"

const RoutesApp = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Login/>}/>
                <Route path="/home" element={
                    <ProtectedRoute>
                        <Layout/>
                    </ProtectedRoute>}>
                    <Route index element={<Home/>}/>
                    <Route path="review/:id" element={<Review/>}/>
                    <Route path="spmt/:id" element={<ExportPdfSPMT/>}/>
                </Route>
            </Routes>
        </BrowserRouter>
    )
}

const ProtectedRoute = ({ user, children }) => {
    const login = localStorage.getItem("isLogin")
    if (login !== "true") {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default RoutesApp