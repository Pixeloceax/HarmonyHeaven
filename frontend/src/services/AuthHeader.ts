export default function AuthHeader() {
  const userStr = localStorage.getItem("user");
  if (userStr) {
    const userObj = JSON.parse(userStr);
    return { Authorization: "Bearer " + userObj.user };
  } else {
    return { Authorization: "" };
  }
}
