import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  useSendSubscribeMutation,
  useGetFooterQuery,
} from "./Redux/api/publicApiSlice";
import Swal from "sweetalert2";

/* =========================================================
   COLORS
========================================================= */
const COLORS = {
  primary: "#0B4D8C",
  primaryDark: "#083B6B",
};

/* =========================================================
   ANIMATION
========================================================= */
const fadeUp = {
  hidden: {
    opacity: 0,
    y: 16,
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      ease: "easeOut",
    },
  },
};

/* =========================================================
   NEWSLETTER
========================================================= */
function Newsletter() {
  const [email, setEmail] = useState("");

  const [sendSubscribe, { isLoading }] = useSendSubscribeMutation();

  const handleSubscribe = async () => {
    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      Swal.fire({
        icon: "error",
        title: "Email Required",
        text: "Please enter your email address.",
        confirmButtonColor: COLORS.primary,
      });

      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(trimmedEmail)) {
      Swal.fire({
        icon: "warning",
        title: "Invalid Email",
        text: "Please enter a valid email address.",
        confirmButtonColor: COLORS.primary,
      });

      return;
    }

    try {
      const res = await sendSubscribe({
        email: trimmedEmail,
      }).unwrap();

      Swal.fire({
        icon: "success",
        title: "Subscribed Successfully",
        text:
          res?.message ||
          "Your email address has been subscribed successfully!",
        confirmButtonColor: COLORS.primary,
      });

      setEmail("");
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Subscription Failed",
        text:
          error?.data?.message ||
          error?.message ||
          "Something went wrong. Please try again.",
        confirmButtonColor: COLORS.primary,
      });
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !isLoading) {
      event.preventDefault();
      handleSubscribe();
    }
  };

  return (
    <motion.aside
      className="w-full max-w-[390px] self-start"
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={{
        once: true,
        amount: 0.2,
      }}
    >
      <div
        className="
          w-full
          rounded-[24px]
          px-6
          py-5
          text-white
        "
        style={{
          backgroundColor: COLORS.primary,
        }}
      >
        {/* LABEL */}
        <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-white/95">
          Newsletter
        </p>

        {/* HEADING */}
        <h3 className="mt-2 text-[22px] font-normal leading-[1.15] tracking-tight text-white md:text-[25px]">
          Insights For
          <br />
          A Brighter Tomorrow
        </h3>

        {/* DESCRIPTION */}
        <p className="mt-3 max-w-[320px] text-[13px] font-normal leading-5 text-white/95">
          Receive the latest perspectives on wealth, legacy and family
          offices.
        </p>

        {/* SUBSCRIBE INPUT */}
        <div className="mt-4 flex h-[46px] w-full items-center rounded-full bg-white p-1 pl-4">
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Enter your email address"
            disabled={isLoading}
            className="
              min-w-0
              flex-1
              bg-transparent
              pr-2
              text-[12px]
              font-normal
              text-[#111827]
              outline-none
              placeholder:text-[#9CA3AF]
              disabled:cursor-not-allowed
              disabled:opacity-60
            "
          />

          <button
            type="button"
            aria-label="Subscribe"
            onClick={handleSubscribe}
            disabled={isLoading}
            className="
              flex
              h-9
              w-9
              shrink-0
              items-center
              justify-center
              rounded-full
              bg-[#E7EEF7]
              text-[#0B4D8C]
              transition-all
              duration-300
              hover:bg-[#D9E6F4]
              disabled:cursor-not-allowed
              disabled:opacity-70
            "
          >
            {isLoading ? (
              <span
                className="
                  h-4
                  w-4
                  animate-spin
                  rounded-full
                  border-2
                  border-[#0B4D8C]
                  border-t-transparent
                "
              />
            ) : (
              <svg
                viewBox="0 0 24 24"
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </motion.aside>
  );
}

/* =========================================================
   FOOTER
========================================================= */
const Footer = () => {
  const navigate = useNavigate();

  const { data: footerRes } = useGetFooterQuery();
  const footer = footerRes?.data || {};

  const handleNavigation = (path) => {
    navigate(path);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <footer className="relative overflow-hidden bg-[#2A57C4]">
      {/* WAVE */}
      <img
        src="/arbutus-web/assets/Footer/wave.png"
        alt="wave"
        className="absolute left-0 top-0 h-full w-full object-cover"
      />

      <div className="relative z-10 mx-auto max-w-7xl px-6 pb-8 pt-6">
        {/* =================================================
            LOGO + SOCIAL
        ================================================= */}
        <div className="flex flex-col items-start justify-between md:flex-row">
          <img
            src="/arbutus-web/assets/Footer/logo.png"
            alt="AltDB"
            className="h-18"
          />

          <div className="mt-6 text-sm md:mt-0 md:text-right">
            <p className="mb-2 font-normal text-white/90">
              Follow us on:
            </p>

            <div className="flex gap-4 md:justify-end">
              {footer.linkedin && (
                <a
                  href={footer.linkedin}
                  target="_blank"
                  rel="noreferrer"
                >
                  <img
                    src="/arbutus-web/assets/Footer/linkedin.png"
                    className="h-5 w-5 cursor-pointer"
                    alt="linkedin"
                  />
                </a>
              )}

              {footer.youtube && (
                <a
                  href={footer.youtube}
                  target="_blank"
                  rel="noreferrer"
                >
                  <img
                    src="/arbutus-web/assets/Footer/youtube.png"
                    className="h-5 w-5 cursor-pointer"
                    alt="youtube"
                  />
                </a>
              )}

              {footer.twitter && (
                <a
                  href={footer.twitter}
                  target="_blank"
                  rel="noreferrer"
                >
                  <img
                    src="/arbutus-web/assets/Footer/twitter.png"
                    className="h-5 w-5 cursor-pointer"
                    alt="twitter"
                  />
                </a>
              )}
            </div>
          </div>
        </div>

        {/* DIVIDER */}
        <div className="my-5 h-px bg-white/30" />

        {/* =================================================
            MAIN GRID
        ================================================= */}
        <div className="grid grid-cols-1 gap-10 text-sm text-white md:grid-cols-4">
          {/* =================================================
              CONTACT
          ================================================= */}
          <div>
            <h4 className="mb-4 font-medium text-white">
              Contact us
            </h4>

            <p className="mb-4 font-normal leading-6 text-white/90">
              {footer["contact-us"] ||
                "Lorem ipsum dolor sit amet consectetur adipiscing elitcdd"}
            </p>

            <p className="mb-1 font-normal text-white/75">
              Mail us:
            </p>

            <a
              href={`mailto:${footer.mail || "info@altdb.ca"}`}
              className="font-normal text-white/95 underline hover:text-white"
            >
              {footer.mail || "info@altdb.ca"}
            </a>

            {footer.Phone && (
              <>
                <p className="mb-1 mt-2 font-normal text-white/75">
                  Call us:
                </p>

                <a
                  href={`tel:${footer.Phone}`}
                  className="font-normal text-white/95 underline hover:text-white"
                >
                  {footer.Phone}
                </a>
              </>
            )}
          </div>

          {/* =================================================
              QUICK LINKS
          ================================================= */}
          <div>
            <h4 className="mb-4 font-medium text-white">
              Quick Links
            </h4>

            <ul className="space-y-2 text-white/85">
              <li>
                <Link
                  to="/AltDatabaseMain"
                  onClick={() =>
                    window.scrollTo({
                      top: 0,
                      behavior: "smooth",
                    })
                  }
                  className="font-normal transition-colors hover:text-white"
                >
                  AltDB Database
                </Link>
              </li>

              <li>
                <Link
                  to="/Aboutmain"
                  onClick={() =>
                    window.scrollTo({
                      top: 0,
                      behavior: "smooth",
                    })
                  }
                  className="font-normal transition-colors hover:text-white"
                >
                  About Us
                </Link>
              </li>

              <li>
                <Link
                  to="/Contactmain"
                  onClick={() =>
                    window.scrollTo({
                      top: 0,
                      behavior: "smooth",
                    })
                  }
                  className="font-normal transition-colors hover:text-white"
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* =================================================
              TOOLS
          ================================================= */}
          <div>
            <h4 className="mb-4 font-medium text-white">
              Tools
            </h4>

            <button
              onClick={() =>
                handleNavigation("/AltDatabaseMain")
              }
              className="
                cursor-pointer
                border-none
                bg-transparent
                p-0
                font-normal
                text-sm
                text-white/85
                transition-colors
                hover:text-white
              "
            >
              AltDB Screener
            </button>
          </div>

          {/* =================================================
              NEWSLETTER
          ================================================= */}
          <div className="flex w-full justify-start">
            <Newsletter />
          </div>
        </div>

        {/* =================================================
            BOTTOM
        ================================================= */}
        <div className="my-10 h-px bg-white/30" />

        <div className="flex flex-col items-center justify-between text-sm text-white/85 md:flex-row">
          <p className="font-normal">
            {footer["All right"] ||
              "© 2026 AltDB. All rights reserved."}
          </p>

          <div className="mt-2 flex gap-4 md:mt-0">
            <Link
              to="/TremsandCondition"
              onClick={() =>
                window.scrollTo({
                  top: 0,
                  behavior: "smooth",
                })
              }
              className="font-normal transition-colors hover:text-white"
            >
              Terms of Policy
            </Link>

            <Link
              to="/Privacypolicy"
              onClick={() =>
                window.scrollTo({
                  top: 0,
                  behavior: "smooth",
                })
              }
              className="font-normal transition-colors hover:text-white"
            >
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;