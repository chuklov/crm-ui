// apiSlice.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { RootState } from '../app/store';
import { setCredentials } from './authSlice';


// @ts-ignore
const baseurl = window.env?.baseURL


// Base query function with optional Keycloak support
const baseQuery = fetchBaseQuery({
  baseUrl: baseurl,
  credentials: 'include',
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.token;
    if (token) {
        console.log("Attaching token to headers:", token);
      headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithReauth = async (args: any, api: any, extraOptions: any) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result?.error?.status === 401) {
    const refreshResult = await baseQuery('/refresh', api, extraOptions);
    if (refreshResult?.data) {
      const user = (api.getState() as RootState).auth;
      api.dispatch(setCredentials({ ...refreshResult.data, user }));
      result = await baseQuery(args, api, extraOptions);
    } else {
       api.dispatch(setCredentials(''));
    }
  }

      if (result?.error && result.error.status === 403) {
          console.log("ERROR 403");
          const refreshResult = await baseQuery('/refresh', api, extraOptions);
          if (refreshResult?.data) {
              const user = api.getState().auth;
              api.dispatch(setCredentials({ ...refreshResult.data, user }));
              result = await baseQuery(args, api, extraOptions);
          } else {
              api.dispatch(setCredentials(''));
          }
      }

  return result;
};

export const apiSlice = createApi({
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({}), // Empty, extended by other slices
});

