import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Button from "@material-ui/core/Button";
import { Link } from "react-router-dom";
import { withStyles } from "@material-ui/core/styles";
import React, { Component } from "react";
import SignUpOrProfileButton from "./SignUpOrProfileButton";

const styles = theme => ({
  appBar: {
    position: "relative"
  },
  grow: {
    flexGrow: 1
  },
  icon: {
    marginRight: theme.spacing.unit * 2
  }
});

class TopBar extends Component {
  render() {
    const { classes } = this.props;

    return (
      <AppBar position="static" className={classes.appBar}>
        <Toolbar>
          <Button color="inherit" component={Link} to="/">
            Home
          </Button>
          <span className={classes.grow} />
          <Button color="inherit" component={Link} to="/market/">
            Market Place
          </Button>
          <Button color="inherit" component={Link} to="/dashboard/">
            Your Nakamonstas
          </Button>
          <SignUpOrProfileButton />
        </Toolbar>
      </AppBar>
    );
  }
}

export default withStyles(styles)(TopBar);
