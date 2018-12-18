import React, { Component } from "react";
import { drizzleConnect } from "drizzle-react";
import NakamonstaCardGrid from "../../components/nakamonstas/NakamonstaCardGrid";
import { withStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";

const styles = theme => ({
  cardGrid: {
    padding: `${theme.spacing.unit * 8}px 0`
  }
});
const MAX_PER_PAGE = 20;

class NakamonstaUserOwnedGrid extends Component {
  constructor(props, context) {
    super(props);
    this.contracts = context.drizzle.contracts;
    this.state = {
      balance: 0,
      ids: []
    };
    this.balance = null;
    this.keys = {};
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

    if (this.balance !== null) {
      this.keys[0] = "";
      this.requestsWaiting = Math.min(MAX_PER_PAGE, this.balance);
      for (var i = 0; i < this.requestsWaiting; i++) {
        this.keys[i] = this.contracts.NakamonstaAuction.methods.tokenOfOwnerByIndex.cacheCall(
          this.props.accounts[0],
          i
        );
      }
    }

    if (
      this.props.NakamonstaAuction.tokenOfOwnerByIndex &&
      this.keys[0] in this.props.NakamonstaAuction.tokenOfOwnerByIndex &&
      Object.keys(this.props.NakamonstaAuction.tokenOfOwnerByIndex).length ==
        this.requestsWaiting &&
      this.state.ids.length === 0
    ) {
      const ids = Object.values(this.props.NakamonstaAuction.tokenOfOwnerByIndex).map(e =>
        Number(e.value)
      );

      this.setState({ ids: ids });
    }
  }

  render() {
    const { classes } = this.props;
    const { NakamonstaAuction } = this.props;

    return (
      <div className="content">
        <div className={classes.cardGrid}>
          <NakamonstaCardGrid
            NakamonstaAuction={NakamonstaAuction}
            nakamonstaIds={this.state.ids}
            onClick={this.props.onClick}
          />
        </div>
      </div>
    );
  }
}

NakamonstaUserOwnedGrid.contextTypes = {
  drizzle: PropTypes.object
};

const mapStateToProps = state => {
  return {
    accounts: state.accounts,
    NakamonstaAuction: state.contracts.NakamonstaAuction
  };
};

export default drizzleConnect(withStyles(styles)(NakamonstaUserOwnedGrid), mapStateToProps);
