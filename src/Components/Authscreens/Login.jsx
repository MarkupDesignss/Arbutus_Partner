import React, { useState } from "react";
import { X } from "lucide-react";
import Swal from "sweetalert2";
import { useDispatch } from "react-redux";
import { useSendMailMutation } from "../../Redux/api/publicApiSlice";
import { setEmail as setAuthEmail } from "../../Redux/authSlice";
import { Link } from "react-router-dom";

const Login = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState("");
  const [agreed, setAgreed] = useState(false);
  const dispatch = useDispatch();

  const [sendOtp, { isLoading }] = useSendMailMutation();

  if (!isOpen) return null;

  const handleContinue = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email) {
      Swal.fire("Error", "Please enter your email ID", "error");
      return;
    }

    if (!emailRegex.test(email)) {
      Swal.fire("Error", "Please enter a valid email address", "error");
      return;
    }

    if (!agreed) {
      Swal.fire("Error", "Please accept terms & conditions", "error");
      return;
    }

    try {
      const res = await sendOtp({ email }).unwrap();
      dispatch(setAuthEmail(res.email));

      Swal.fire({
        icon: "success",
        title: "Email Sent!",
        text: "Your email address has been saved successfully.",
        confirmButtonText: "OK",
      }).then(() => {
        onClose();
        setEmail("");
        setAgreed(false);
      });

    } catch (error) {
      Swal.fire(
        "Failed",
        error?.data?.message || "Please Check Your Email Address",
        "error"
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-4xl bg-white rounded-2xl overflow-hidden flex shadow-2xl relative">

        {/* LEFT IMAGE */}
        <div className="w-1/2 h-full hidden md:block">
          <img
            src="/arbutus-web/assets/Home/login.png"
            alt="Business meeting"
            className="w-full h-full object-cover"
          />
        </div>

        {/* RIGHT FORM */}
        <div className="w-full md:w-1/2 p-8 md:p-12 relative flex flex-col justify-center">

          {/* CLOSE BUTTON */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 hover:text-gray-600 cursor-pointer"
          >
            <X size={24} />
          </button>

          <h2 className="text-xl md:text-2xl font-semibold mb-5">
            Share Your Email ID To Get Access To Fremium Features
          </h2>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email ID<span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter Your Email ID"
              className="w-full px-4 py-3 border-2 border-[#ACACAC] rounded-lg"
            />
          </div>

          <button
            onClick={handleContinue}
            disabled={isLoading}
            className="w-full bg-[#2A57C4] text-white py-3.5 cursor-pointer rounded-lg hover:bg-blue-700 mb-4 disabled:opacity-60"
          >
            {isLoading ? "Sending..." : "Continue"}
          </button>

          <div className="flex items-start gap-2 mb-6">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="mt-1 w-4 h-4 accent-blue-600"
            />
            <p className="text-xs">
              By Clicking On Proceed, You Have Read And Agree To The Altidb
            </p>
          </div>

          <div className="text-center text-xs">
            <Link to="/TremsandCondition" className="underline hover:text-gray-800">
              Terms Of Use
            </Link>
            <span> & </span>
            <Link to="/Privacypolicy" className="underline hover:text-gray-800">
              Privacy Policy
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Login;
