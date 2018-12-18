import { drizzleConnect } from "drizzle-react";
import React, { Children, Component } from "react";
import PropTypes from "prop-types";
import CircularProgress from "@material-ui/core/CircularProgress";
import { withStyles } from "@material-ui/core/styles";

const styles = theme => ({
  progress: {
    margin: theme.spacing.unit * 2
  }
});

class LoadingContainer extends Component {
  render() {
    const { classes } = this.props;

    if (this.props.web3.status === "failed") {
      return (
        <main className="container loading-screen">
          <h1>⚠️</h1>
          <p>
            This browser has no connection to the Ethereum network. Please use the Chrome/FireFox
            extension MetaMask, or dedicated Ethereum browsers Mist or Parity.
          </p>
        </main>
      );
    }

    if (
      this.props.web3.status === "initialized" &&
      this.props.web3.networkId >= 100 &&
      Object.keys(this.props.accounts).length !== 0 &&
      this.props.drizzleStatus.initialized
    ) {
      return Children.only(this.props.children);
    }

    if (this.props.web3.status === "initialized" && this.props.web3.networkId <= 100) {
      return (
        <main className="container loading-screen">
          <h1>⚠️</h1>
          <p>
            You must connect to a local development network. Contracts haven&#39;t been deployed on
            testnet or mainet yet.
          </p>
        </main>
      );
    }

    if (this.props.web3.status === "initialized" && this.props.web3.networkId === undefined) {
      return (
        <main className="container loading-screen">
          <h1>⚠️</h1>
          <p>
            It seems that the dAPP cannot connect to the ethereum network. Check Metamask is pointed
            to the right server.
          </p>
        </main>
      );
    }

    return (
      <main className="container loading-screen">
        <CircularProgress className={classes.progress} />
        <p>Loading...</p>
      </main>
    );
  }
}

LoadingContainer.contextTypes = {
  drizzle: PropTypes.object
};

const mapStateToProps = state => {
  return {
    accounts: state.accounts,
    drizzleStatus: state.drizzleStatus,
    web3: state.web3,
    drizzle: state.drizzle
  };
};

export default withStyles(styles)(drizzleConnect(LoadingContainer, mapStateToProps));
