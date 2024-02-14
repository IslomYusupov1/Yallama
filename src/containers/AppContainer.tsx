// import {Provider} from "react-redux";
// import {setupStore} from "../store/store";
// import {persistStore} from "redux-persist";
// import {PersistGate} from "redux-persist/integration/react";
// import RootContainer from "./RootContainer";

// import "../assets/ind.css";
// import "react-toastify/dist/ReactToastify.css";

import RootContainer from "@/containers/RootContainer";
import {Provider} from "react-redux";
import {PersistGate} from "redux-persist/integration/react";
import {configureStore} from "@/store/configureStore";
import {useMemo} from "react";

function AppContainer() {
    const store = useMemo(() => configureStore(), []);
    return (
        <Provider store={store.store}>
            <PersistGate persistor={store.persistor}>
                <RootContainer />
            </PersistGate>
        </Provider>
    )
}

export default AppContainer

