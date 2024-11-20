import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { userLoggedIn } from "../redux/features/auth/authSlice";

function useAuthCheck() {
    const dispatch = useDispatch();
    const [checked, setChecked] = useState(false);

    useEffect(() => {
        const localStorageAuthData = localStorage?.getItem('auth');

        if (localStorageAuthData) {
            const auth = JSON.parse(localStorageAuthData);

            if (auth?.id) {
                dispatch(userLoggedIn(auth))
            }
        }

        setChecked(true)
    }, [dispatch, setChecked]);

    return checked;
}

export default useAuthCheck