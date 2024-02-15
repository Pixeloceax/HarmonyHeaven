import { Component } from "react";
import IGenre from "../../types/genre.type";
import axios from "axios";
import "./Home.css";
import { FaSearch } from "react-icons/fa";

type Props = object;
type State = {
  searchQuery: string;
  selectedGenre: string | null;
  genres: IGenre[] | null;
  divCount: 6;
};

export default class Home extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      searchQuery: "",
      selectedGenre: null,
      genres: null,
      divCount: 6,
    };
  }

  componentDidMount() {
    this.fetchGenres();
  }

  async fetchGenres() {
    try {
      const response = await axios.get<IGenre[]>(
        "http://127.0.0.1:8000/genres-list"
      );
      console.log("ici", response);
      this.setState({ genres: response.data });
    } catch (error) {
      console.error("Error fetching genres:", error);
    }
  }

  handleGenreSelect = (genre: string | undefined) => {
    this.setState({ selectedGenre: genre ?? null });
  };

  handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log("Submitted search query:", this.state.searchQuery);
    console.log("Selected genre:", this.state.selectedGenre);
  };

  render() {
    const { genres } = this.state;
    return (
      <>
        <main className="mainSection">
          <section className="homeSection">
            <div className="content">
              <h1 className="HHVinyl">
                <p>
                  EXCEPTIONAL <br />
                  VINYLS
                  <br />
                  <br />
                  HARMONY <br />
                  HEAVEN
                </p>
              </h1>
            </div>
          </section>
          <section className="secondSection">
            <div className="midSection">
              <h1 className="newsHeading">NEWS & HOT</h1>
              <div className="inputSection">
                <select
                  className="genre-buttons"
                  value={this.state.selectedGenre || ""}
                  onChange={(e) => this.handleGenreSelect(e.target.value)}
                >
                  <option value="" disabled>
                    Genres
                  </option>
                  {genres &&
                    genres.map((genre) => (
                      <option key={genre.id} value={genre.name}>
                        {genre.name}
                      </option>
                    ))}
                </select>
                <form onSubmit={this.handleSubmit}>
                  <label>
                    <input
                      className="search-bar"
                      type="text"
                      value={this.state.searchQuery}
                      onChange={(e) =>
                        this.setState({ searchQuery: e.target.value })
                      }
                    />
                  </label>
                  <button className="submit-search" type="submit">
                    <FaSearch />
                  </button>
                </form>
              </div>
            </div>
          </section>
        </main>
      </>
    );
  }
}
