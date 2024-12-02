import { useSelector } from "react-redux"
import { Navigate, useNavigate } from "react-router-dom"

function PublicRoute({ children, routeLevel }) {
    const { user } = useSelector(state => state.auth)
    console.log({ level: user.level, routeLevel });


    return user?.level <= routeLevel ? children : <Navigate to={'/events'} />
}

export default PublicRoute