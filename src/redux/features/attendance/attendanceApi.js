import { apiSlice } from "../api/apiSlice";

export const attendanceApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        // useGetAllShareHoldersQuery
        getAllShareHolders: builder.query({
            query: ({ name, boid, page }) => ({
                url: `/shareholder?name_like=${name}&boid_like=${boid}&_page=${page}&_limit=50`
            }),
            keepUnusedDataFor: false
        }),

        // useGetAllPresentListQuery
        getAllPresentList: builder.query({
            query: (eventId) => ({
                url: `/vote?eventId_like=${eventId}`
            }),
            keepUnusedDataFor: false,
            providesTags: ["attendanceList"]
        }),

        // useAddToAttendanceMutation
        addToAttendance: builder.mutation({
            query: (data) => ({
                url: `/vote`,
                method: "POST",
                body: data
            }),
            invalidatesTags: ["attendanceList"]
        }),

        // useUpdateAttendanceMutation
        updateAttendance: builder.mutation({
            query: ({ id, data }) => ({
                url: `/vote/${id}`,
                method: "PATCH",
                body: data
            }),
            invalidatesTags: ["attendanceList", "voterList"]
        }),


        //


        ///
    })
})

export const { useGetAllShareHoldersQuery, useGetAllPresentListQuery, useAddToAttendanceMutation, useUpdateAttendanceMutation } = attendanceApi;