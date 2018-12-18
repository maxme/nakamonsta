/*eslint no-undef: "off"*/

import React, { Component } from "react";
import Card from "@material-ui/core/Card";
import Grid from "@material-ui/core/Grid";
import CardContent from "@material-ui/core/CardContent";
import { withStyles } from "@material-ui/core/styles";
import { drizzleConnect } from "drizzle-react";
import PropTypes from "prop-types";
import * as genetics from "../../util/genetics";
import NakamonstaImage from "./NakamonstaImage";
import { utils } from "web3";

const styles = theme => ({
  main: {
    backgroundColor: theme.palette.backgroundColor
  },
  card: {
    height: "100%"
  },
  cardDisabled: {
    height: "100%",
    backgroundColor: "#eee"
  },
  zzzContainer: {
    textAlign: "right",
    paddingRight: 50
  },
  zzz: {
    position: "absolute"
  },
  image: {
    margin: "auto",
    textAlign: "center"
  },
  details: {
    marginLeft: "16px"
  }
});

class NakamonstaCard extends Component {
  constructor(props, context) {
    super(props);
    this.contracts = context.drizzle.contracts;
    if (this.props.nakamonstaId !== undefined) {
      this.dataKey = this.contracts.NakamonstaAuction.methods.nakamonstas.cacheCall(
        this.props.nakamonstaId
      );
    }
  }

  getDetailedInfo(nakamonsta) {
    const genesBN = new utils.BN(nakamonsta.genes);
    return (
      <div>
        <div>Name: {nakamonsta.name}</div>
        <div>Id: {this.props.nakamonstaId}</div>
        <div>
          Genes: <code>{genetics.bigNumberToHexPadded(genesBN, 64).slice(0, 26)}</code>
        </div>
        <div>
          BodyType: <code>{utils.toHex(genetics.getBodyType(nakamonsta.genes))}</code>
        </div>
        <div>
          ColorPattern: <code>{utils.toHex(genetics.getColorPattern(nakamonsta.genes))}</code>
        </div>
        <div>
          EyesType: <code>{utils.toHex(genetics.getEyesType(nakamonsta.genes))}</code>
        </div>
        <div>
          MouthType: <code>{utils.toHex(genetics.getMouthType(nakamonsta.genes))}</code>
        </div>
        <div>
          EarsType: <code>{utils.toHex(genetics.getEarsType(nakamonsta.genes))}</code>
        </div>
      </div>
    );
  }

  isNakamonstaReady(nakamonsta) {
    // TODO: We should use the contract view method instead of doing this
    return Date.now() / 1000 >= nakamonsta.readyDate;
  }

  mysteryNakamonsta() {
    const { classes } = this.props;
    return (
      <Card className={classes.cardDisabled}>
        <CardContent>
          <Grid container direction="row" justify="flex-start" alignItems="center">
            <Grid item className={classes.image}>
              <NakamonstaImage genes={0} />
              <span>{this.props.label ? this.props.label : "???"}</span>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    );
  }

  render() {
    const { classes } = this.props;
    if (this.props.nakamonstaId === undefined) {
      return this.mysteryNakamonsta();
    }

    if (!(this.dataKey in this.props.NakamonstaAuction.nakamonstas)) {
      return <span>Loading...</span>;
    }

    // If the data is here, get it and display it
    const nakamonsta = this.props.NakamonstaAuction.nakamonstas[this.dataKey].value;
    if (!nakamonsta) {
      return this.mysteryNakamonsta();
    }
    const isReady = this.isNakamonstaReady(nakamonsta);
    return (
      <Card className={isReady ? classes.card : classes.cardDisabled}>
        <CardContent>
          <Grid container direction="row" justify="flex-start" alignItems="center">
            <Grid item className={classes.image}>
              {isReady ? null : (
                <div className={classes.zzzContainer}>
                  <img className={classes.zzz} width="40" src="/assets/sleeping-zzz.png" />
                </div>
              )}
              <NakamonstaImage genes={nakamonsta.genes} />
              {this.props.detailed ? null : <span>{nakamonsta.name}</span>}
            </Grid>
            {this.props.detailed ? (
              <Grid item xs className={classes.details}>
                {this.getDetailedInfo(nakamonsta)}
              </Grid>
            ) : null}
          </Grid>
        </CardContent>
      </Card>
    );
  }
}

NakamonstaCard.contextTypes = {
  drizzle: PropTypes.object
};

const mapStateToProps = state => {
  return {
    NakamonstaAuction: state.contracts.NakamonstaAuction
  };
};

export default drizzleConnect(withStyles(styles)(NakamonstaCard), mapStateToProps);
