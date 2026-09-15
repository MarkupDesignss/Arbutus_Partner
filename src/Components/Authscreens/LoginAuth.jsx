import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
} from "react";
import { X } from "lucide-react";
import Swal from "sweetalert2";
import { useDispatch } from "react-redux";

import {
  useSendOtpMutation,
  useVerifyOtpMutation,
} from "../../Redux/api/publicApiSlice";

import {
  setEmail as setAuthEmail,
  setCredentials,
} from "../../Redux/authSlice";

import TremsandCondition from "../../TremsandCondition";
import Privacypolicy from "../../Privacypolicy";

const LoginAuth = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(1);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [isVerifying, setIsVerifying] = useState(false);

  // Terms & Privacy popup states
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);

  const dispatch = useDispatch();

  const [sendOtp, { isLoading: isSendingOtp }] = useSendOtpMutation();
  const [verifyOtp, { isLoading: isVerifyingOtp }] = useVerifyOtpMutation();

  const otpRefs = [
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
  ];

  useEffect(() => {
    const style = document.createElement("style");
  
    style.innerHTML = `
      .swal2-container {
        z-index: 999999 !important;
      }
  
      .swal2-popup {
        z-index: 999999 !important;
      }
    `;
  
    document.head.appendChild(style);
  
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const handleVerifyOtp = useCallback(async () => {
    const otpCode = otp.join("");

    if (otpCode.length !== 4) {
      Swal.fire("Error", "Please enter complete OTP", "error");
      return;
    }

    if (isVerifying) return;

    setIsVerifying(true);

    try {
      const res = await verifyOtp({
        email,
        otp: otpCode,
        firstName,
        lastName,
      }).unwrap();

      dispatch(
        setCredentials({
          token: res.access_token,
          email: res.data.user?.email || email,
          firstName: res.data.user?.firstName || firstName,
          lastName: res.data.user?.lastName || lastName,
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
    } finally {
      setIsVerifying(false);
    }
  }, [
    otp,
    email,
    firstName,
    lastName,
    isVerifying,
    verifyOtp,
    dispatch,
    onClose,
  ]);

  // =========================
  // AUTO VERIFY OTP
  // =========================
  useEffect(() => {
    if (!isOpen) return;
    if (step !== 2) return;

    const otpCode = otp.join("");

    if (otpCode.length === 4) {
      handleVerifyOtp();
    }
  }, [otp, step, isOpen, handleVerifyOtp]);

  // =========================
  // RESET ON CLOSE
  // =========================
  useEffect(() => {
    if (!isOpen) {
      setStep(1);
      setFirstName("");
      setLastName("");
      setEmail("");
      setAgreed(false);
      setOtp(["", "", "", ""]);
      setShowTerms(false);
      setShowPrivacy(false);
    }
  }, [isOpen]);

  // =========================
  // OTP CHANGE
  // =========================
  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);

    setOtp(newOtp);

    if (value && index < 3) {
      otpRefs[index + 1].current?.focus();
    }
  };

  // =========================
  // OTP KEYDOWN
  // =========================
  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs[index - 1].current?.focus();
    }
  };

  // =========================
  // OTP PASTE
  // =========================
  const handleOtpPaste = (e) => {
    e.preventDefault();

    const pastedData = e.clipboardData.getData("text");
    const otpDigits = pastedData.replace(/\D/g, "").slice(0, 4);

    if (!otpDigits.length) return;

    const newOtp = [...otp];

    for (let i = 0; i < otpDigits.length && i < 4; i++) {
      newOtp[i] = otpDigits[i];
    }

    setOtp(newOtp);

    const nextEmptyIndex = newOtp.findIndex((digit) => digit === "");

    if (nextEmptyIndex !== -1) {
      otpRefs[nextEmptyIndex].current?.focus();
    } else {
      otpRefs[3].current?.focus();
    }
  };

  // =========================
  // SEND OTP
  // =========================
  const handleContinue = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+.[^\s@]+$/;
    const nameRegex = /^[A-Za-z\s]{2,50}$/;

    if (!firstName.trim()) {
      Swal.fire("Error", "Please enter your first name", "error");
      return;
    }

    if (!nameRegex.test(firstName.trim())) {
      Swal.fire(
        "Error",
        "First name should contain only letters (min 2)",
        "error"
      );
      return;
    }

    if (!lastName.trim()) {
      Swal.fire("Error", "Please enter your last name", "error");
      return;
    }

    if (!nameRegex.test(lastName.trim())) {
      Swal.fire(
        "Error",
        "Last name should contain only letters (min 2)",
        "error"
      );
      return;
    }

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
      const res = await sendOtp({
        email,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
      }).unwrap();

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

  // =========================
  // EARLY RETURN
  // =========================
  if (!isOpen) return null;

  return (
    <>
      {/* =========================
          LOGIN MODAL
      ========================= */}
      <div className="fixed inset-0 z-[9990] flex items-center justify-center bg-black/50 p-4">
        <div className="relative flex w-full max-w-4xl overflow-hidden rounded-2xl bg-white shadow-2xl max-h-[90vh]">
          {/* LEFT IMAGE */}
          <div className="hidden w-1/2 md:block">
            <img
              src="/arbutus-web/assets/Home/login.png"
              alt="Business meeting"
              className="h-full w-full object-cover"
            />
          </div>

          {/* RIGHT FORM */}
          <div className="relative flex w-full flex-col justify-center overflow-y-auto p-6 sm:p-8 md:w-1/2 md:p-12">
            {/* CLOSE BUTTON */}
            <button
              type="button"
              onClick={onClose}
              className="absolute right-5 top-5 z-10 cursor-pointer text-gray-700 transition hover:text-black"
              aria-label="Close"
            >
              <X size={24} />
            </button>

            {/* =========================
                STEP 1
            ========================= */}
            {step === 1 && (
              <>
                <h2 className="mb-5 pr-8 text-xl font-semibold md:text-2xl">
                  Share Your Details To Get Access To Fremium Features
                </h2>

                {/* FIRST NAME + LAST NAME */}
                <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      First Name<span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="Enter First Name"
                      className="w-full rounded-lg border-2 border-[#ACACAC] px-4 py-3 outline-none transition focus:border-[#2A57C4]"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Last Name
                    </label>
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Enter Last Name"
                      className="w-full rounded-lg border-2 border-[#ACACAC] px-4 py-3 outline-none transition focus:border-[#2A57C4]"
                    />
                  </div>
                </div>

                {/* EMAIL */}
                <div className="mb-6">
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Email ID<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter Your Email ID"
                    className="w-full rounded-lg border-2 border-[#ACACAC] px-4 py-3 outline-none transition focus:border-[#2A57C4]"
                  />
                </div>

                <button
                  type="button"
                  onClick={handleContinue}
                  disabled={isSendingOtp}
                  className="mb-4 w-full cursor-pointer rounded-lg bg-[#2A57C4] py-3.5 text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSendingOtp ? "Sending..." : "Continue"}
                </button>

                <div className="mb-5 flex items-start gap-2">
                  <input
                    type="checkbox"
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                    className="mt-1 h-4 w-4 accent-blue-600"
                  />
                  <p className="text-xs leading-5 text-gray-600">
                    By Clicking On Proceed, You Have Read And Agree To The Altidb
                  </p>
                </div>

                {/* TERMS + PRIVACY */}
                <div className="flex flex-wrap items-center justify-center gap-1 text-center text-xs">
                  <button
                    type="button"
                    onClick={() => {
                      setShowPrivacy(false);
                      setShowTerms(true);
                    }}
                    className="cursor-pointer font-medium text-[#2A57C4] hover:underline"
                  >
                    Terms Of Use
                  </button>
                  <span>&</span>
                  <button
                    type="button"
                    onClick={() => {
                      setShowTerms(false);
                      setShowPrivacy(true);
                    }}
                    className="cursor-pointer font-medium text-[#2A57C4] hover:underline"
                  >
                    Privacy Policy
                  </button>
                </div>
              </>
            )}

            {/* =========================
                STEP 2
            ========================= */}
            {step === 2 && (
              <>
                <h2 className="mb-3 pr-8 text-xl font-semibold md:text-2xl">
                  Verify Your Email
                </h2>

                <p className="mb-6 text-sm text-gray-600">
                  We've sent a 4-digit OTP to <strong>{email}</strong>
                </p>

                <div className="mb-6">
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Enter OTP<span className="text-red-500">*</span>
                  </label>

                  <div
                    className="flex justify-center gap-2 sm:gap-3"
                    onPaste={handleOtpPaste}
                  >
                    {otp.map((digit, index) => (
                      <input
                        key={index}
                        ref={otpRefs[index]}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) =>
                          handleOtpChange(index, e.target.value)
                        }
                        onKeyDown={(e) => handleOtpKeyDown(index, e)}
                        className="h-12 w-12 rounded-lg border-2 border-[#ACACAC] text-center text-xl font-semibold outline-none transition focus:border-[#2A57C4] sm:h-14 sm:w-14"
                      />
                    ))}
                  </div>

                  <p className="mt-2 text-center text-xs text-gray-500">
                    You can copy and paste the OTP directly
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleVerifyOtp}
                  disabled={isVerifyingOtp || isVerifying}
                  className="mb-4 w-full cursor-pointer rounded-lg bg-[#2A57C4] py-3.5 text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isVerifyingOtp || isVerifying
                    ? "Verifying..."
                    : "Verify OTP"}
                </button>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => {
                      setStep(1);
                      setOtp(["", "", "", ""]);
                    }}
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

      {/* =========================
          TERMS POPUP
      ========================= */}
      {showTerms && (
        <div
          className="fixed inset-0 z-[10000] flex items-start justify-center overflow-y-auto bg-black/70 p-4"
          onClick={() => setShowTerms(false)}
        >
          <div
            className="relative my-8 w-full max-w-4xl max-h-[85vh] overflow-y-auto rounded-2xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* X CLOSE BUTTON — TOP RIGHT */}
            <button
              type="button"
              onClick={() => setShowTerms(false)}
              className="sticky top-3 right-3 z-10 ml-auto mr-3 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-white text-gray-700 shadow-md transition hover:bg-gray-100 hover:text-black"
              aria-label="Close Terms"
            >
              <X size={20} />
            </button>

            <TremsandCondition
              isOpen={true}
              onClose={() => setShowTerms(false)}
            />
          </div>
        </div>
      )}

      {/* =========================
          PRIVACY POPUP
      ========================= */}
      {showPrivacy && (
        <div
          className="fixed inset-0 z-[10000] flex items-start justify-center overflow-y-auto bg-black/70 p-4"
          onClick={() => setShowPrivacy(false)}
        >
          <div
            className="relative my-8 w-full max-w-4xl max-h-[85vh] overflow-y-auto rounded-2xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* X CLOSE BUTTON — TOP RIGHT */}
            <button
              type="button"
              onClick={() => setShowPrivacy(false)}
              className="sticky top-3 right-3 z-10 ml-auto mr-3 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-white text-gray-700 shadow-md transition hover:bg-gray-100 hover:text-black"
              aria-label="Close Privacy Policy"
            >
              <X size={20} />
            </button>

            <Privacypolicy
              isOpen={true}
              onClose={() => setShowPrivacy(false)}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default LoginAuth;