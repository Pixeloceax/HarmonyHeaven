import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import IUser from "../../../types/user.type";
import adminService from "../../../services/admin.service";
import Loader from "../../loader/loader.component";

const UpdateUser = () => {
  const { userId } = useParams();
  const [user, setUser] = useState<IUser | null>(null);
  const [changes, setChanges] = useState<Partial<IUser>>({});

  const fields = [
    { label: "Name", name: "name", type: "text" },
    { label: "Email", name: "user", type: "text" },
    { label: "Address", name: "address", type: "text" },
    { label: "Phone", name: "phone", type: "text" },
  ];

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await adminService.getUserById(String(userId));
        setUser(response.data);
      } catch (error) {
        throw new Error("Error getting user: " + error);
      }
    };

    fetchUser();
  }, [userId]);

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (user) {
        const { name, value } = event.target;
        setUser({
          ...user,
          [name]: value,
        });
        setChanges({
          ...changes,
          [name]: value,
        });
      }
    },
    [user, changes]
  );

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      console.log(changes);
      await adminService.updateUserInformation(
        String(userId),
        JSON.stringify(changes)
      );
    } catch (error) {
      throw new Error("Error updating product: " + error);
    }
  };

  if (!user) {
    return <Loader />;
  }

  return (
    <React.Fragment>
      <h1>Update User</h1>
      <div className="board-container">
        <form onSubmit={handleSubmit}>
          {fields.map((field) => (
            <label key={field.name}>
              {field.label}:
              <input
                type={field.type}
                name={field.name}
                value={user[field.name as keyof IUser]}
                onChange={handleChange}
              />
            </label>
          ))}
          <button type="submit">Update</button>
        </form>
      </div>
    </React.Fragment>
  );
};

export default UpdateUser;
