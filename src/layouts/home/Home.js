import React, { Component } from "react";
import { ContractData } from "drizzle-react-components";
import classNames from "classnames";
import { drizzleConnect } from "drizzle-react";
import { withStyles } from "@material-ui/core/styles";
import NakamonstaCardGrid from "../../components/nakamonstas/NakamonstaCardGrid";

const styles = theme => ({
  layout: {
    width: "auto"
  },
  cardGrid: {
    padding: `${theme.spacing.unit * 8}px 0`
  }
});

class Home extends Component {
  render() {
    const { classes } = this.props;
    const { NakamonstaAuction } = this.props;
    return (
      <React.Fragment>
        <main className="content">
          <div>
            <div className={classes.layout}>
              <div>
                <h1>Nakamonsta tokens</h1>
              </div>
              <div>
                Total Supply:{" "}
                <ContractData
                  contract="NakamonstaAuction"
                  method="totalSupply"
                  methodArgs={[{ from: this.props.accounts[0] }]}
                />{" "}
                nakamonstas
              </div>
            </div>

            <div className={classNames(classes.layout, classes.cardGrid)}>
              <NakamonstaCardGrid
                NakamonstaAuction={NakamonstaAuction}
                nakamonstaIds={[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]}
              />
            </div>
          </div>
        </main>
      </React.Fragment>
    );
  }
}

// May still need this even with data function to refresh component on updates for this contract.
const mapStateToProps = state => {
  return {
    accounts: state.accounts,
    NakamonstaAuction: state.contracts.NakamonstaAuction
  };
};

export default drizzleConnect(withStyles(styles)(Home), mapStateToProps);
