import { withTranslation, WithTranslation } from "react-i18next";
import UserService from "../../services/UserService";
import React from "react";

interface Props extends WithTranslation {
  userId: string;
}

const DeleteAccount: React.FC<Props> = ({ t, userId }) => {
  const deleteUser = () => {
    console.log(userId);
    UserService.deleteUser(userId);
  };

  return (
    <div>
      <button onClick={deleteUser}>{t("Delete my account")}</button>
    </div>
  );
};

export default withTranslation()(DeleteAccount);
