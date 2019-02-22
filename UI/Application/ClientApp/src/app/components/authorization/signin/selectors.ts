import { createSelector } from "@ngrx/store";
import { RootStore } from "../../../reducers";
import { SigninState } from "./reducer";

const getModule = (state: RootStore) => state.signin;

const getError = (state: SigninState) => state.error;

export const selectSigninError = createSelector(getModule, getError);
