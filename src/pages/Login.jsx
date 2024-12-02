import { useEffect, useState } from "react"
import { useLoginMutation, useRegisterMutation } from "../redux/features/auth/authApi"
import { useNavigate } from "react-router-dom";

function Login() {
    const navigate = useNavigate();

    const [email, setEmail] = useState('shadi@email.com');
    const [password, setPassword] = useState('1234');
    const [error, setError] = useState("");

    const [login, { data, isLoading, error: responseError }] =
        useLoginMutation();


    useEffect(() => {
        if (responseError?.data) {
            setError(responseError.data);
        }
        if (data?.accessToken && data?.user) {
            navigate("/events");
        }
    }, [data, responseError, navigate]);


    function handleSubmit(e) {
        e.preventDefault();

        setError("");

        login({
            email,
            password,
        });
        // register({
        //     email,
        //     password,
        //     level: 2
        // });
    }


    return (
        <div className="hero bg-white h-screen">
            <div className="hero-content flex-col lg:flex-row-reverse">
                <div className="text-center lg:text-left">
                    <img src="https://media.istockphoto.com/id/1285458594/vector/flat-design-with-people-agm-annual-general-meeting-acronym.jpg?s=612x612&w=0&k=20&c=SLrj-tZj1PaulRzaQ-iGsM3DVK-i88ZeKwHIqfwbTks=" alt="agm" />
                    <p className="text-3xl font-bold text-center">AGM Attendance and Voting</p>
                </div>
                <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
                    <form className="card-body gap-5" onSubmit={handleSubmit}>
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

                        {error && <p className="text-red-500">{error}</p>}
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Login