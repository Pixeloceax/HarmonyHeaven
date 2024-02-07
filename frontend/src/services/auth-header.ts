export default function authHeader() {
  const userStr = localStorage.getItem("user");
  if (userStr) {
    return { Authorization: "Bearer " + userStr };
  } else {
    return { Authorization: "" };
  }
}
