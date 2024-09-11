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
        initialize: state => {

        },
        setCredentials: (state, action) => {
            console.log("Setting credentials with token:", action.payload);
            state.token = action.payload;
        },
        setKeycloak: (state, action) => {
            console.log("Setting Keycloak instance:", action.payload);
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
export const selectCurrentToken = (state: any) => state.auth.token;
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
        const keycloakConfig = window.env.keycloak;

        if (keycloakConfig) {
            const keycloak = new Keycloak({
                url: keycloakConfig.url,
                realm: keycloakConfig.realm,
                clientId: keycloakConfig.clientId
            });
//         try {
            const authenticated = await keycloak.init({}).then((value) => {
            console.log("await value: " , value);
            console.log("set keycloak:" , keycloak);

                console.log("Token:", keycloak.token);
                listenerApi.dispatch(setKeycloak(keycloak));
                listenerApi.dispatch(setCredentials(keycloak.token));

                if (!value) {
                    keycloak.login();
                    }

//                 setInterval(() => {
//                     keycloak.updateToken(30) // minValidity is 30 seconds
//                         .then(refreshed => {
//                             if (refreshed) {
//                                 console.log('Token was refreshed.');
//                             } else {
//                                 console.log('Token is still valid.');
//                             }
//                         }).catch(error => {
//                         console.error('Failed to refresh token', error);
//
//                     });
//                 }, 10000);
            }).catch (Error);

//              else {
//                 console.log('User is not authenticated, redirecting to login.');
//                 keycloak.login();
//             }


        listenerApi.dispatch(setAppReady(true));
    }}
})

export { loginListenerMiddleware };