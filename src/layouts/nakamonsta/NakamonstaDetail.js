import React, { Component } from "react";
import { drizzleConnect } from "drizzle-react";
import PropTypes from "prop-types";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import { Link } from "react-router-dom";
import NakamonstaCard from "../../components/nakamonstas/NakamonstaCard";
import CreateAuction from "../../components/auction/CreateAuction";
import AuctionComponent from "../../components/auction/AuctionComponent";

export const USER_UPDATED = "USER_UPDATED";

class NakamonstaDetail extends Component {
  constructor(props, context) {
    super(props);
    this.state = {};
    this.nakamonstaId = this.props.match.params.id;
    this.drizzle = context.drizzle;
    this.contracts = context.drizzle.contracts;
    this.ownerOfKey = this.contracts.NakamonstaAuction.methods.ownerOf.cacheCall(
      this.props.match.params.id
    );
    this.isTokenAuctionedKey = this.contracts.NakamonstaAuction.methods.isTokenAuctioned.cacheCall(
      this.props.match.params.id
    );
  }

  componentWillMount() {
    // Update state if the call has been cached already
    if (this.ownerOfKey in this.props.NakamonstaAuction.ownerOf) {
      this.updateState(true);
    }
  }

  componentWillReceiveProps() {
    this.updateState(true);
  }

  componentDidUpdate() {
    this.updateState(false);
  }

  updateState(forceValue) {
    if (
      this.ownerOfKey in this.props.NakamonstaAuction.ownerOf &&
      (forceValue || this.state.isOwner === undefined)
    ) {
      const owner = this.props.NakamonstaAuction.ownerOf[this.ownerOfKey].value;
      this.setState(state => {
        return { ...state, isOwner: this.props.accounts[0] === owner };
      });
    }
    if (
      this.isTokenAuctionedKey in this.props.NakamonstaAuction.isTokenAuctioned &&
      (forceValue || this.state.tokenAuctioned === undefined)
    ) {
      const b = this.props.NakamonstaAuction.isTokenAuctioned[this.isTokenAuctionedKey].value;
      this.setState(state => {
        return {
          ...state,
          tokenAuctioned: b
        };
      });
    }
  }

  auctionDisplay() {
    if (this.state.isOwner === undefined || this.state.tokenAuctioned === undefined) {
      return null;
    }
    return (
      <div>
        {this.state.isOwner && !this.state.tokenAuctioned ? (
          <div>
            <h2>Auction</h2>
            <CreateAuction nakamonstaId={this.nakamonstaId} />
          </div>
        ) : null}
        {this.state.tokenAuctioned ? (
          <div>
            <h2>Auction</h2>
            <AuctionComponent nakamonstaId={this.nakamonstaId} />
          </div>
        ) : (
          <div />
        )}
      </div>
    );
  }

  matingDisplay() {
    if (this.state.tokenAuctioned === undefined || !this.state.isOwner) {
      return null;
    }
    return (
      <div>
        <h2>Reproduction</h2>
        <Button
          variant="contained"
          color="primary"
          size="large"
          margin="normal"
          component={Link}
          to={"/reproduction/" + this.nakamonstaId}
        >
          Mate with
        </Button>
      </div>
    );
  }

  render() {
    return (
      <div className="content">
        <h1>Nakamonsta</h1>
        <Grid container spacing={16}>
          <Grid item>
            <NakamonstaCard detailed={true} nakamonstaId={this.nakamonstaId} />
          </Grid>
        </Grid>
        {this.auctionDisplay()}
        {this.matingDisplay()}
      </div>
    );
  }
}

NakamonstaDetail.contextTypes = {
  drizzle: PropTypes.object
};

const mapStateToProps = state => {
  return {
    NakamonstaAuction: state.contracts.NakamonstaAuction,
    accounts: state.accounts
  };
};

export default drizzleConnect(NakamonstaDetail, mapStateToProps);
