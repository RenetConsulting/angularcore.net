import { createSelector } from "@ngrx/store";
import { SigninState, SigninStore } from "./reducer";

const getModule = (state: SigninStore) => state.signin;

const getError = (state: SigninState) => state.error;

export const selectSigninError = createSelector(getModule, getError);