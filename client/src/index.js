import React from "react";
import moment from 'moment';
import 'moment/locale/es.js';
import ReactDOM from "react-dom";
import App from "./App.js";
import { CurrentUserProvider } from '../src/components/all-contexts/currentUserContext.js'
import { CurrentUserLocationProvider } from './components/all-contexts/currentLocationContext.js';

ReactDOM.render(

  <CurrentUserProvider>
    <CurrentUserLocationProvider>
        <React.StrictMode>
          <App />
        </React.StrictMode>
    </CurrentUserLocationProvider>
  </CurrentUserProvider>,
  document.getElementById("root")
);

// Set global locale for moment (es)
moment.locale('es');
