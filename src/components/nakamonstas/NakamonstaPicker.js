import React, { Component } from "react";
import { drizzleConnect } from "drizzle-react";
import PropTypes from "prop-types";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import { withStyles } from "@material-ui/core/styles";
import NakamonstaCard from "./NakamonstaCard";
import NakamonstaUserOwnedGrid from "./NakamonstaUserOwnedGrid";

const styles = theme => ({
  paper: {
    backgroundColor: theme.palette.background.paper
  }
});

class NakamonstaPicker extends Component {
  constructor(props) {
    super(props);
    this.state = { open: false };
  }

  onClick(event, n) {
    event.preventDefault();
    this.props.onClick(event, n);
    this.setState({ open: false });
  }

  handleOpen() {
    this.setState({ open: true });
  }

  handleClose() {
    this.setState({ open: false });
  }

  render() {
    const { classes } = this.props;
    return (
      <div>
        <a onClick={this.handleOpen.bind(this)} href="#">
          <NakamonstaCard label="Pick..." />
        </a>
        <Dialog
          aria-labelledby="scroll-dialog-title"
          open={this.state.open}
          fullWidth
          maxWidth="lg"
          onClose={this.handleClose.bind(this)}
          scroll="paper"
        >
          <DialogTitle>Pick the father from your nakamonstas</DialogTitle>
          <DialogContent>
            <div className={classes.paper}>
              <NakamonstaUserOwnedGrid onClick={this.onClick.bind(this)} />
            </div>
          </DialogContent>
        </Dialog>
      </div>
    );
  }
}

NakamonstaPicker.contextTypes = {
  drizzle: PropTypes.object
};

// May still need this even with data function to refresh component on updates for this contract.
const mapStateToProps = state => {
  return {
    accounts: state.accounts,
    NakamonstaAuction: state.contracts.NakamonstaAuction
  };
};

export default drizzleConnect(withStyles(styles)(NakamonstaPicker), mapStateToProps);
