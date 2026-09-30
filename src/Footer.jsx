import React, { useState } from "react";
import { Link } from "react-router-dom";
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
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

const alert = (icon, title, text) =>
  Swal.fire({ icon, title, text, confirmButtonColor: COLORS.primary });

/* =========================================================
   NEWSLETTER CARD (sits beside the Tools column)
========================================================= */
function Newsletter() {
  const [email, setEmail] = useState("");
  const [sendSubscribe, { isLoading }] = useSendSubscribeMutation();

  const handleSubscribe = async () => {
    const trimmed = email.trim();

    if (!trimmed) {
      alert("error", "Email Required", "Please enter your email address.");
      return;
    }
    if (!EMAIL_REGEX.test(trimmed)) {
      alert("warning", "Invalid Email", "Please enter a valid email address.");
      return;
    }

    try {
      const res = await sendSubscribe({ email: trimmed }).unwrap();
      alert(
        "success",
        "Subscribed Successfully",
        res?.message || "Your email address has been subscribed successfully!",
      );
      setEmail("");
    } catch (error) {
      alert(
        "error",
        "Subscription Failed",
        error?.data?.errors?.email?.[0] ||
          error?.data?.message ||
          error?.message ||
          "Something went wrong. Please try again.",
      );
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !isLoading) {
      e.preventDefault();
      handleSubscribe();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="
        relative h-full overflow-hidden rounded-2xl border border-white/15
        bg-gradient-to-br from-white/[0.14] to-white/[0.04]
        p-6 shadow-[0_18px_40px_-20px_rgba(3,15,40,0.6)] backdrop-blur-md
        sm:p-7
      "
    >
      {/* soft glow */}
      <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-[#7FB2FF]/25 blur-3xl" />

      <div className="relative">
        <h3 className="font-serif text-[24px] leading-[1.15] tracking-tight text-white sm:text-[26px]">
          Insights for a brighter tomorrow
        </h3>
        <p className="mt-3 text-[14px] leading-6 text-white/75">
          Get the latest perspectives on wealth, legacy and family offices,
          delivered to your inbox.
        </p>

        <div className="mt-5 flex h-14 w-full items-center rounded-full bg-white p-1.5 pl-5 shadow-lg ring-1 ring-white/40 transition focus-within:ring-4 focus-within:ring-[#7FB2FF]/50">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Enter your email address"
            aria-label="Email address"
            disabled={isLoading}
            className="
              min-w-0 flex-1 bg-transparent pr-2 text-[14px] text-[#111827]
              outline-none placeholder:text-[#9CA3AF]
              disabled:cursor-not-allowed disabled:opacity-60
            "
          />
          <button
            type="button"
            onClick={handleSubscribe}
            disabled={isLoading}
            className="
              flex h-11 shrink-0 items-center gap-2 rounded-full px-5
              bg-[#0B4D8C] text-[14px] font-semibold text-white
              transition hover:bg-[#083B6B] active:scale-95
              focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0B4D8C]
              disabled:cursor-not-allowed disabled:opacity-70
            "
          >
            {isLoading ? (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : (
              "Subscribe"
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
}

/* =========================================================
   LINK COLUMN
========================================================= */
const LinkColumn = ({ title, links }) => (
  <nav aria-label={title} className="min-w-0">
    <h4 className="mb-5 text-[15px] font-semibold text-white">{title}</h4>
    <ul className="space-y-3">
      {links.map((link) => (
        <li key={link.to}>
          <Link
            to={link.to}
            onClick={scrollToTop}
            className="
              group inline-flex items-center text-[14px] text-white/70
              transition-colors hover:text-white
              focus-visible:text-white focus-visible:outline-none
            "
          >
            <span className="mr-0 inline-block h-px w-0 bg-[#7FB2FF] transition-all duration-300 group-hover:mr-2 group-hover:w-3 group-focus-visible:mr-2 group-focus-visible:w-3" />
            {link.label}
          </Link>
        </li>
      ))}
    </ul>
  </nav>
);

/* =========================================================
   FOOTER
========================================================= */
const Footer = () => {
  const { data: footerRes } = useGetFooterQuery();
  const footer = footerRes?.data || {};

  const socialLinks = [
    {
      key: "linkedin",
      src: "/arbutus-web/assets/Footer/linkedin.png",
      alt: "LinkedIn",
    },
    {
      key: "youtube",
      src: "/arbutus-web/assets/Footer/youtube.png",
      alt: "YouTube",
    },
    {
      key: "twitter",
      src: "/arbutus-web/assets/Footer/twitter.png",
      alt: "Twitter",
    },
  ].filter((item) => footer[item.key]);

  const mail = footer.mail || "info@altdb.ca";

  return (
    <footer className="relative w-full overflow-hidden bg-gradient-to-b from-[#1F47A8] via-[#12388A] to-[#0A2560] text-white">
      {/* WAVE TEXTURE */}
      <img
        src="/arbutus-web/assets/Footer/wave.png"
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-40 mix-blend-soft-light"
      />
      {/* top hairline highlight */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />

      <div className="relative z-10 mx-auto max-w-7xl px-5 pb-8 pt-12 sm:px-8 sm:pt-16">
        {/* MAIN GRID */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-12 md:grid-cols-12 md:gap-x-8">
          {/* BRAND + CONTACT */}
          <div className="col-span-2 min-w-0 md:col-span-6 lg:col-span-4">
            <img
              src="/arbutus-web/assets/Footer/logo.png"
              alt="AltDB"
              className="h-14 w-auto sm:h-16"
            />

            <p className="mt-5 max-w-sm text-[14px] leading-6 text-white/75">
              {footer["contact-us"] ||
                "Questions about the database or partnerships? We'd love to hear from you."}
            </p>

            <div className="mt-6 space-y-4">
              <div>
                <p className="mb-1 text-[13px] text-white/55">Mail us</p>
                <a
                  href={`mailto:${mail}`}
                  className="break-all text-[15px] font-medium text-white underline decoration-white/30 underline-offset-4 transition hover:decoration-white focus-visible:decoration-white focus-visible:outline-none"
                >
                  {mail}
                </a>
              </div>

              {footer.Phone && (
                <div>
                  <p className="mb-1 text-[13px] text-white/55">Call us</p>
                  <a
                    href={`tel:${footer.Phone}`}
                    className="text-[15px] font-medium text-white underline decoration-white/30 underline-offset-4 transition hover:decoration-white focus-visible:decoration-white focus-visible:outline-none"
                  >
                    {footer.Phone}
                  </a>
                </div>
              )}
            </div>

            {socialLinks.length > 0 && (
              <div className="mt-7">
                <p className="mb-3 text-[13px] text-white/55">Follow us</p>
                <div className="flex gap-3">
                  {socialLinks.map((item) => (
                    <a
                      key={item.key}
                      href={footer[item.key]}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={item.alt}
                      className="
                        flex h-10 w-10 items-center justify-center rounded-full
                        border border-white/20 bg-white/5 transition duration-300
                        hover:-translate-y-0.5 hover:border-white/60 hover:bg-white/15
                        focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white
                      "
                    >
                      <img src={item.src} alt="" className="h-4 w-4" />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* QUICK LINKS */}
          <div className="col-span-1 md:col-span-3 lg:col-span-2">
            <LinkColumn
              title="Quick Links"
              links={[
                { to: "/Altdbmain", label: "AltDB Database" },
                { to: "/Aboutmain", label: "About Us" },
                { to: "/Contactmain", label: "Contact Us" },
              ]}
            />
          </div>

          {/* TOOLS */}
          <div className="col-span-1 md:col-span-3 lg:col-span-2">
            <LinkColumn
              title="Tools"
              links={[
                { to: "/ArticlePage", label: "Commentary" },
                { to: "/PartnerDirectory", label: "Partner Directory" },
                { to: "/insightreports", label: "Insight Reports" },
              ]}
            />
          </div>

          {/* NEWSLETTER CARD (beside Tools) */}
          <div className="col-span-2 md:col-span-12 lg:col-span-4">
            <Newsletter />
          </div>
        </div>

        {/* BOTTOM BAR */}
        <div className="mt-14 flex flex-col items-center justify-between gap-5 border-t border-white/15 pt-6 text-center text-[13px] text-white/65 md:flex-row md:text-left">
          <p>{footer["All right"] || "© 2026 AltDB. All rights reserved."}</p>

          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
            <Link
              to="/TremsandCondition"
              onClick={scrollToTop}
              className="transition-colors hover:text-white focus-visible:text-white focus-visible:outline-none"
            >
              Terms of Policy
            </Link>
            <Link
              to="/Privacypolicy"
              onClick={scrollToTop}
              className="transition-colors hover:text-white focus-visible:text-white focus-visible:outline-none"
            >
              Privacy Policy
            </Link>
            <button
              type="button"
              onClick={scrollToTop}
              className="
                flex items-center gap-2 rounded-full border border-white/25 px-4 py-1.5
                text-white/85 transition hover:border-white/70 hover:bg-white/10 hover:text-white
                focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white
              "
            >
              Back to top
              <svg
                viewBox="0 0 24 24"
                className="h-3.5 w-3.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M12 19V5M6 11l6-6 6 6" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;