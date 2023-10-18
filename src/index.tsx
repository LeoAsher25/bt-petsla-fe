import "bootstrap/dist/css/bootstrap.min.css";
import React, { Suspense } from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import "react-toastify/dist/ReactToastify.css";
import { store } from "./stores/rootReducer";
import App from "./App";
import "./index.scss";
import reportWebVitals from "./reportWebVitals";
import Loading from "src/components/Loading";
import "src/config";
import { toast, ToastContainer } from "react-toastify";

ReactDOM.render(
  <React.StrictMode>
    <Suspense fallback={<Loading />}>
      <Provider store={store}>
        <App />
        <ToastContainer position={toast.POSITION.TOP_RIGHT} autoClose={2500} />
      </Provider>
    </Suspense>
  </React.StrictMode>,
  document.getElementById("root")
);

reportWebVitals();
