import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const PaymentSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    Swal.fire({
      icon: "success",
      title: "Payment Successful ",
      text: "Subscription activated successfully",
      confirmButtonColor: "#2A57C4",
    }).then(() => {
      navigate("/Levelmain", { replace: true });
    });
  }, []);

  return null;
};

export default PaymentSuccess;
