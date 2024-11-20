import { useState } from "react"
import { useDispatch } from "react-redux"
import { authApi } from "../redux/features/auth/authApi"
import { apiSlice } from "../redux/features/api/apiSlice"


function Login() {
    const [email, setEmail] = useState('shadi@email.com');
    const [password, setPassword] = useState('1234');
    const dispatch = useDispatch();

    // Function to handle login form submission
    function handleLogin(e) {
        e.preventDefault(); // Prevents the default form submission behavior (page reload)

        // Check if both email and password are provided
        if (email && password) {
            // Manually invalidate the 'auth' cache tag, ensuring the cached data is cleared
            dispatch(apiSlice.util.invalidateTags(['auth']));

            // Dispatch an API request to the `getUser` endpoint, passing the email and password
            dispatch(authApi.endpoints.getUser.initiate({ email, password }));
        }
    }


    return (
        <div className="hero bg-white h-screen">
            <div className="hero-content flex-col lg:flex-row-reverse">
                <div className="text-center lg:text-left">
                    <img src="https://media.istockphoto.com/id/1285458594/vector/flat-design-with-people-agm-annual-general-meeting-acronym.jpg?s=612x612&w=0&k=20&c=SLrj-tZj1PaulRzaQ-iGsM3DVK-i88ZeKwHIqfwbTks=" alt="agm" />
                    <p className="text-3xl font-bold text-center">AGM Attendance and Voting</p>
                </div>
                <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
                    <form className="card-body gap-5" onSubmit={handleLogin}>
                        <input
                            type="email"
                            placeholder="email"
                            className="input input-bordered"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <input
                            type="password"
                            placeholder="password"
                            className="input input-bordered"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        {/* <label className="label">
                                <a href="#" className="label-text-alt link link-hover">Forgot password?</a>
                            </label> */}
                        <button className="btn btn-primary font-bold text-xl">Login</button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Login