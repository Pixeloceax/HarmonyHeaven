import { Component } from "react";
import Loader from "../../components/loader/loader.component";
import Checkbox from "../../components/checkbox/checkbox.component";

import "./debug.css";

const fontSizes = [
  "12px",
  "14px",
  "16px",
  "18px",
  "20px",
  "24px",
  "28px",
  "32px",
  "36px",
  "40px",
  "48px",
  "56px",
  "64px",
  "72px",
];
const fontWeights = ["normal", "bold"];

interface State {
  fontWeight: string[];
}

export default class Debug extends Component<Record<string, never>, State> {
  constructor(props: Record<string, never>) {
    super(props);
    this.state = {
      fontWeight: Array(fontSizes.length).fill("normal"),
    };
  }

  changeFontWeight = (index: number, weight: string) => {
    const newFontWeights = [...this.state.fontWeight];
    newFontWeights[index] = weight;
    this.setState({ fontWeight: newFontWeights });
  };

  render() {
    return (
      <div className="debug-container">
        <h1>DEBUG PAGE</h1>
        <br />
        <br />
        <li className="link-li">
          <a href="/debug" className="link-effect">
            LINK
          </a>
        </li>
        <Loader />
        <Checkbox />


        <div>
          {fontSizes.map((size, index) => (
            <div key={index}>
              <div
                className="font-test"
                style={{
                  fontSize: size,
                  fontWeight: this.state.fontWeight[index],
                }}
              >
                DIVING INTO THE unknown with a font size of {size}
              </div>
              {fontWeights.map((weight, weightIndex) => (
                <button
                  key={weightIndex}
                  onClick={() => this.changeFontWeight(index, weight)}
                >
                  Set to {weight}
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }
}
