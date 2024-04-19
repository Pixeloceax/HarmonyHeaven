import newsService from "../../services/NewsService";
import "./footer.css";
import { FormEvent, useState } from "react";
import HHlogo from "../../assets/icons/png/LOGO sans texte.png";

const Footer: React.FC = () => {
  const [email, setEmail] = useState<string>("");

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await newsService.subscribeEmail(email);
      console.log("Email subscribed successfully");
      // Clear the email field after successful subscription
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
            <h2>Subscribe</h2>
            <form onSubmit={handleSubmit}>
              <input
                className="newsForm"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={handleEmailChange}
              />
              <button className="newsButton" type="submit">
                <p>Subscribe</p>
              </button>
            </form>
            <h3 className="privacy">
              By subscribing you agree to with our&nbsp;
              <a href="policy" target="_blank">
                Privacy Policy
              </a>
            </h3>
          </div>
        </div>
        <a href="/home">Home</a>
        <a href="/contact">Contact</a>
        <a href="/home">Home</a>
        <a href="/home">Home</a>
        <a href="/home">Home</a>
      </div>
      <div className="footer-bot">
        <div className="about-us">
          <div>
            <a href="" target="_">
              Privacy Policy
            </a>
            <a href="" target="_">
              Term of Service
            </a>
            <a href="" target="_">
              Cookie Settings
            </a>
          </div>
          <p>© 2024 Harmony Heaven. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
