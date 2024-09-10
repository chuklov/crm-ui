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
    initialize: (state) => {},
    setCredentials: (state, action) => {
      state.token = action.payload;
    },
    setKeycloak: (state, action) => {
      state.keycloak = action.payload;
      state.useKeycloak = true;
    },
    setAppReady: (state, action) => {
      state.appReady = action.payload;
    }
  }
});

export const { initialize, setCredentials, setKeycloak, setAppReady } = authSlice.actions;
export default authSlice.reducer;

export const selectCurrentToken = (state: any) => state.auth.token;
export const selectKeycloak = (state: any) => state.auth.keycloak;
export const selectUseKeycloak = (state: any) => state.auth.useKeycloak;
export const selectAppReady = (state: any) => state.auth.appReady;

const loginListenerMiddleware = createListenerMiddleware();

loginListenerMiddleware.startListening({
  actionCreator: initialize,
  effect: async (action, listenerApi) => {
      // @ts-ignore
    const keycloakEnv = window.env.keycloak;
    console.log("Keycloak environment:", keycloakEnv);

    if (keycloakEnv) {
      const keycloak = new Keycloak({
        url: keycloakEnv.url,
        realm: keycloakEnv.realm,
        clientId: keycloakEnv.clientId,
      });

      try {
        const authenticated = await keycloak.init({ onLoad: "login-required" });
        if (authenticated) {
          listenerApi.dispatch(setKeycloak(keycloak));
          listenerApi.dispatch(setCredentials(keycloak.token));
        } else {
          keycloak.login();
        }
      } catch (error) {
        console.error("Error during Keycloak initialization:", error);
      }
    }

    listenerApi.dispatch(setAppReady(true));
  }
});

export { loginListenerMiddleware };