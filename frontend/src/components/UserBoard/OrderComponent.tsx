import React, { useEffect, useState } from "react";
import AuthService from "../../services/AuthService";
import axios from "axios";
import AuthHeader from "../../services/AuthHeader";

type Order = {
  id: number;
  status: number;
  total: number;
  "tracking-details": string;
  "delivery-date": {
    date: string;
    timezone_type: number;
    timezone: string;
  };
  "order-detail": {
    product: string;
    img: string;
    quantity: number;
    price: number;
  }[];
};

const getOrderStatus = (status: number) => {
  switch (status) {
    case 1:
      return "En cours de livraison";
    case 2:
      return "Livrée";
    default:
      return "Statut inconnu";
  }
};

const getStatusColor = (status: number) => {
  switch (status) {
    case 1:
      return "#ff5400";
    case 2:
      return "#1e9e45";
    default:
      return "gray";
  }
};

const formatDate = (date: string) => {
  const year = date.substring(0, 4);
  const month = date.substring(5, 7);
  const day = date.substring(8, 10);
  return `${day}/${month}/${year}`;
};

const OrderComponent = () => {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const user = await AuthService.getCurrentUser();
        if (user) {
          console.log(user);
          const response = await axios.get(
            `http://localhost:8000/order-historic`,
            {
              headers: AuthHeader(),
            }
          );
          console.log("historique commande : ", response);
          setOrders(response.data);
        }
      } catch (err) {
        console.log(err);
      }
    };

    fetchCurrentUser();
  }, []);

  return (
    <React.Fragment>
      <div className="order-historic-container">
        {orders.map((order: Order) => (
          <React.Fragment key={order.id}>
            <div className="order-historic-header">
              <h3>Numéro de commande • {order["tracking-details"]}</h3>
              <div className="delivery-date-container">
                Date de livraison : {formatDate(order["delivery-date"].date)}
              </div>
            </div>
            <div key={order.id} className="single-order-container">
              <div
                className="status-label"
                style={{ backgroundColor: getStatusColor(order.status) }}
              >
                {getOrderStatus(order.status)}
              </div>
              {order["order-detail"].map(
                (detail: Order["order-detail"][0], index: number) => (
                  <React.Fragment key={detail.product}>
                    <li className="command-details-info-container">
                      <img src={detail.img} alt={detail.product} />
                      <div className="single-item-info">
                        <div>
                          {detail.product} x{detail.quantity}
                        </div>
                        <div>{detail.price.toFixed(2)}€</div>
                      </div>
                    </li>
                    {index < order["order-detail"].length - 1 && (
                      <div className="separator" />
                    )}
                  </React.Fragment>
                )
              )}

              <div className="separator"></div>
              <div className="total-container">
                <h3>Total :</h3> {order.total.toFixed(2)}€
              </div>
            </div>
          </React.Fragment>
        ))}
      </div>
    </React.Fragment>
  );
};

export default OrderComponent;
