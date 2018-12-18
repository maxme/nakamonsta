import { withStyles } from "@material-ui/core/styles";
import React, { Component } from "react";
import * as genetics from "../../util/genetics";

const styles = () => ({
  container: {
    width: "200px",
    height: "200px",
    position: "relative",
    zIndex: 0
  },
  bodyPart: {
    width: "200px",
    height: "200px",
    position: "absolute",
    zIndex: 1,
    bottom: 0,
    right: 0
  }
});

class NakamonstaImage extends Component {
  getBodyImage(genes) {
    return "/assets/body" + genetics.getBodyType(genes) + ".png";
  }

  getEyesImage(genes) {
    return "/assets/eyes" + genetics.getEyesType(genes) + ".png";
  }

  getMouthImage(genes) {
    return "/assets/mouth" + genetics.getMouthType(genes) + ".png";
  }

  getEarsImage(genes) {
    return "/assets/ears" + genetics.getEarsType(genes) + ".png";
  }

  render() {
    const { classes, genes } = this.props;

    return (
      <div className={classes.container}>
        <img className={classes.bodyPart} src={this.getBodyImage(genes)} />
        <img className={classes.bodyPart} src={this.getEyesImage(genes)} />
        <img className={classes.bodyPart} src={this.getMouthImage(genes)} />
        <img className={classes.bodyPart} src={this.getEarsImage(genes)} />
        <img className={classes.bodyPart} src="/assets/ground.png" />
      </div>
    );
  }
}

export default withStyles(styles)(NakamonstaImage);
