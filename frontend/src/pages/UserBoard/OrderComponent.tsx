import React, { Component } from "react";

type Props = object;

type State = {
  error: string | null;
};

export default class OrderComponent extends Component<Props, State> {
  constructor(props: object) {
    super(props);
    this.state = {
      error: null,
    };
  }

  render() {
    return (
      <React.Fragment>
        <div className="container">
          <header className="jumbotron">
            <h3>
              <strong>Order</strong>
            </h3>
          </header>
        </div>
      </React.Fragment>
    );
  }
}
