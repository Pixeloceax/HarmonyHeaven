import React, { Component } from "react";
import "./AboutPage.css"

export default class AboutPage extends Component {
  render() {
    return (
      <React.Fragment>
        <div
          style={{
            display: "flex",
            justifyContent: "space-around",
            alignItems: "center",
            height: "100vh",
          }}
        >
          <div>
            <h2>Contact Us</h2>
            <form
              style={{
                display: "flex",
                flexDirection: "column",
                width: "620",
                height: "700",
              }}
            >
              <div className="form-group">
                <label>
                  Name:
                  <input type="text" name="name" className="form-control" />
                </label>
              </div>
              <div className="form-group">
                <label>
                  Email:
                  <input type="text" name="email" className="form-control" />
                </label>
              </div>
              <div className="form-group">
                <label>
                  Message:
                  <textarea name="message" />
                </label>
              </div>
              <br />
              <label className="agreement-container">
                <input type="checkbox" name="I accept the Terms" />
                <p>J'ai lu et j'accepte les <a href=""> conditions générales d'utilisation</a></p>
              </label>
              <input type="submit" value="Submit" className="btn btn-primary" />
            </form>
          </div>
          <div>
            <h2>Our Location</h2>
            <iframe
              width="620"
              height="700"
              style={{ border: 0 }}
              loading="lazy"
              allowFullScreen
              src={`https://placehold.co/620x700`}
            ></iframe>
          </div>
        </div>
      </React.Fragment>
    );
  }
}
