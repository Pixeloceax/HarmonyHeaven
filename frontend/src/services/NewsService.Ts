import axios from "axios";

class NewsService {
  private readonly BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  private readonly SUBSCRIBE_EMAIL = import.meta.env
    .VITE_PUBLIC_SUBSCRIBE_EMAIL;

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
