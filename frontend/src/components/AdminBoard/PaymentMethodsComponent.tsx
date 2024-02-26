import React, { Component } from "react";

type Props = object;

type State = {
  error: string | null;
};

export default class PaymentMethodsComponent extends Component<Props, State> {
  state = {
    error: null,
  };

  render() {
    return <React.Fragment>PaymentMethodsComponent</React.Fragment>;
  }
}
