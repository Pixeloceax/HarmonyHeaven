/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { suite } from "vitest";
import GenreService from "../../src/services/GenreService";

const BACKEND_URL = (import.meta as any).env.VITE_BACKEND_URL;
const GENRES_LIST = (import.meta as any).env.VITE_PUBLIC_GENRES;

const mock = new MockAdapter(axios);

suite("genreService", (test) => {
  test("should fetch genres from the backend", async () => {
    const genres = [
      { id: 1, name: "Action" },
      { id: 2, name: "Drama" },
    ];

    mock.onGet(`${BACKEND_URL}${GENRES_LIST}`).reply(200, genres);

    const result = await GenreService.getGenres();

    return JSON.stringify(result) === JSON.stringify(genres);
  });

  test("should throw an error if fetching genres fails", async () => {
    mock.onGet(`${BACKEND_URL}${GENRES_LIST}`).reply(500);

    try {
      await GenreService.getGenres();
      return false;
    } catch (err) {
      return true;
    }
  });
});
