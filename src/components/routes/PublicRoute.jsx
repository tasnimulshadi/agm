import { useSelector } from "react-redux"
import { Navigate, useNavigate } from "react-router-dom"

function PublicRoute({ children }) {
    const { id } = useSelector(state => state.auth)

    return !id ? children : <Navigate to={'/events'} />
}

export default PublicRoute