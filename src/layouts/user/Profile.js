import React, { Component } from "react";
import ContractForm from "../../components/drizzle/ContractForm";
import { drizzleConnect } from "drizzle-react";
import utils from "web3-utils";

export const USER_UPDATED = "USER_UPDATED";

class Profile extends Component {
  userUpdated(user) {
    return {
      type: USER_UPDATED,
      payload: user
    };
  }

  componentDidUpdate() {
    const { user } = this.props;
    const { login } = this.props.Authentication;
    if (login && Object.keys(login).length !== 0) {
      const name = utils.toUtf8(login[Object.keys(login)[0]].value);
      if (user && user.data && name !== user.data.name) {
        this.props.dispatch(this.userUpdated({ name: name }));
      }
    }
  }

  render() {
    const { user } = this.props;
    const hello = user.data && user.data.name ? <span>Hello {user.data.name}! </span> : null;
    return (
      <div className="content">
        <h1>Profile</h1>
        <p>{hello}You can update your profile on this page.</p>
        <ContractForm contract="Authentication" method="update" labels={["Name"]} />
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    Authentication: state.contracts.Authentication,
    user: state.user
  };
};

export default drizzleConnect(Profile, mapStateToProps);
