import React, { Component } from "react";
import { withTranslation, WithTranslation } from "react-i18next";

interface Props extends WithTranslation {}

class AboutPage extends Component {
  constructor(props: Props) {
    super(props);
    this.state = {};
  }
  render() {
    const { t } = this.props;
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
            <h2>{t("Contact Us")}</h2>
            <form
              style={{
                display: "flex",
                flexDirection: "column",
                width: "620",
                height: "700",
              }}
            >
              <label>
                {t("Name")}:
                <input type="text" name="name" />
              </label>
              <label>
                Email:
                <input type="text" name="email" />
              </label>
              <label>
                Message:
                <textarea name="message" />
              </label>
              <br />
              <label>
                <input type="checkbox" name="I accept the Terms" />
              </label>
              <input type="submit" value="Submit" />
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
export default withTranslation()(AboutPage);
