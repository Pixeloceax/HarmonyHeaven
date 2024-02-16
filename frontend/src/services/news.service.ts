import axios from "axios";

class NewsService {
  private readonly BACKEND_URL = "http://localhost:8000";
  private readonly SUBSCRIBE_EMAIL = "/subscribe-email";

  async subscribeEmail(email: string) {
    try {
      const response = await axios.post(
        `${this.BACKEND_URL}${this.SUBSCRIBE_EMAIL}`,
        { email }
      );
      return response.data;
    } catch (error) {
      console.error("Error subscribing email:", error);
      throw error;
    }
  }
}

export default new NewsService();
