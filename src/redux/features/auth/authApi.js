import { apiSlice } from "../api/apiSlice";
import { userLoggedIn } from "./authSlice";

export const authApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        // useGetUserQuery
        getUser: builder.query({
            query: ({ email, password }) => ({
                url: `/admin?email=${email}&password=${password}`
            }),
            keepUnusedDataFor: 0,
            providesTags: ["auth"],
            async onQueryStarted(arg, { queryFulfilled, dispatch }) {
                try {
                    const result = await queryFulfilled;

                    // store in loca storage
                    localStorage.setItem('auth', JSON.stringify(result.data[0]))

                    // store in redux
                    dispatch(userLoggedIn(result.data[0]))

                } catch (error) {
                    console.log("useGetUserQuery -> onQueryStarted -> error: ", error);
                }
            }
        }),


        //
    })
})

export const { useGetUserQuery } = authApi;