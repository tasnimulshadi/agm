import { apiSlice } from "../api/apiSlice";

export const voteApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        // useGetAllVotersQuery
        getAllVoters: builder.query({
            query: (eventId) => ({
                url: `/vote?eventId_like=${eventId}&present_like=true`
            }),
            keepUnusedDataFor: false,
            providesTags: ["voterList"]
        }),

        // useUpdateVoteMutation
        updateVote: builder.mutation({
            query: ({ id, data }) => ({
                url: `/vote/${id}`,
                method: "PATCH",
                body: data
            }),
            invalidatesTags: ["voterList"]
        }),


        //


        ///
    })
})

export const { useGetAllVotersQuery, useUpdateVoteMutation } = voteApi;