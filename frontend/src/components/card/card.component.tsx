import "./card.css";

interface CardProps {
  image: string;
  price: number;
  artist: string;
  album: string;
}

<<<<<<< HEAD
const Card = ({ image, price, artist, album }: CardProps) => {
=======
const card = ({ image, price, artist, album }: CardProps) => {
>>>>>>> 0b7bb2bb562b560b332f0d1f1eed284290ed7944
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

<<<<<<< HEAD
export default Card;
=======
export default card;
>>>>>>> 0b7bb2bb562b560b332f0d1f1eed284290ed7944
