import { BrowserRouter, Route, Routes } from "react-router-dom"
import Login from "./pages/Login"
import Events from "./pages/event/Events"
import PrivateRoute from "./components/routes/PrivateRoute"
import LevelRoute from "./components/routes/LevelRoute"
import Present from "./pages/attendance/Present"
import Vote from "./pages/vote/Vote"
import EventCreate from "./pages/event/EventCreate"
import EventEdit from "./pages/event/EventEdit"
import Attendance from "./pages/attendance/Attendance"
import PublicRoute from "./components/routes/PublicRoute"
import useAuthCheck from "./hooks/useAuthCheck"


function App() {
  const authChecked = useAuthCheck()

  return authChecked
    ? (
      <BrowserRouter>
        <Routes>

          <Route path="/" element={<PublicRoute>
            <Login />
          </PublicRoute>} />

          <Route path="/events" element={<PrivateRoute>
            <Events />
          </PrivateRoute>} />

          <Route path="/event-create" element={<PrivateRoute>
            <LevelRoute routeLevel={1}>
              <EventCreate />
            </LevelRoute>
          </PrivateRoute>} />

          <Route path="/event-edit/:eventId" element={<PrivateRoute>
            <LevelRoute routeLevel={1}>
              <EventEdit />
            </LevelRoute>
          </PrivateRoute>} />

          <Route path="/present/:eventId" element={<PrivateRoute>
            <LevelRoute routeLevel={3}>
              <Present />
            </LevelRoute>
          </PrivateRoute>} />

          <Route path="/attendance/:eventId" element={<PrivateRoute>
            <LevelRoute routeLevel={2}>
              <Attendance />
            </LevelRoute>
          </PrivateRoute>} />

          <Route path="/vote/:eventId" element={<PrivateRoute>
            <LevelRoute routeLevel={3}>
              <Vote />
            </LevelRoute>
          </PrivateRoute>} />
        </Routes>

      </BrowserRouter>
    )
    : <div>Checking Authentication...</div>
}

export default App

