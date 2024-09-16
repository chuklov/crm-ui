//  authSlice.ts
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
            //console.log("set credentials is: ", action.payload);
            state.token = action.payload;
        },
        setKeycloak: (state, action) => {
            //console.log("set keycloak is: ", action.payload);
            state.keycloak = action.payload;
            state.useKeycloak = true;
        },
        setAppReady: (state, action) => {
            //console.log("set application ready is: ", action.payload);
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
        //console.log('middle ware: ', action.payload);
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
            //console.log('Keycloak is: ', keycloak);

            const authenticated = await keycloak.init({
                    onLoad: 'login-required',
                    checkLoginIframe: false,
                    });
            //console.log('Is authenticated?: ', authenticated);
            if (authenticated) {
                console.log('User is authenticated');
                listenerApi.dispatch(setKeycloak(keycloak));
                listenerApi.dispatch(setCredentials(keycloak.token));
                listenerApi.dispatch(setAppReady(true));
            } else {
                console.log('User is NOT authenticated');
                keycloak.login();
                listenerApi.dispatch(setAppReady(false));
            }
        }

    }
})

export { loginListenerMiddleware };