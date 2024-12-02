import { useNavigate, Navigate } from "react-router-dom"
import { FaHome } from "react-icons/fa";
import { IoLogOut } from "react-icons/io5";
import { userLoggedOut } from "../../redux/features/auth/authSlice";
import { useDispatch } from "react-redux"
import useAuth from "../../hooks/useAuth";
import bgiclogo from "../../assets/bgiclogo.png"

function PrivateRoute({ children }) {
    const isLoggedIn = useAuth();

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const logout = () => {
        dispatch(userLoggedOut());
        localStorage.clear();
    };

    return isLoggedIn
        ? <div className="drawer">
            <input id="my-drawer" type="checkbox" className="drawer-toggle" />
            <div className="drawer-content bg">
                {/* Page content here */}
                <nav className="bg-blue-200 flex justify-between p-2 px-5 shadow-lg">
                    <div className="flex gap-2">
                        {/* <label htmlFor="my-drawer" className="btn drawer-button"><GiHamburgerMenu size={30} /></label> */}
                        <img
                            src={bgiclogo}
                            // src="https://bgicinsure.com/images/logo-2.jpg"
                            alt="logo"
                            className="h-14"
                        />
                    </div>
                    <div className="flex gap-2">
                        <button className="btn" onClick={() => navigate('/events')}><FaHome size={30} /></button>
                        <button className="btn" onClick={logout}><IoLogOut size={30} /></button>
                    </div>
                </nav>
                {children}
            </div>
            <div className="drawer-side">
                <label htmlFor="my-drawer" aria-label="close sidebar" className="drawer-overlay"></label>
                <ul className="menu bg-base-200 text-base-content min-h-full w-80 p-4">
                    {/* Sidebar content here */}
                    <li><a>Sidebar Item 1</a></li>
                    <li><a>Sidebar Item 2</a></li>
                </ul>
            </div>
        </div>
        : <Navigate to={'/'} />
}

export default PrivateRoute