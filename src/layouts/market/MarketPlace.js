import React, { Component } from "react";
import { drizzleConnect } from "drizzle-react";
import { withStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";
import NakamonstaCardGrid from "../../components/nakamonstas/NakamonstaCardGrid";

const styles = theme => ({
  layout: {
    width: "auto"
  },
  cardGrid: {
    padding: `${theme.spacing.unit * 8}px 0`
  }
});

class MarketPlace extends Component {
  constructor(props, context) {
    super(props);
    this.contracts = context.drizzle.contracts;
    this.state = {
      ids: []
    };
    this.dataKey = this.contracts.NakamonstaAuction.methods.getAllTokensAuctioned.cacheCall();
  }

  componentDidMount() {
    this.requestAndSetState();
  }

  componentDidUpdate() {
    this.requestAndSetState();
  }

  requestAndSetState() {
    if (
      this.dataKey in this.props.NakamonstaAuction.getAllTokensAuctioned &&
      this.state.ids.length === 0
    ) {
      const data = this.props.NakamonstaAuction.getAllTokensAuctioned[this.dataKey].value;
      const ids = Object.values(data).map(e => e);
      this.setState({ ids: ids });
    }
  }

  render() {
    const { classes } = this.props;
    const { NakamonstaAuction } = this.props;

    return (
      <div className="content">
        <h2>Nakamonstas on sale</h2>
        <div className={classes.cardGrid}>
          <NakamonstaCardGrid
            NakamonstaAuction={NakamonstaAuction}
            nakamonstaIds={this.state.ids}
          />
        </div>
      </div>
    );
  }
}

MarketPlace.contextTypes = {
  drizzle: PropTypes.object
};

// May still need this even with data function to refresh component on updates for this contract.
const mapStateToProps = state => {
  return {
    accounts: state.accounts,
    NakamonstaAuction: state.contracts.NakamonstaAuction
  };
};

export default drizzleConnect(withStyles(styles)(MarketPlace), mapStateToProps);
