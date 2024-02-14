import { Action } from "redux";
import { DELETE, update } from "immupdate";
import { PersistConfig } from "redux-persist";

import { AppStoreState } from "@/store/RootReducer";
import { createReducer, createRootReducer, PerformAction } from "@/utils/ReducerUtils";

export const authReducerPersistConfig: Partial<PersistConfig<AuthReducerState>> = {
  whitelist: ["token", "refreshToken"],
};

interface SetTokenMeta {
  readonly token: string;
}
interface SetRefreshTokenMeta {
  readonly refreshToken: string;
}

enum ReducerActions {
  SetToken = "Auth/SetToken",
  SetRefreshToken = "Auth/SetRefreshToken",
  ResetToken = "Auth/ResetToken",
}

export interface AuthReducerState {
  readonly token?: string;
  readonly refreshToken?: string;
}

function getState(): AuthReducerState {
  return {};
}

export const authReducer = createRootReducer<AuthReducerState>(
  getState(),

  createReducer([ReducerActions.SetToken], (state, { meta }) =>
    update(state, { token: meta.token}),
  ),
  createReducer([ReducerActions.SetRefreshToken], (state, { meta }) =>
    update(state, { refreshToken: meta.refreshToken }),
  ),

  createReducer([ReducerActions.ResetToken], (state) =>
    update(state, { token: DELETE }),
  ),
);

// ==================
// Selectors
// ==================

export function tokenSelector(state: AppStoreState): string | undefined {
  return state.auth.token;
}

export function refreshTokenSelector(state: AppStoreState): string | undefined {
  return state.auth.refreshToken;
}


// ==================
// Actions
// ==================

export function setToken(meta: SetTokenMeta): PerformAction<SetTokenMeta> {
  return { meta, type: ReducerActions.SetToken };
}

export function setRefreshToken(meta: SetRefreshTokenMeta): PerformAction<SetRefreshTokenMeta> {
  return { meta, type: ReducerActions.SetRefreshToken };
}
export function resetToken(): Action {
  return { type: ReducerActions.ResetToken };
}
