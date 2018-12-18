import { drizzleConnect } from "drizzle-react";
import React, { Component } from "react";
import PropTypes from "prop-types";
import moment from "moment";
import chrono from "chrono-node";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import InputAdornment from "@material-ui/core/InputAdornment";
import { withStyles } from "@material-ui/core/styles";
import { utils } from "web3";

const styles = theme => ({
  container: {},
  textField: {
    marginLeft: 0,
    marginRight: theme.spacing.unit
  },
  button: {
    marginLeft: 0,
    marginRight: theme.spacing.unit
  }
});

class CreateAuction extends Component {
  constructor(props, context) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.NakamonstaAuction = context.drizzle.contracts.NakamonstaAuction;
    this.drizzle = context.drizzle;
    this.state = {
      selling: undefined,
      duration: "48 hours",
      startPrice: 1,
      endPrice: 0.0001
    };
  }

  handleSubmit() {
    // TODO: Check inputs
    this.setState(state => {
      return {
        ...state,
        selling: true
      };
    });
    const startPrice = utils.toWei(this.state.startPrice.toString(), "ether");
    const endPrice = utils.toWei(this.state.endPrice.toString(), "ether");
    this.stackId = this.NakamonstaAuction.methods.createAuction.cacheSend(
      this.props.nakamonstaId,
      startPrice.toString(),
      endPrice.toString(),
      this.getDuration()
    );
  }

  handleInputChange(event) {
    // TODO: Check inputs
    this.setState({ [event.target.name]: event.target.value });
  }

  getDurationDate() {
    if (this.state.duration === undefined) return;
    var date = chrono.parseDate(this.state.duration);
    if (!date) {
      date = chrono.parseDate(this.state.duration + " from now");
    }
    if (!date) return;
    return date;
  }

  getDuration() {
    return Math.round((this.getDurationDate().getTime() - Date.now()) / 1000);
  }

  getDisplayDate() {
    const date = this.getDurationDate();
    const diff = moment(date).fromNow();
    const futureDate = moment(date).format("LLLL");
    return diff + " - " + futureDate;
  }

  isValidDuration() {
    return this.getDuration() > 2 * 60 * 60;
  }

  render() {
    const { classes } = this.props;
    return (
      <div style={{ marginTop: 16 }}>
        <form onSubmit={this.handleSubmit} className={classes.container}>
          <div>
            <TextField
              type="text"
              className={classes.textField}
              name="startPrice"
              label="Starting price"
              value={this.state["startPrice"]}
              onChange={this.handleInputChange}
              helperText="Price (in ether) to start the Auction"
              variant="outlined"
              margin="normal"
              required
              InputProps={{
                endAdornment: (
                  <InputAdornment variant="outlined" position="end">
                    Ξ
                  </InputAdornment>
                )
              }}
            />
            <TextField
              type="text"
              className={classes.textField}
              name="endPrice"
              label="Ending price"
              value={this.state["endPrice"]}
              onChange={this.handleInputChange}
              helperText="Price (in ether) to end the Auction"
              variant="outlined"
              margin="normal"
              required
              InputProps={{
                endAdornment: (
                  <InputAdornment variant="outlined" position="end">
                    Ξ
                  </InputAdornment>
                )
              }}
            />
          </div>
          <div>
            <TextField
              type="text"
              className={classes.textField}
              name="duration"
              label="Duration"
              error={!this.isValidDuration()} // 2 hours minimum
              value={this.state["duration"]}
              onChange={this.handleInputChange}
              helperText={
                this.isValidDuration()
                  ? this.getDisplayDate()
                  : "Auction duration must be 2 hours minimum"
              }
              variant="outlined"
              margin="normal"
              required
            />
          </div>
          <div>
            <Button
              variant="contained"
              color="primary"
              className={classes.button}
              size="large"
              margin="normal"
              onClick={this.handleSubmit}
            >
              Put it on sale
            </Button>
          </div>
        </form>
      </div>
    );
  }
}

CreateAuction.propTypes = {
  classes: PropTypes.object.isRequired
};

CreateAuction.contextTypes = {
  drizzle: PropTypes.object
};

const mapStateToProps = state => {
  return {
    contracts: state.contracts
  };
};

export default withStyles(styles)(drizzleConnect(CreateAuction, mapStateToProps));
