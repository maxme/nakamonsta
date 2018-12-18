import { drizzleConnect } from "drizzle-react";
import React, { Component } from "react";
import PropTypes from "prop-types";

class NakamonstaAuctionBalance extends Component {
  constructor(props, context) {
    super(props);
    this.contracts = context.drizzle.contracts;
    this.dataKey = this.contracts.NakamonstaAuction.methods.balanceOf.cacheCall(this.props.account);
  }

  render() {
    // If the data isn't here yet, show loading
    if (!(this.dataKey in this.props.NakamonstaAuction.balanceOf)) {
      return <span>Loading...</span>;
    }

    // If the data is here, get it and display it
    var data = this.props.NakamonstaAuction.balanceOf[this.dataKey].value;
    return <span>{data}</span>;
  }
}

NakamonstaAuctionBalance.contextTypes = {
  drizzle: PropTypes.object
};

const mapStateToProps = state => {
  return {
    NakamonstaAuction: state.contracts.NakamonstaAuction
  };
};

export default drizzleConnect(NakamonstaAuctionBalance, mapStateToProps);
