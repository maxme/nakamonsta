import React, { Component } from "react";
import NakamonstaCard from "./NakamonstaCard";
import Grid from "@material-ui/core/Grid";
import { Link } from "react-router-dom";

class NakamonstaCardGrid extends Component {
  render() {
    return (
      <Grid container spacing={16}>
        {this.props.nakamonstaIds.map(n => (
          <Grid item key={n} sm={6} md={4} lg={3}>
            <Link onClick={e => this.props.onClick(e, n)} to={"/nakamonsta/" + n + "/"}>
              <NakamonstaCard key={n} nakamonstaId={n} />
            </Link>
          </Grid>
        ))}
      </Grid>
    );
  }
}

export default NakamonstaCardGrid;
