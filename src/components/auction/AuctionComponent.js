import { drizzleConnect } from "drizzle-react";
import React, { Component } from "react";
import moment from "moment";
import PropTypes from "prop-types";
import { calculateCurrentPrice } from "../../util/auction";
import BuyAuctionButton from "../../components/auction/BuyAuctionButton";
import CancelAuctionButton from "../../components/auction/CancelAuctionButton";
import { utils } from "web3";

const MULTIPLIER = 105;

class AuctionComponent extends Component {
  constructor(props, context) {
    super(props);
    this.contracts = context.drizzle.contracts;
    this.dataKey = this.contracts.NakamonstaAuction.methods.auctionByTokenId.cacheCall(
      this.props.nakamonstaId
    );
    this.state = {
      startDate: undefined
    };
  }

  componentWillMount() {
    // Update state if the call has been cached already
    if (this.dataKey in this.props.NakamonstaAuction.auctionByTokenId) {
      this.updateState();
    }
  }

  componentDidUpdate() {
    this.updateState();
  }

  updateState() {
    if (!(this.dataKey in this.props.NakamonstaAuction.auctionByTokenId) || this.state.startDate) {
      return;
    }
    const data = this.props.NakamonstaAuction.auctionByTokenId[this.dataKey].value;
    var state = {
      owner: data.owner,
      startDate: new utils.BN(data.startDate),
      duration: new utils.BN(data.duration),
      startPrice: new utils.BN(data.startPrice),
      endPrice: new utils.BN(data.endPrice)
    };

    const currentPrice = calculateCurrentPrice(
      state.startPrice,
      state.endPrice,
      state.startDate,
      state.duration
    );
    state["currentPrice"] = currentPrice;
    this.setState(state);
  }

  getDisplayDate() {
    if (!this.state.startDate) {
      return "...";
    }
    return moment(1000 * (this.state.startDate.toNumber() + this.state.duration.toNumber())).format(
      "LLL"
    );
  }

  getDisplayRemainingTime() {
    if (!this.state.startDate) {
      return "...";
    }
    return moment(
      1000 * (this.state.startDate.toNumber() + this.state.duration.toNumber())
    ).fromNow();
  }

  getInflatedPrice() {
    return this.state.currentPrice
      ? this.state.currentPrice.mul(new utils.BN(MULTIPLIER)).div(new utils.BN(100))
      : 0;
  }

  getDisplayPrice() {
    // Add some % to the price, in case the transaction takes too long.
    // The remaining will be sent back to the buyer.
    if (this.state.currentPrice === undefined) return "...";
    const ethPrice = utils.fromWei(this.state.currentPrice, "ether");
    return Number(ethPrice).toPrecision(5) + " eth";
  }

  isOwner() {
    return this.state.owner === this.props.accounts[0];
  }

  render() {
    return (
      <div style={{ marginTop: 16 }}>
        This Nakamonsta is for sale!
        <ul>
          <li>
            Sale is ending {this.getDisplayRemainingTime()} ({this.getDisplayDate()})
          </li>
          <li>Current price: {this.getDisplayPrice()}</li>
        </ul>
        {!this.isOwner() ? (
          <BuyAuctionButton
            nakamonstaId={this.props.nakamonstaId}
            price={this.getInflatedPrice()}
          />
        ) : (
          <CancelAuctionButton nakamonstaId={this.props.nakamonstaId} />
        )}
      </div>
    );
  }
}

AuctionComponent.contextTypes = {
  drizzle: PropTypes.object
};

const mapStateToProps = state => {
  return {
    NakamonstaAuction: state.contracts.NakamonstaAuction,
    contracts: state.contracts,
    accounts: state.accounts
  };
};

export default drizzleConnect(AuctionComponent, mapStateToProps);
