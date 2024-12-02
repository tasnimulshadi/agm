import { apiSlice } from "../api/apiSlice";

export const eventApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        // useGetEventsQuery
        getEvents: builder.query({
            query: () => ({
                url: `event?isDeleted=false`
            }),
            keepUnusedDataFor: false
        }),

        // useGetSingleEventQuery
        getSingleEvent: builder.query({
            query: (id) => ({
                url: `/event/${id}`
            }),
            keepUnusedDataFor: false
        }),

        // useCreateEventMutation
        createEvent: builder.mutation({
            query: (data) => ({
                url: `/event`,
                method: 'POST',
                body: data
            })
        }),

        // useUpdateEventMutation
        updateEvent: builder.mutation({
            query: ({ id, data }) => ({
                url: `/event/${id}`,
                method: "PATCH",
                body: data
            })
        })

        //
    })
})

export const { useGetEventsQuery, useGetSingleEventQuery, useCreateEventMutation, useUpdateEventMutation } = eventApi;