import React from 'react';
import ReactDOM from 'react-dom';
import {
  BrowserRouter as Router, Redirect, Route, Switch,
} from "react-router-dom";
import App from './App';
import Auth from './components/Auth';
import * as serviceWorker from './serviceWorker';
import CssBaseline from "@material-ui/core/CssBaseline";
import {SWRConfig} from "swr";
import fetch from "unfetch";

ReactDOM.render(
  <React.Fragment>
    <CssBaseline />
    <Router>
      <Switch>
        <Route path="/auth/:authCode">
          <SWRConfig
            value={{
              refreshInterval: 0,
              shouldRetryOnError: true,
              fetcher: (resource, init) => fetch(resource, init).then(res => res.json())
            }}
          >
          <Auth />
          </SWRConfig>
        </Route>
        <Route path={["/conversation/:conversationID", "/conversation"]}>
          <SWRConfig
            value={{
              refreshInterval: 0,
              shouldRetryOnError: false,
              fetcher: (resource, init) => fetch(resource, init).then(res => res.json())
            }}
          >
          <App />
          </SWRConfig>
        </Route>
        <Route path="/">
          <Redirect to="/conversation" />
        </Route>
      </Switch>
    </Router>
  </React.Fragment>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
