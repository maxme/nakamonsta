import { drizzleConnect } from "drizzle-react";
import React, { Component } from "react";
import Button from "@material-ui/core/Button";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import utils from "web3-utils";

export const USER_LOGGED_IN = "USER_LOGGED_IN";

class SignUpOrProfileButton extends Component {
  constructor(props, context) {
    super(props);
    this.contracts = context.drizzle.contracts;
    if (this.props.user.data === null) {
      this.dataKey = this.contracts.Authentication.methods.login.cacheCall();
    }
    this.state = {
      loginAttempted: false
    };
  }

  userLoggedIn(user) {
    return {
      type: USER_LOGGED_IN,
      payload: user
    };
  }

  componentDidUpdate() {
    const { user } = this.props;

    if (user && user.data && user.data.name) return;

    if (!(this.dataKey in this.props.Authentication.login)) {
      return;
    }

    var data = this.props.Authentication.login[this.dataKey].value;

    if (data) {
      const name = utils.toUtf8(data);
      this.props.store.dispatch(this.userLoggedIn({ name: name }));
    }
  }

  render() {
    const { user } = this.props;

    var view = (
      <Button color="inherit" component={Link} to="/signup/">
        SignUp
      </Button>
    );
    if (user && user.data && user.data.name) {
      view = (
        <Button color="inherit" component={Link} to="/profile/">
          {"Profile: " + user.data.name}
        </Button>
      );
    }
    return view;
  }
}

SignUpOrProfileButton.contextTypes = {
  drizzle: PropTypes.object
};

const mapStateToProps = state => {
  return {
    Authentication: state.contracts.Authentication,
    user: state.user
  };
};

export default drizzleConnect(SignUpOrProfileButton, mapStateToProps);
