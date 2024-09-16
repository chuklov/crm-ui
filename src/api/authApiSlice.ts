// authApiSlice.ts
import { apiSlice } from "./apiSlice";
import { selectCurrentToken } from './authSlice';
import { MapUser } from "../components/User";
import { RootState } from '../app/store'; // Import RootState

export const authApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        userInfo: builder.query({
           query: () => '/users/user_info',
            transformResponse: (responseData: any) => {
                console.log("auth slice responseData", responseData);
                  if (!responseData || typeof responseData !== 'object') {
                    throw new Error('Invalid response format');
                  }
                return MapUser(responseData);
            }
        }),
        users: builder.query({
           query: () => '/users',
            transformResponse: (responseData: any) => {
                console.log("get all users responseData", responseData);
                return MapUser(responseData);
            }
        }),

    }),
});

export const {
    useLazyUserInfoQuery,
    useLazyUsersQuery
} = authApiSlice;
