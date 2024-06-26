/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import {
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import axios from "axios";
import "./CheckoutForm.css";
import authHeader from "../../services/AuthHeader";
import Loader from "../loader/loader.component";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const PAY_URL = import.meta.env.VITE_PAY;

interface CheckoutFormProps {
  amount: number;
  description: string;
  address: string;
  onSuccess: (response: any) => void;
  onError: (error: any) => void;
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({
  amount,
  description,
  address,
  onSuccess,
  onError,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsProcessing(true);

    try {
      const customerName = (event.target as any).name.value;
      if (!customerName) {
        throw new Error("Please provide a name.");
      }

      const response = await axios.post(
        `${BACKEND_URL}${PAY_URL}`,
        { amount, description, customerName, address },
        { headers: authHeader() }
      );
      const { clientSecret } = response.data;

      const result = await stripe?.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements!.getElement(CardNumberElement)!,
          billing_details: {
            name: customerName,
          },
        },
      });

      if (result?.error) {
        throw new Error(result.error.message);
      }

      onSuccess(result);
    } catch (error) {
      onError(error);
    }

    setIsProcessing(false);
  };

  return (
    <form className="pay-form" onSubmit={handleSubmit}>
      {isProcessing && <Loader />}
      <div className="card-element-container">
        <span className="card-info">Card number</span>
        <CardNumberElement
          className="CardNumberElement"
          options={{ style: { base: { color: "#FFFFFF" } } }}
        />
        <div id="card-errors-number" className="error"></div>
      </div>
      <div className="mid-fields">
        <div className="card-element-container">
          <span className="card-info">Expiration date</span>
          <CardExpiryElement
            className="CardExpiryElement"
            options={{ style: { base: { color: "#FFFFFF" } } }}
          />
          <div id="card-errors-expiry" className="error"></div>
        </div>
        <div className="card-element-container">
          <span className="card-info">CVV</span>
          <CardCvcElement
            className="CardCvcElement"
            options={{ style: { base: { color: "#FFFFFF" } } }}
          />
          <div id="card-errors-cvc" className="error"></div>
        </div>
      </div>
      <div className="card-element-container">
        <span className="card-info">Name on the card</span>
        <div className="input-customer-name-container">
          <input
            type="text"
            name="name"
            className="customer-name"
            placeholder="A.Martin"
          />
        </div>
        <div id="card-errors-name" className="error"></div>
      </div>
      <button className="submit-button">Process to payment</button>
    </form>
  );
};

export default CheckoutForm;
