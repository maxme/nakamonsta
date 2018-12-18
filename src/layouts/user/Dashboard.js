import React, { Component } from "react";
import { drizzleConnect } from "drizzle-react";
import PropTypes from "prop-types";
import NakamonstaUserOwnedGrid from "../../components/nakamonstas/NakamonstaUserOwnedGrid";

class Dashboard extends Component {
  constructor(props, context) {
    super(props);
    this.contracts = context.drizzle.contracts;
    this.balance = null;
    this.state = {
      balance: 0
    };
    this.balanceOfKey = this.contracts.NakamonstaAuction.methods.balanceOf.cacheCall(
      this.props.accounts[0]
    );
  }

  componentDidMount() {
    this.requestAndSetState();
  }

  componentDidUpdate() {
    this.requestAndSetState();
  }

  requestAndSetState() {
    if (this.balanceOfKey in this.props.NakamonstaAuction.balanceOf && this.balance === null) {
      this.balance = this.props.NakamonstaAuction.balanceOf[this.balanceOfKey].value;
      this.setState({ balance: this.balance });
    }
  }

  render() {
    return (
      <div className="content">
        <h1>Dashboard</h1>
        You own {this.state.balance} nakamonstas
        <h2>Your Nakamonstas</h2>
        <NakamonstaUserOwnedGrid />
      </div>
    );
  }
}

Dashboard.contextTypes = {
  drizzle: PropTypes.object
};

const mapStateToProps = state => {
  return {
    accounts: state.accounts,
    NakamonstaAuction: state.contracts.NakamonstaAuction
  };
};

export default drizzleConnect(Dashboard, mapStateToProps);
