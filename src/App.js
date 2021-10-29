import * as React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";

import Home from "./pages/Home";
import Wallet from "./pages/Wallet";

export default function App() {
  return (
    <Router>
      <Switch>
        <Route path="/home">
          <Home />
        </Route>
        <Route path="/wallet/:symbol">
          <Wallet />
        </Route>
        <Redirect from="/" to="/home"></Redirect>
      </Switch>
    </Router>
  );
}
