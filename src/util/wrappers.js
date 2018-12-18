import { routerActions } from "react-router-redux";
import { connectedReduxRedirect } from "redux-auth-wrapper/history4/redirect";
import locationHelperBuilder from "redux-auth-wrapper/history4/locationHelper";

const locationHelper = locationHelperBuilder({});

// Layout Component Wrappers

export const UserIsAuthenticated = connectedReduxRedirect({
  redirectPath: "/",
  authenticatedSelector: state => state.user.data !== null,
  redirectAction: routerActions.replace,
  wrapperDisplayName: "UserIsAuthenticated"
});

export const UserIsNotAuthenticated = connectedReduxRedirect({
  authenticatedSelector: state => state.user !== null && state.user.data === null,
  redirectAction: routerActions.replace,
  redirectPath: (state, ownProps) => locationHelper.getRedirectQueryParam(ownProps) || "/dashboard",
  wrapperDisplayName: "UserIsNotAuthenticated",
  allowRedirectBack: false
});
