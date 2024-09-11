// authApiSlice.ts
import { apiSlice } from "./apiSlice";
import { MapUser } from "../components/User";

export const authApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        login: builder.mutation({
            query: credentials => ({
                url: '/login',
                method: 'POST',
                body: { ...credentials }
            })
        }),

        userInfo: builder.query({
           query: () => '/users/user_info',
            transformResponse: (responseData: any) => {
                return MapUser(responseData);
            }
        }),

    }),
})

export const {
    useLoginMutation,
    useLazyUserInfoQuery,
} = authApiSlice
