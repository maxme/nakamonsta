import { drizzleConnect } from "drizzle-react";
import React, { Component } from "react";
import PropTypes from "prop-types";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";

class CancelAuctionButton extends Component {
  constructor(props, context) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.NakamonstaAuction = context.drizzle.contracts.NakamonstaAuction;
    this.drizzle = context.drizzle;
    this.state = {
      cancelling: undefined
    };
  }

  handleSubmit() {
    this.setState(state => {
      return {
        ...state,
        cancelling: true
      };
    });
    this.stackId = this.NakamonstaAuction.methods.cancelAuction.cacheSend(this.props.nakamonstaId);
  }

  checkTransactionStatus() {
    const state = this.drizzle.store.getState();
    const txHash = state.transactionStack[this.stackId];
    if (txHash) {
      if (state.transactions[txHash].status == "success") {
        this.setState({ cancelling: false });
      }
    }
  }

  componentWillReceiveProps() {
    this.checkTransactionStatus();
  }

  render() {
    return (
      <Button
        style={{ marginTop: 8 }}
        variant="contained"
        color="primary"
        size="large"
        onClick={this.handleSubmit}
      >
        Cancel Auction
        {this.state.cancelling ? (
          <CircularProgress variant="indeterminate" color="secondary" />
        ) : null}
      </Button>
    );
  }
}

CancelAuctionButton.contextTypes = {
  drizzle: PropTypes.object
};

const mapStateToProps = state => {
  return {
    contracts: state.contracts
  };
};

export default drizzleConnect(CancelAuctionButton, mapStateToProps);
