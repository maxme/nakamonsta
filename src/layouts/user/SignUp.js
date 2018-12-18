import React, { Component } from "react";
import { drizzleConnect } from "drizzle-react";
import ContractForm from "../../components/drizzle/ContractForm";

class SignUp extends Component {
  render() {
    const { user } = this.props;
    const hello = user.data && user.data.name ? <span>Hello {user.data.name}! </span> : null;
    // TODO: redirect if logged in
    return (
      <div className="content">
        <h1>Sign Up</h1>
        <p>
          {hello}We&#39;ve got your wallet information, simply input your name and your account is
          made!
        </p>
        <ContractForm contract="Authentication" method="signup" labels={["Name"]} />
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    accounts: state.accounts,
    Authentication: state.contracts.Authentication,
    user: state.user
  };
};

export default drizzleConnect(SignUp, mapStateToProps);
