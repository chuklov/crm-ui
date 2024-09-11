import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { authApiSlice } from "./authApiSlice";
import { redirect } from "react-router-dom";
import { setCredentials } from "./authSlice";

// @ts-ignore
const baseURL = window.env.baseURL

// Following example outlined in
// https://github.com/gitdagray/redux_jwt_auth/blob/main/src/app/api/apiSlice.js
const baseQuery = fetchBaseQuery({
    baseUrl: baseURL,
    credentials: 'include',
    prepareHeaders: async (headers, { getState }) => {
        const state: any = getState();
        const token = state.auth.useKeycloak ? state.auth.keycloak.token : localStorage.getItem('token');

        if (token) {
            headers.set('Authorization', `Bearer ${token}`);
        }
        // headers.set('Access-Control-Allow-Origin', 'https://localhost:3000');
        // headers.set('Access-Control-Allow-Credentials', "true");
        headers.set('Cache-Control', 'no-cache');
        return headers;
    }
});

const baseQueryWithReauth = async (args: any, api: any, extraOptions: any) => {
    let result = await baseQuery(args, api, extraOptions)

    // @ts-ignore
    if (result?.error?.originalStatus === 403 || result?.error?.status === 401) {
        const state = api.getState();
        if (state.auth.useKeycloak) {
            if (state.auth.keycloak.isTokenExpired()) {
                let tokenRefreshed = false;
                try {
                    tokenRefreshed = await state.auth.keycloak.updateToken(5);
                } catch (e) {
                    state.auth.keycloak.login();
                }
                if (tokenRefreshed) {
                    result = await baseQuery(args, api, extraOptions);
                } else {
                    state.auth.keycloak.login();
                }
            }
        } else {
            redirect('/login');
            api.dispatch(setCredentials(''));
        }
    }

    return result
}

export const apiSlice = createApi({
    baseQuery: baseQueryWithReauth,
    keepUnusedDataFor: 30,
 endpoints: builder => ({})
});