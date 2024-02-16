import newsService from "../../services/news.service";
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
        <div className="head-titles">
          <img src={HHlogo} className="hh-logo" alt="logo" />

          <div className="subscribe">
            <h1>Subscribe</h1>
            <form onSubmit={handleSubmit}>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={handleEmailChange}
              />
              <button type="submit">Subscribe</button>
            </form>
          </div>
        </div>
        <a href="/home">Home</a>
        <a href="/contact">Contact</a>
        <a href="/home">Home</a>
        <a href="/home">Home</a>
        <a href="/home">Home</a>
      </div>
    </footer>
  );
};

export default Footer;
