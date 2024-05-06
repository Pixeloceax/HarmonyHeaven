/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import axios from "axios";
import AuthHeader from "../../services/AuthHeader";
import "./Order.css";
import CheckoutForm from "./CheckoutForm";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import UserService from "../../services/UserService";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const GET_ORDER = import.meta.env.VITE_GET_ORDER;
const UPDATE_STATUTS = import.meta.env.VITE_UPDATE_STATUTS;
const stripeApiKey = import.meta.env.VITE_STRIPE_API_KEY;
const stripePromise = loadStripe(stripeApiKey);

interface OrderItem {
  product: string;
  quantity: number;
  img: string;
  price: number;
  id: number;
}

interface OrderResponse {
  order: OrderItem[];
  address?: string;
  idOrder: number;
}

interface OrderState {
  orderItems: OrderItem[];
  totalPrice: number;
  idOrder: number;
}

const Order = () => {
  const [address, setAddress] = useState("");
  const [rememberAddress, setRememberAddress] = useState(false);
  const [orderState, setOrderState] = useState<OrderState>({
    orderItems: [],
    totalPrice: 0,
    idOrder: 0,
  });

  const now = new Date();
  const deliveryDate = new Date(now.getTime());
  deliveryDate.setDate(now.getDate() + 2);
  const deliveryDateString = deliveryDate.toLocaleString('fr-FR', {
    weekday: 'long',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });

  useEffect(() => {
    const fetchOrder = async (): Promise<void> => {
      try {
        const response = await axios.get<OrderResponse>(
          `${BACKEND_URL}${GET_ORDER}`,
          { headers: AuthHeader() }
        );
        if (Array.isArray(response.data.order)) {
          setOrderState({
            orderItems: response.data.order,
            totalPrice: calculateTotalPrice(response.data.order),
            idOrder: response.data.idOrder,
          });
          console.log('adresse avant de vérif si existe :', response.data.address)
          if (response.data.address) {
            setAddress(response.data.address);
            console.log('adresse après vérif si existe et mis ds state:', response.data.address)
          }
        } else {
          console.error("Invalid order data:", response.data);
        }
      } catch (error) {
        console.error("Error fetching order:", error);
      }
    };

    fetchOrder();
  }, []);

  const calculateTotalPrice = (orderItems: OrderItem[]) => {
    if (!Array.isArray(orderItems)) {
      throw new Error("orderItems is not an array");
    }

    return orderItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  const handlePaymentSuccess = (response: any) => {
    console.log("Payment successful:", response);
    // Traitez le paiement réussi ici
    axios.post(
      `${BACKEND_URL}${UPDATE_STATUTS}/${orderState.idOrder}`,
      {
        address: address,
      },
      {
        headers: AuthHeader(),
      }
    );

    if (rememberAddress) {
      UserService.updateUserBoard(address); // Passer l'adresse en tant que chaîne de caractères
    }

    toast.success("Paiement effectué. Merci pour votre achat.");
    //Rediriger ( vers l'historique des commandes par exemple )
  };

  const handlePaymentError = (error: any) => {
    console.error("Payment error:", error);

    if (error.response && error.response.status === 401) {
      toast.error(error.response.data.error);
    } else {
      toast.error("Un problème est survenu lors du paiement.");
    }
  };

  return (
    <div className="order-container">
      <h1>Passer commande</h1>
      {orderState.orderItems.map((item, index) => (
        <div className="command-list-container" key={index}>
          <div className="command-info-container">
            <img src={item.img} alt={item.product} />
            <div className="command-info">
              <h2>{item.product}</h2>
              <h3>{item.price}€/u</h3>
            </div>
          </div>
          <div className="command-actions">
            <select
              id={`quantity-dropdown-${item.id}`}
              className="quantity-dropdown"
              value={item.quantity}
            >
              {[...Array(10)].map((_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1}
                </option>
              ))}
            </select>
            <button className="remove-btn btn-default">Remove</button>
          </div>
        </div>
      ))}
      <div className="total-price-container">
        <h2 className="total-price">
          Total : {+orderState.totalPrice.toFixed(2)} €
        </h2>
      </div>

      <div className="separator" />

      <div className="delivery-container">
        <div className="delivery-address-container">
          <div className="delivery-address-header-container">
            <h4 className="delivery-address">Adresse de livraison</h4>
            <input
              type="text"
              className="form-control"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>
          <div className="remember-address-container">
            <input
              type="checkbox"
              checked={rememberAddress}
              onChange={(e) => setRememberAddress(e.target.checked)}
            />
            <h5>Choisir cette adresse comme addresse de livraison pour mes futurs achats</h5>
          </div>
        </div>
        
        <h4 className="delivery-date">Livraison prévue le <em>{deliveryDateString}</em></h4>
      </div>

      <div className="separator" />

      <Elements stripe={stripePromise}>
        <CheckoutForm
          amount={orderState.totalPrice * 100}
          description="Commande de produits"
          address={address}
          onSuccess={handlePaymentSuccess}
          onError={handlePaymentError}
        />
      </Elements>
    </div>
  );
};

export default Order;
