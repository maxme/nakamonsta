import React, { Component } from "react";
import { drizzleConnect } from "drizzle-react";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import PropTypes from "prop-types";
import { utils } from "web3";
import NakamonstaCard from "../../components/nakamonstas/NakamonstaCard";
import NakamonstaPicker from "../../components/nakamonstas/NakamonstaPicker";

export const USER_UPDATED = "USER_UPDATED";

class Reproduction extends Component {
  constructor(props, context) {
    super(props);
    this.state = {};
    this.NakamonstaAuction = context.drizzle.contracts.NakamonstaAuction;
    this.drizzle = context.drizzle;
    this.motherId = this.props.match.params.motherId;
    this.fatherId = this.props.match.params.fatherId;
    this.state = { fatherId: undefined, babyId: undefined, mating: false };
  }

  onClick(event, n) {
    this.setState({ fatherId: n });
    event.preventDefault();
  }

  handleSubmit() {
    // TODO: Check inputs
    this.setState(state => {
      return {
        ...state,
        mating: true
      };
    });
    const matingPrice = utils.toWei("0.01", "ether");
    this.stackId = this.NakamonstaAuction.methods.mate.cacheSend(this.motherId, this.fatherId, {
      value: matingPrice
    });
  }

  fatherOrPicker() {
    this.fatherId = this.state.fatherId ? this.state.fatherId : this.fatherId;
    if (this.fatherId === undefined) {
      return (
        <Grid item>
          Father:
          <NakamonstaPicker
            onClick={this.onClick.bind(this)}
            pickerCallback={this.nakamonstaPicked}
          />
        </Grid>
      );
    }
    return (
      <Grid item>
        Father:
        <NakamonstaCard nakamonstaId={this.fatherId} />
      </Grid>
    );
  }

  checkTransactionStatus() {
    const state = this.drizzle.store.getState();
    const txHash = state.transactionStack[this.stackId];
    if (txHash) {
      // TODO: if transaction is rejected/error reset the state
      if (
        state.transactions[txHash].receipt &&
        "NakamonstaBirth" in state.transactions[txHash].receipt.events
      ) {
        const babyId = state.transactions[txHash].receipt.events.NakamonstaBirth.returnValues[0];
        this.setState(state => {
          return { ...state, babyId: babyId };
        });
      }
    }
  }

  componentWillReceiveProps() {
    this.checkTransactionStatus();
  }

  displayActionButtonOrBaby() {
    if (this.state.babyId === undefined) {
      return (
        <Button
          variant="contained"
          color="primary"
          size="large"
          margin="normal"
          style={{ marginTop: "40px" }}
          disabled={this.fatherId === undefined || this.motherId === undefined}
          onClick={this.handleSubmit.bind(this)}
        >
          Give them some privacy (brrr)!
        </Button>
      );
    }
    return (
      <Grid style={{ marginTop: "40px" }} container spacing={16}>
        <Grid item>
          A new baby is born, let them rest.
          <NakamonstaCard nakamonstaId={this.state.babyId} />
        </Grid>
      </Grid>
    );
  }

  render() {
    return (
      <div className="content">
        <h1>Reproduction</h1>
        <Grid container spacing={16}>
          <Grid item>
            Mother:
            <NakamonstaCard nakamonstaId={this.motherId} />
          </Grid>
          {this.fatherOrPicker()}
        </Grid>

        {this.displayActionButtonOrBaby()}
      </div>
    );
  }
}

Reproduction.contextTypes = {
  drizzle: PropTypes.object
};

const mapStateToProps = state => {
  return {
    NakamonstaAuction: state.contracts.NakamonstaAuction,
    accounts: state.accounts
  };
};

export default drizzleConnect(Reproduction, mapStateToProps);
