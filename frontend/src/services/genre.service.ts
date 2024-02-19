import axios from "axios";
import IGenre from "../types/genre.type";

class genreService {
  private readonly BACKEND_URL = "http://localhost:8000";
  private readonly GENRES_LIST = "/genres-list";

  async getGenres() {
    try {
      const response = await axios.get<IGenre[]>(
        `${this.BACKEND_URL}${this.GENRES_LIST}`
      );
      return response.data;
    } catch (err) {
      throw new Error(err as string);
    }
  }
}

export default new genreService();
