import { drizzleConnect } from "drizzle-react";
import React, { Component } from "react";
import PropTypes from "prop-types";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

class ContractForm extends Component {
  constructor(props, context) {
    super(props);

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    this.contracts = context.drizzle.contracts;
    this.utils = context.drizzle.web3.utils;

    // Get the contract ABI
    const abi = this.contracts[this.props.contract].abi;

    this.inputs = [];
    var initialState = {};

    // Iterate over abi for correct function.
    for (var i = 0; i < abi.length; i++) {
      if (abi[i].name === this.props.method) {
        this.inputs = abi[i].inputs;
        for (var j = 0; j < this.inputs.length; j++) {
          initialState[this.inputs[j].name] = "";
        }
        break;
      }
    }
    this.state = initialState;
  }

  handleSubmit(event) {
    event.preventDefault();
    const convertedInputs = this.inputs.map(input => {
      if (input.type === "bytes32") {
        return this.utils.toHex(this.state[input.name]);
      }
      return this.state[input.name];
    });

    if (this.props.sendArgs) {
      return this.contracts[this.props.contract].methods[this.props.method].cacheSend(
        ...convertedInputs,
        this.props.sendArgs
      );
    }

    return this.contracts[this.props.contract].methods[this.props.method].cacheSend(
      ...convertedInputs
    );
  }

  handleInputChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  translateType(type) {
    switch (true) {
      case /^uint/.test(type):
        return "number";
      case /^string/.test(type) || /^bytes/.test(type):
        return "text";
      case /^bool/.test(type):
        return "checkbox";
      default:
        return "text";
    }
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        {this.inputs.map((input, index) => {
          var inputType = this.translateType(input.type);
          var inputLabel = this.props.labels ? this.props.labels[index] : input.name;
          // check if input type is struct and if so loop out struct fields as well
          return (
            <TextField
              key={input.name}
              type={inputType}
              name={input.name}
              label={inputLabel}
              value={this.state[input.name]}
              onChange={this.handleInputChange}
              variant={this.props.variant ? this.props.variant : "outlined"}
            />
          );
        })}
        <br />
        <Button
          style={{ marginTop: 8 }}
          variant="contained"
          color="primary"
          size="large"
          onClick={this.handleSubmit}
        >
          {this.props.submitLabel ? this.props.submitLabel : "Submit"}
        </Button>
      </form>
    );
  }
}

ContractForm.contextTypes = {
  drizzle: PropTypes.object
};

const mapStateToProps = state => {
  return {
    contracts: state.contracts
  };
};

export default drizzleConnect(ContractForm, mapStateToProps);
