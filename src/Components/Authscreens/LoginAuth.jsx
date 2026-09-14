import React, { useState, useRef, useEffect } from "react";
import { X } from "lucide-react";
import Swal from "sweetalert2";
import { useDispatch } from "react-redux";
import { useSendOtpMutation, useVerifyOtpMutation } from "../../Redux/api/publicApiSlice";
import { setEmail as setAuthEmail, setCredentials } from "../../Redux/authSlice";

const LoginAuth = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [otp, setOtp] = useState(["", "", "", ""]);
  const dispatch = useDispatch();

  const [sendOtp, { isLoading: isSendingOtp }] = useSendOtpMutation();
  const [verifyOtp, { isLoading: isVerifyingOtp }] = useVerifyOtpMutation();

  const otpRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];

  if (!isOpen) return null;

  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    if (value && index < 3) {
      otpRefs[index + 1].current?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs[index - 1].current?.focus();
    }
  };

  // Handle paste event for OTP
  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text");
    const otpDigits = pastedData.replace(/\D/g, "").slice(0, 4);
    
    if (otpDigits.length === 0) return;

    const newOtp = [...otp];
    for (let i = 0; i < otpDigits.length && i < 4; i++) {
      newOtp[i] = otpDigits[i];
    }
    setOtp(newOtp);

    // Focus the next empty input or the last filled input
    const nextEmptyIndex = newOtp.findIndex(digit => digit === "");
    if (nextEmptyIndex !== -1) {
      otpRefs[nextEmptyIndex].current?.focus();
    } else {
      otpRefs[3].current?.focus();
    }
  };

  // Auto-submit OTP when all 4 digits are filled
  useEffect(() => {
    const otpCode = otp.join("");
    if (otpCode.length === 4 && step === 2) {
      handleVerifyOtp();
    }
  }, [otp, step]);

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
        title: "OTP Sent!",
        text: "Please check your email for the OTP.",
        confirmButtonText: "OK",
      });

      setStep(2);
    } catch (error) {
      Swal.fire(
        "Failed",
        error?.data?.message || "Please Check Your Email Address",
        "error"
      );
    }
  };

  const handleVerifyOtp = async () => {
    const otpCode = otp.join("");
  
    if (otpCode.length !== 4) {
      Swal.fire("Error", "Please enter complete OTP", "error");
      return;
    }
  
    try {
      const res = await verifyOtp({ email, otp: otpCode }).unwrap();
  
      dispatch(
        setCredentials({
          token: res.access_token,
          email: res.data.user?.email || email,
          subscription: res.data.subscription,
          status: res.status,
          message: res.message,
        })
      );
      
      Swal.fire({
        icon: "success",
        title: res.message,
      }).then(() => {
        onClose();
      });
  
    } catch (error) {
      Swal.fire(
        "Failed",
        error?.data?.message || "Invalid OTP",
        "error"
      );
    }
  };
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
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

          {/* STEP 1: EMAIL */}
          {step === 1 && (
            <>
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
                disabled={isSendingOtp}
                className="w-full bg-[#2A57C4] text-white py-3.5 cursor-pointer rounded-lg hover:bg-blue-700 mb-4 disabled:opacity-60"
              >
                {isSendingOtp ? "Sending..." : "Continue"}
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
                <a href="/arbutus-web/TremsandCondition" className="underline hover:text-gray-800">
                  Terms Of Use
                </a>
                <span> & </span>
                <a href="//arbutus-web/Privacypolicy" className="underline hover:text-gray-800">
                  Privacy Policy
                </a>
              </div>
            </>
          )}

          {/* STEP 2: OTP VERIFICATION */}
          {step === 2 && (
            <>
              <h2 className="text-xl md:text-2xl font-semibold mb-3">
                Verify Your Email
              </h2>
              <p className="text-sm text-gray-600 mb-6">
                We've sent a 4-digit OTP to <strong>{email}</strong>
              </p>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Enter OTP<span className="text-red-500">*</span>
                </label>
                <div 
                  className="flex gap-3 justify-center"
                  onPaste={handleOtpPaste}
                >
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      ref={otpRefs[index]}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(index, e)}
                      className="w-14 h-14 text-center text-xl font-semibold border-2 border-[#ACACAC] rounded-lg focus:border-[#2A57C4] focus:outline-none"
                    />
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-2 text-center">
                  You can copy and paste the OTP directly
                </p>
              </div>

              <button
                onClick={handleVerifyOtp}
                disabled={isVerifyingOtp}
                className="w-full bg-[#2A57C4] text-white py-3.5 rounded-lg hover:bg-blue-700 mb-4 disabled:opacity-60"
              >
                {isVerifyingOtp ? "Verifying..." : "Verify OTP"}
              </button>

              <div className="text-center">
                <button
                  onClick={() => setStep(1)}
                  className="text-sm text-[#2A57C4] hover:underline"
                >
                  Change Email
                </button>
              </div>
            </>
          )}

        </div>
      </div>
    </div>
  );
};

export default LoginAuth;