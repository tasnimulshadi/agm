import { useSelector } from "react-redux"
import { Navigate, useNavigate } from "react-router-dom"

function PublicRoute({ children, routeLevel }) {
    const { level } = useSelector(state => state.auth)
    // console.log({ level, routeLevel });


    return level <= routeLevel ? children : <Navigate to={'/events'} />
}

export default PublicRoute