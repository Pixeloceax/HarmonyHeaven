import { useState, useEffect } from 'react';
import axios from 'axios';
import authHeader from '../../services/auth-header';
import './Order.css';
import CheckoutForm from './CheckoutForm';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
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
  const [address, setAddress] = useState('');
  const [orderState, setOrderState] = useState<OrderState>({
    orderItems: [],
    totalPrice: 0,
    idOrder: 0,
  });

  useEffect(() => {
    const fetchOrder = async (): Promise<void> => {
      try {
        const response = await axios.get<OrderResponse>(`${BACKEND_URL}${GET_ORDER}`, { headers: authHeader() });
        if (Array.isArray(response.data.order)) {
          setOrderState({
            orderItems: response.data.order,
            totalPrice: calculateTotalPrice(response.data.order),
            idOrder: response.data.idOrder,
          });
          if (response.data.address) {
            setAddress(response.data.address);
          }
        } else {
          console.error('Invalid order data:', response.data);
        }
      } catch (error) {
        console.error('Error fetching order:', error);
      }
    };

    fetchOrder();
  }, []);

  const calculateTotalPrice = (orderItems: OrderItem[]) => {
    if (!Array.isArray(orderItems)) {
      throw new Error('orderItems is not an array');
    }

    return orderItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const handlePaymentSuccess = (response: any) => {
    console.log('Payment successful:', response);
    // Traitez le paiement réussi ici
    axios.post(`${BACKEND_URL}${UPDATE_STATUTS}/${orderState.idOrder}`, null, { headers: authHeader() });
    toast.success('Paiement effectué. Merci pour votre achat.')
    //Rediriger ( vers l'historique des commandes par exemple )
  };

  const handlePaymentError = (error: any) => {
    console.error('Payment error:', error);
    // Traitez l'erreur de paiement ici
    toast.error('Un problème est survenu.')
  };

  return (
    <div className='order-container'>
      <h1>Passer commande</h1>
      {orderState.orderItems.map((item, index) => (
        <div className='command-list-container' key={index}>
          <div className="command-info-container">
            <img src={item.img} alt={item.product} />
            <div className='command-info'>
              <h2>{item.product}</h2>
              <h3>{item.price}€/u</h3>
            </div>
          </div>
          <div className="command-actions">
            <select id={`quantity-dropdown-${item.id}`} className="quantity-dropdown" value={item.quantity}>
              {[...Array(10)].map((_, i) => (
                <option key={i + 1} value={i + 1}>{i + 1}</option>
              ))}
            </select>
            <button>Remove</button>
          </div>
        </div>
      ))}
      <div className='total-price-container'>
      <h2 className='total-price'>Total : {+(orderState.totalPrice.toFixed(2))} €</h2>
      </div>

      <h2 className='delivery-address'>Adresse de livraison</h2>
      <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} />

      <Elements stripe={stripePromise}>
        <CheckoutForm
          amount={orderState.totalPrice * 100}
          description="Commande de produits"
          onSuccess={handlePaymentSuccess}
          onError={handlePaymentError}
        />
      </Elements>
    </div>
  );
};

export default Order
