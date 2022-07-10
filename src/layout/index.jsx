import { Outlet } from "react-router-dom"
import Menu from "../components/Menu"

const Layout = () => {
    return (
        <div className="d-flex flex-column">
            <Menu/>
            <div className="d-flex">
                <Outlet/>
            </div>
        </div>
    )
}

export default Layout