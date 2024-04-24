import axios from "axios";
import IGenre from "../types/genre.type";

class genreService {
  private readonly BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  private readonly GENRES_LIST = import.meta.env.VITE_PUBLIC_GENRES;

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
