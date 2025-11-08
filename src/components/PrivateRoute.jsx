import { Navigate } from "react-router-dom";
import { useGlobalContext } from "../context/context";

export default function PrivateRoute({ children }) {
  const { user } = useGlobalContext();

  return user ? children : <Navigate to="/admin" />;
}
