import React from "react";
import ReactDOM from "react-dom";
import { Router, Route } from "react-router";
import { Provider } from "react-redux";
import { DrizzleProvider } from "drizzle-react";

// Layouts
import App from "./App";
import Home from "./layouts/home/Home";
import Dashboard from "./layouts/user/Dashboard";
import SignUp from "./layouts/user/SignUp";
import Profile from "./layouts/user/Profile";
import NakamonstaDetail from "./layouts/nakamonsta/NakamonstaDetail";
import Reproduction from "./layouts/nakamonsta/Reproduction";
import MarketPlace from "./layouts/market/MarketPlace";

import LoadingContainer from "./components/LoadingContainer";
import TopBar from "./components/TopBar";

// Store
import { history, store } from "./store";
import drizzleOptions from "./drizzleOptions";
import { UserIsNotAuthenticated } from "./util/wrappers";

ReactDOM.render(
  <DrizzleProvider options={drizzleOptions} store={store}>
    <Provider store={store}>
      <LoadingContainer>
        <Router history={history} component={App}>
          <div>
            <TopBar />
            <Route exact path="/" component={Home} />
            <Route exact path="/dashboard/" component={Dashboard} />
            <Route exact path="/signup/" component={UserIsNotAuthenticated(SignUp)} />
            <Route exact path="/profile/" component={Profile} />
            <Route exact path={"/nakamonsta/:id/"} component={NakamonstaDetail} />
            <Route exact path={"/market/"} component={MarketPlace} />
            <Route exact path={"/reproduction/:motherId/"} component={Reproduction} />
            <Route exact path={"/reproduction/:motherId/:fatherId/"} component={Reproduction} />
            <div style={{ display: "none" }}>Footer</div>
          </div>
        </Router>
      </LoadingContainer>
    </Provider>
  </DrizzleProvider>,
  document.getElementById("root")
);
