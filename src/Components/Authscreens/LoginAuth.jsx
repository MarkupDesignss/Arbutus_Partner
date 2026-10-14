import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
} from "react";
import {
  X,

  ShieldCheck,
  ArrowLeft,
  Loader2,
  ChevronDown,
} from "lucide-react";
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
import Disclamer from "../../Disclamer";

// =========================
// SHARED STYLES
// =========================
const inputBase =
  "w-full rounded-xl border border-gray-300 bg-gray-50/60 py-3 px-4 text-sm text-gray-900 placeholder:text-gray-400 outline-none transition focus:border-[#2A57C4] focus:bg-white focus:ring-4 focus:ring-[#2A57C4]/15";

const labelBase = "mb-1.5 block text-sm font-medium text-gray-700";

const primaryBtn =
  "flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#2A57C4] py-3.5 text-sm font-semibold text-white shadow-lg shadow-[#2A57C4]/25 transition hover:bg-[#2249a6] focus:outline-none focus-visible:ring-4 focus-visible:ring-[#2A57C4]/30 disabled:cursor-not-allowed disabled:opacity-60";

// Small wrapper: label + input (icons removed)
const Field = ({ label, required, children }) => (
  <div>
    <label className={labelBase}>
      {label}
      {required && <span className="ml-0.5 text-red-500">*</span>}
    </label>
    <div className="relative">{children}</div>
  </div>
);

// Popup wrapper for Terms / Privacy / Disclaimer
const LegalPopup = ({ onClose, label, children }) => (
  <div
    className="fixed inset-0 z-[10000] flex items-start justify-center overflow-y-auto bg-black/70 p-4 backdrop-blur-sm"
    onClick={onClose}
  >
    <div
      className="relative my-8 max-h-[85vh] w-full max-w-4xl overflow-y-auto rounded-2xl bg-white shadow-2xl"
      onClick={(e) => e.stopPropagation()}
    >
      <button
        type="button"
        onClick={onClose}
        className="sticky right-3 top-3 z-10 ml-auto mr-3 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-white text-gray-700 shadow-md transition hover:bg-gray-100 hover:text-black"
        aria-label={label}
      >
        <X size={20} />
      </button>
      {children}
    </div>
  </div>
);

const LoginAuth = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(1);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [isVerifying, setIsVerifying] = useState(false);

  // Industry professional dropdown
  const [industry_professional, setindustry_professional] = useState("");

  // Terms, Privacy & Disclaimer popup states
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showDisclaimer, setShowDisclaimer] = useState(false);

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
        industry_professional, 
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
    industry_professional, // ✅ dependency
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
      setindustry_professional("");
      setShowTerms(false);
      setShowPrivacy(false);
      setShowDisclaimer(false);
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
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
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

    if (!industry_professional) {
      Swal.fire(
        "Error",
        "Please select whether you are an industry professional",
        "error"
      );
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
        industry_professional, // ✅ "yes" / "no" bhej rahe hain
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

  const verifying = isVerifyingOtp || isVerifying;

  return (
    <>
      {/* =========================
          LOGIN MODAL
      ========================= */}
      <div className="fixed inset-0 z-[9990] flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
        <div className="relative flex max-h-[92vh] w-full max-w-5xl overflow-hidden rounded-3xl bg-white shadow-2xl">
          {/* LEFT IMAGE PANEL */}
          <div className="relative hidden w-1/2 md:block">
            <img
              src="/arbutus-web/assets/Home/login.png"
              alt="Business meeting"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0f2a6b]/90 via-[#0f2a6b]/30 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-8 text-white">
              <h3 className="mb-2 text-2xl font-semibold leading-snug">
                Smarter alternative investment insights
              </h3>
              <p className="max-w-sm text-sm leading-6 text-white/80">
                Sign in to unlock freemium features and explore AltDB's
                data, tools and research.
              </p>
            </div>
          </div>

          {/* RIGHT FORM PANEL */}
          <div className="relative flex w-full flex-col justify-center overflow-y-auto p-6 sm:p-8 md:w-1/2 md:p-10">
            {/* CLOSE BUTTON */}
            <button
              type="button"
              onClick={onClose}
              className="absolute right-4 top-4 z-10 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-gray-500 transition hover:bg-gray-100 hover:text-black"
              aria-label="Close"
            >
              <X size={20} />
            </button>

            {/* STEP INDICATOR */}
            <div className="mb-6 flex items-center gap-2" aria-hidden="true">
              <span className="h-1.5 w-10 rounded-full bg-[#2A57C4]" />
              <span
                className={`h-1.5 w-10 rounded-full transition ${
                  step === 2 ? "bg-[#2A57C4]" : "bg-gray-200"
                }`}
              />
              <span className="ml-2 text-xs text-gray-500">
                Step {step} of 2
              </span>
            </div>

            {/* =========================
                STEP 1
            ========================= */}
            {step === 1 && (
              <>
                <h2 className="mb-1 pr-8 text-2xl font-semibold text-gray-900">
                  Get access to freemium features
                </h2>
                <p className="mb-6 text-sm text-gray-500">
                  Share a few details and we'll send a one-time code to your
                  email.
                </p>

                {/* FIRST NAME + LAST NAME */}
                <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Field label="First name" required>
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="Enter first name"
                      className={inputBase}
                    />
                  </Field>

                  <Field label="Last name">
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Enter last name"
                      className={inputBase}
                    />
                  </Field>
                </div>

                {/* EMAIL */}
                <div className="mb-4">
                  <Field label="Email ID" required>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@company.com"
                      className={inputBase}
                    />
                  </Field>
                </div>

                {/* ARE YOU AN INDUSTRY PROFESSIONAL? */}
                <div className="mb-5">
                  <Field
                    label="Are you an industry professional?"
                    required
                  >
                    <select
                      value={industry_professional}
                      onChange={(e) =>
                        setindustry_professional(e.target.value)
                      }
                      className={`${inputBase} cursor-pointer appearance-none pr-10 ${
                        industry_professional ? "" : "text-gray-400"
                      }`}
                    >
                      <option value="">Select an option</option>
                      <option value="yes">Yes</option>
                      <option value="no">No</option>
                    </select>
                    <ChevronDown
                      size={18}
                      className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                  </Field>
                </div>

                {/* AGREEMENT */}
                <label className="mb-5 flex cursor-pointer items-start gap-2.5 rounded-xl bg-gray-50 p-3">
                  <input
                    type="checkbox"
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                    className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer accent-[#2A57C4]"
                  />
                  <span className="text-xs leading-5 text-gray-600">
                    I have read and agree to the AltDB{" "}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        setShowTerms(false);
                        setShowPrivacy(false);
                        setShowDisclaimer(true);
                      }}
                      className="cursor-pointer font-medium text-[#2A57C4] hover:underline"
                    >
                      Disclaimer
                    </button>
                    ,{" "}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        setShowPrivacy(false);
                        setShowDisclaimer(false);
                        setShowTerms(true);
                      }}
                      className="cursor-pointer font-medium text-[#2A57C4] hover:underline"
                    >
                      Terms of Use
                    </button>{" "}
                    &amp;{" "}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        setShowTerms(false);
                        setShowDisclaimer(false);
                        setShowPrivacy(true);
                      }}
                      className="cursor-pointer font-medium text-[#2A57C4] hover:underline"
                    >
                      Privacy Policy
                    </button>
                    .
                  </span>
                </label>

                <button
                  type="button"
                  onClick={handleContinue}
                  disabled={isSendingOtp}
                  className={primaryBtn}
                >
                  {isSendingOtp ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Sending OTP...
                    </>
                  ) : (
                    "Continue"
                  )}
                </button>
              </>
            )}

            {/* =========================
                STEP 2
            ========================= */}
            {step === 2 && (
              <>
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#2A57C4]/10 text-[#2A57C4]">
                  <ShieldCheck size={28} />
                </div>

                <h2 className="mb-1 pr-8 text-2xl font-semibold text-gray-900">
                  Verify your email
                </h2>

                <p className="mb-7 text-sm text-gray-500">
                  We've sent a 4-digit OTP to{" "}
                  <strong className="break-all font-semibold text-gray-800">
                    {email}
                  </strong>
                </p>

                <div className="mb-6">
                  <label className={`${labelBase} text-center`}>
                    Enter OTP<span className="ml-0.5 text-red-500">*</span>
                  </label>

                  <div
                    className="flex justify-center gap-3"
                    onPaste={handleOtpPaste}
                  >
                    {otp.map((digit, index) => (
                      <input
                        key={index}
                        ref={otpRefs[index]}
                        type="text"
                        inputMode="numeric"
                        autoComplete="one-time-code"
                        maxLength={1}
                        value={digit}
                        onChange={(e) =>
                          handleOtpChange(index, e.target.value)
                        }
                        onKeyDown={(e) => handleOtpKeyDown(index, e)}
                        className={`h-14 w-14 rounded-xl border-2 text-center text-2xl font-semibold text-gray-900 outline-none transition focus:border-[#2A57C4] focus:ring-4 focus:ring-[#2A57C4]/15 sm:h-16 sm:w-16 ${
                          digit
                            ? "border-[#2A57C4] bg-[#2A57C4]/5"
                            : "border-gray-300 bg-gray-50/60"
                        }`}
                      />
                    ))}
                  </div>

                  <p className="mt-3 text-center text-xs text-gray-500">
                    You can copy and paste the OTP directly
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleVerifyOtp}
                  disabled={verifying}
                  className={`${primaryBtn} mb-4`}
                >
                  {verifying ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    "Verify OTP"
                  )}
                </button>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => {
                      setStep(1);
                      setOtp(["", "", "", ""]);
                    }}
                    className="inline-flex cursor-pointer items-center gap-1.5 text-sm font-medium text-[#2A57C4] hover:underline"
                  >
                    <ArrowLeft size={16} />
                    Change email
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
        <LegalPopup onClose={() => setShowTerms(false)} label="Close Terms">
          <TremsandCondition
            isOpen={true}
            onClose={() => setShowTerms(false)}
          />
        </LegalPopup>
      )}

      {/* =========================
          PRIVACY POPUP
      ========================= */}
      {showPrivacy && (
        <LegalPopup
          onClose={() => setShowPrivacy(false)}
          label="Close Privacy Policy"
        >
          <Privacypolicy
            isOpen={true}
            onClose={() => setShowPrivacy(false)}
          />
        </LegalPopup>
      )}

      {/* =========================
          DISCLAIMER POPUP
      ========================= */}
      {showDisclaimer && (
        <LegalPopup
          onClose={() => setShowDisclaimer(false)}
          label="Close Disclaimer"
        >
          <Disclamer
            isOpen={true}
            onClose={() => setShowDisclaimer(false)}
          />
        </LegalPopup>
      )}
    </>
  );
};

export default LoginAuth;