import { withTranslation, WithTranslation } from "react-i18next";
import HHlogo from "../../assets/icons/png/LOGO sans texte.png";
import newsService from "../../services/NewsService";
import { FormEvent, useState } from "react";
import React from "react"; 
import "./footer.css";

interface Props extends WithTranslation {}

const Footer: React.FC<Props> = ({ t }) => {
  const [email, setEmail] = useState<string>("");

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value); 
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await newsService.subscribeEmail(email);
      console.log("Email subscribed successfully");
      setEmail("");
    } catch (error) {
      console.error("Error subscribing email:", error);
    }
  };

  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="footer-titles">
          <img src={HHlogo} className="hh-logo" alt="logo" />
          <div className="form-section">
            <h2>{t("Newsletter")}</h2>
            <form onSubmit={handleSubmit}>
              <input
                className="newsForm"
                type="email"
                placeholder={t("Enter your email")}
                value={email}
                onChange={handleEmailChange}
              />
              <button className="newsButton" type="submit">
                <p>{t("Subscribe")}</p>
              </button>
            </form>
            <h3 className="privacy">
              {t("By subscribing you agree to with our")}
              <a href="policy" target="_blank">
                {t("Privacy Policy")}
              </a>
            </h3>
          </div>
        </div>
        <a href="/home">{t("Home")}</a>
        <a href="/contact">{t("Contact")}</a>
        <a href="/home">{t("Home")}</a>
        <a href="/home">{t("Home")}</a>
        <a href="/home">{t("Home")}</a>
      </div>
      <div className="footer-bot">
        <div className="about-us">
          <div>
            <a href="" target="_">
              {t("Privacy Policy")}
            </a>
            <a href="" target="_">
              {t("Term of Service")}
            </a>
            <a href="" target="_">
              {t("Cookie Settings")}
            </a>
          </div>
          <p>© 2024 Harmony Heaven. {t("All rights reserved.")}</p>
        </div>
      </div>
    </footer>
  );
};

export default withTranslation()(Footer);