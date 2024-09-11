import { createListenerMiddleware, createSlice } from "@reduxjs/toolkit";
import Keycloak from "keycloak-js";

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        token: '',
        keycloak: null,
        useKeycloak: false,
        appReady: false
    },
    reducers: {
        initialize: state => {},
        setCredentials: (state, action) => {
            state.token = action.payload;
        },
        setKeycloak: (state, action) => {
            state.keycloak = action.payload;
            state.useKeycloak = true;
        },
        setAppReady: (state, action) => {
            state.appReady = action.payload
        }
    }
});

export const {
    initialize,
    setCredentials,
    setKeycloak,
    setAppReady
} = authSlice.actions;

export default authSlice.reducer;

// TODO: type with global state.
export const selectCurrentToken = (state: any) => state.auth.token
export const selectKeycloak = (state: any) => state.auth.keycloak;
export const selectUseKeycloak = (state: any) => state.auth.useKeycloak;
export const selectAppReady = (state: any) => state.auth.appReady;

const loginListenerMiddleware = createListenerMiddleware();

loginListenerMiddleware.startListening({
    actionCreator: setCredentials,
    effect: async (action, listenerApi) => {
        localStorage.setItem('token', action.payload);
    }
});

loginListenerMiddleware.startListening({
    actionCreator: initialize,
    effect: async  (action, listenerApi) => {
        // @ts-ignore
        if (window.env.keycloak) {
            const keycloak = new Keycloak({
                // @ts-ignore
                url: window.env.keycloak.url,
                // @ts-ignore
                realm: window.env.keycloak.realm,
                // @ts-ignore
                clientId: window.env.keycloak.clientId
            });
            const authenticated = await keycloak.init({});
            if (authenticated) {
                listenerApi.dispatch(setKeycloak(keycloak));
                listenerApi.dispatch(setCredentials(keycloak.token));
            } else {
                keycloak.login();
            }
        }
        listenerApi.dispatch(setAppReady(true));
    }
})

export { loginListenerMiddleware };