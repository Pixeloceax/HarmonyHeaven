import { Component } from "react";
import "./vinyls.css";

type Props = object;
type State = {
  divCount: 6;
};

export default class Vinyls extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      divCount: 6,
    };
  }

  render() {
    const { divCount } = this.state;
    const divs = Array.from({ length: divCount }, (_, index) => (
      <div key={index} className="child-div">
        <img
          src={`https://source.unsplash.com/300x300/?vinyl,records&sig=${index}`}
          alt={`Burger ${index + 1}`}
        />
      </div>
    ));
    return (
      <>
        <section>
          <div className="vinyls-section">{divs}</div>
        </section>
      </>
    );
  }
}
