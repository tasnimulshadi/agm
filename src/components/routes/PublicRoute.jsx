import { useSelector } from "react-redux"
import { Navigate, useNavigate } from "react-router-dom"
import useAuth from "../../hooks/useAuth";

function PublicRoute({ children }) {
    const isLoggedIn = useAuth();

    return !isLoggedIn ? children : <Navigate to={'/events'} />
}

export default PublicRoute