import React, { Component } from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import IGenre from "../../types/genre.type";
import GenreService from "../../services/GenreService";
import "./Home.css";
import { FaSearch } from "react-icons/fa";

interface Props extends WithTranslation {}
interface State {
  searchQuery: string;
  selectedGenre: string | null;
  genres: IGenre[] | null;
  divCount: 6;
}

class Home extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      searchQuery: "",
      selectedGenre: null,
      genres: null,
      divCount: 6,
    };
  }

  async componentDidMount() {
    try {
      const genre = await GenreService.getGenres();
      if (!genre) {
        throw new Error("No genres found");
      }
      this.setState({ genres: genre });
    } catch (err) {
      throw new Error(err as string);
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
    const { t } = this.props;

    return (
      <>
        <main className="mainSection">
          <section className="homeSection">
            <div className="content">
              <h1 className="HHVinyl">
                <p>
                  {t("EXCEPTIONAL")} <br />
                  {t("VINYLS")}
                  <br />
                  <br />
                  {t("HARMONY")}  <br />
                  {t("HEAVEN")} 
                </p>
              </h1>
            </div>
          </section>
          <section className="secondSection">
            <div className="midSection">
              <h1 className="newsHeading">{t("NEWS & HOT")}</h1>
              <div className="inputSection">
                <select
                  className="genre-buttons"
                  value={this.state.selectedGenre || ""}
                  onChange={(e) => this.handleGenreSelect(e.target.value)}
                >
                  <option value="" disabled>
                    {t("Genres")}
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

export default withTranslation()(Home); 
