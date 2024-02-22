import React, { Component } from "react";

type Props = object;

type State = {
  error: string | null;
};

export default class PrintBillComponent extends Component<Props, State> {
  state = {
    error: null,
  };

  render() {
    return <div>PrintBillComponent</div>;
  }
}
