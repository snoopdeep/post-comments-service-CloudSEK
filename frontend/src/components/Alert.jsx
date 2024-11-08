import React, { useEffect, useContext } from "react";
import { AlertContext } from "../contexts/AlertContext";

function Alert() {
  const { alert, setAlert } = useContext(AlertContext);
  const { message, type } = alert;

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setAlert({ message: "", type: "" });
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [message, setAlert]);

  if (!message) return null;

  const alertStyle =
    type === "success" ? "bg-green-500 text-white" : "bg-red-500 text-white";

  return (
    <div
      className={`p-4 rounded-md shadow-md ${alertStyle} fixed top-4 left-1/2 transform -translate-x-1/2 z-50`}
    >
      {message}
    </div>
  );
}

export default Alert;
