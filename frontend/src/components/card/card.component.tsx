import "./card.css";

interface CardProps {
  image: string;
  price: number | undefined;
  artist: string | undefined;
  album: string | undefined;
}

const Card = ({ image, price, artist, album }: CardProps) => {

  return (
    <>
      <div className="card-container">
        <div className="card-content">
          <img src={image} alt="product-image" style={{ width: "100%" }} />
          <div className="card-flex">
            <h3 className="card-artist">{artist}</h3>
            <h3 className="card-price">{price}€</h3>
          </div>
          <div className="card-album">{album}</div>
        </div>
      </div>
    </>
  );
};

export default Card;

