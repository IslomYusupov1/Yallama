import { Persistor, persistStore } from "redux-persist";
import { applyMiddleware, compose, createStore, Store } from "redux";

import { AppStoreState, rootReducer } from "./RootReducer";

export type AppStore = Store<AppStoreState>;

export interface StoreProps {
  readonly store: AppStore;
  readonly persistor: Persistor;
}

export function configureStore(): StoreProps {
  const store = createStore<AppStoreState, any, any, any>(
    rootReducer as any,
    compose(applyMiddleware()),
  );

  const persistor = persistStore(store);

  return {
    store,
    persistor,
  };
}
