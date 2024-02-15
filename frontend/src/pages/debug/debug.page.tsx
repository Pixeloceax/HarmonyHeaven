import { Component } from "react";
import Loader from "../../components/loader/loader.component";
import Checkbox from "../../components/checkbox/checkbox.component";
import Card from "../../components/card/card.component";

import "./debug.css";
export default class Debug extends Component {
  render() {
    return (
      <div className="debug-container">
        <Loader />
        <Checkbox />
        <div className="debug-card">
          {[...Array(6)].map((_, i) => (
            <Card
              key={i}
              image="https://upload.wikimedia.org/wikipedia/en/d/df/Gorillaz_Demon_Days.PNG"
              price={20}
              artist="Gorillaz"
              album="Demon Days"
            />
          ))}
        </div>
      </div>
    );
  }
}
