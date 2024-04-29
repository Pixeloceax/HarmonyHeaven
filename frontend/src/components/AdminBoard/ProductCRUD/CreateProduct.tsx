import React, { Component } from "react";
import IProduct from "../../../types/product.type";
import AdminService from "../../../services/AdminService";

type Props = object;

type State = {
  products: IProduct[];
};

export default class CreateProduct extends Component<Props, State> {
  constructor(props: object) {
    super(props);
    this.state = {
      products: [],
    };
  }

  fields = [
    { label: "Name", name: "name", type: "text" },
    { label: "Image", name: "image", type: "text" },
    { label: "Description", name: "description", type: "text" },
    { label: "Price", name: "price", type: "number" },
    { label: "Stock", name: "quantity", type: "number" },
    { label: "Type", name: "type", type: "text" },
    { label: "Label", name: "label", type: "text" },
    { label: "Year", name: "year", type: "number" },
    { label: "Country", name: "country", type: "text" },
    { label: "Format", name: "format", type: "text" },
    { label: "Artist", name: "artist", type: "text" },
  ];

  handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);
    const product = Object.fromEntries(formData.entries());
    try {
      await AdminService.createProduct(product);
      form.reset();
    } catch (error) {
      throw new Error("Error creating product: " + error);
    }
  };

  render() {
    return (
      <React.Fragment>
        <h2>Create Product</h2>
        <div className="board-container">
          <form onSubmit={this.handleSubmit}>
            {this.fields.map((field) => {
              return (
                <div key={field.name} className="form-group">
                  <label htmlFor={field.name}>{field.label}</label>
                  <input
                    type={field.type}
                    id={field.name}
                    name={field.name}
                    required
                    className="form-control"
                  />
                </div>
              );
            })}
            <button type="submit" className="btn btn-primary">Create Product</button>
          </form>
        </div>
      </React.Fragment>
    );
  }
}
