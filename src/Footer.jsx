import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ShieldAlert,
  Linkedin,
  Youtube,
  Twitter,
  Facebook,
} from "lucide-react";
import {
  useSendSubscribeMutation,
  useGetFooterQuery,
} from "./Redux/api/publicApiSlice";
import Swal from "sweetalert2";

const POPPINS = "'Poppins', sans-serif";

/* =========================================================
   COLORS
========================================================= */
const COLORS = {
  primary: "#0B4D8C",
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const scrollToTop = () =>
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });

const alert = (icon, title, text) =>
  Swal.fire({
    icon,
    title,
    text,
    confirmButtonColor: COLORS.primary,
  });

/* =========================================================
   HTML PARSER (heading + paragraphs) — used for Newsletter
========================================================= */
const parseContent = (html) => {
  if (!html || typeof html !== "string") return null;

  // Plain text (no HTML tags)
  if (!/<[a-z][\s\S]*>/i.test(html)) {
    return { title: "", text: html };
  }

  const doc = new DOMParser().parseFromString(html, "text/html");
  const headingEl = doc.querySelector("h1, h2, h3, h4, h5, h6");
  const paraEls = doc.querySelectorAll("p");

  const title = headingEl?.textContent?.trim() || "";
  const text = Array.from(paraEls)
    .map((p) => p.textContent.trim())
    .filter(Boolean)
    .join(" ");

  return { title, text };
};

/* =========================================================
   NEWSLETTER CARD
========================================================= */
function Newsletter({ description }) {
  const [email, setEmail] = useState("");
  const [sendSubscribe, { isLoading }] = useSendSubscribeMutation();

  const handleSubscribe = async () => {
    const trimmed = email.trim();

    if (!trimmed) {
      alert("error", "Email Required", "Please enter your email address.");
      return;
    }

    if (!EMAIL_REGEX.test(trimmed)) {
      alert(
        "warning",
        "Invalid Email",
        "Please enter a valid email address.",
      );
      return;
    }

    try {
      const res = await sendSubscribe({ email: trimmed }).unwrap();

      alert(
        "success",
        "Subscribed Successfully",
        res?.message ||
          "Your email address has been subscribed successfully!",
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

  const fallbackDescription =
    "Get the latest perspectives on wealth, legacy and family offices, delivered to your inbox.";

  const parsed = parseContent(description);

  const headingText = parsed?.title || "Insights for a brighter tomorrow";

  const descriptionText = parsed?.text ? parsed.text : fallbackDescription;

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
      style={{ fontFamily: POPPINS }}
    >
      {/* Soft glow */}
      <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-[#7FB2FF]/25 blur-3xl" />

      <div className="relative">
        <h3
          className="text-[20px] leading-[1.2] tracking-tight text-white sm:text-[22px] font-bold"
          style={{ fontFamily: POPPINS, fontWeight: 700 }}
        >
          {headingText}
        </h3>

        {descriptionText ? (
          <p
            className="mt-2.5 text-[13px] leading-6 text-white/75"
            style={{ fontFamily: POPPINS, fontWeight: 400 }}
          >
            {descriptionText}
          </p>
        ) : (
          <p
            className="mt-2.5 text-[13px] leading-6 text-white/75"
            style={{ fontFamily: POPPINS, fontWeight: 400 }}
          >
            {fallbackDescription}
          </p>
        )}

        <div
          className="
            mt-5 flex h-13 w-full items-center rounded-full bg-white p-1.5 pl-5
            shadow-lg ring-1 ring-white/40 transition
            focus-within:ring-4 focus-within:ring-[#7FB2FF]/50
          "
        >
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Enter your email address"
            aria-label="Email address"
            disabled={isLoading}
            className="
              min-w-0 flex-1 bg-transparent pr-2 text-[13px] text-[#111827]
              outline-none placeholder:text-[#9CA3AF]
              disabled:cursor-not-allowed disabled:opacity-60
            "
            style={{ fontFamily: POPPINS, fontWeight: 400 }}
          />

          <button
            type="button"
            onClick={handleSubscribe}
            disabled={isLoading}
            className="
              flex h-10 shrink-0 items-center gap-2 rounded-full px-5
              bg-[#0B4D8C] text-[13px] font-semibold text-white
              transition hover:bg-[#083B6B] active:scale-95
              focus-visible:outline focus-visible:outline-2
              focus-visible:outline-offset-2
              focus-visible:outline-[#0B4D8C]
              disabled:cursor-not-allowed disabled:opacity-70
            "
            style={{ fontFamily: POPPINS, fontWeight: 600 }}
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
  <nav aria-label={title} className="min-w-0" style={{ fontFamily: POPPINS }}>
    <h4
      className="mb-4 text-[13px] font-semibold text-white uppercase tracking-wider"
      style={{ fontFamily: POPPINS, fontWeight: 600, letterSpacing: "0.08em" }}
    >
      {title}
    </h4>

    <ul className="space-y-2.5">
      {links.map((link) => (
        <li key={link.to}>
          <Link
            to={link.to}
            onClick={scrollToTop}
            className="
              group inline-flex items-center text-[13px] text-white/70
              transition-colors hover:text-white
              focus-visible:text-white focus-visible:outline-none
            "
            style={{ fontFamily: POPPINS, fontWeight: 400 }}
          >
            <span
              className="
                mr-0 inline-block h-px w-0 bg-[#7FB2FF]
                transition-all duration-300
                group-hover:mr-2 group-hover:w-3
                group-focus-visible:mr-2 group-focus-visible:w-3
              "
            />
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
    { key: "linkedin", alt: "LinkedIn", Icon: Linkedin },
    { key: "youtube", alt: "YouTube", Icon: Youtube },
    { key: "twitter", alt: "Twitter", Icon: Twitter },
    { key: "facebook", alt: "Facebook", Icon: Facebook },
  ].filter((item) => footer[item.key]);

  const mail = footer.mail || "info@altdb.ca";

  return (
    <footer
      className="relative w-full overflow-hidden bg-gradient-to-b from-[#1F47A8] via-[#12388A] to-[#0A2560] text-white"
      style={{ fontFamily: POPPINS }}
    >
      {/* WAVE TEXTURE */}
      <img
        src="/arbutus-web/assets/Footer/wave.png"
        alt=""
        aria-hidden="true"
        className="
          pointer-events-none absolute inset-0 h-full w-full
          object-cover opacity-40 mix-blend-soft-light
        "
      />

      {/* TOP HAIRLINE */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />

      <div
        className="
          relative z-10 mx-auto max-w-7xl
          px-5 pb-7 pt-10 sm:px-8 sm:pt-14
        "
      >
        {/* MAIN GRID */}
        <div
          className="
            grid grid-cols-2 gap-x-6 gap-y-10
            md:grid-cols-12 md:gap-x-8
          "
        >
          {/* BRAND + CONTACT */}
          <div className="col-span-2 min-w-0 md:col-span-6 lg:col-span-4">
            <img
              src="/arbutus-web/assets/Footer/logo.png"
              alt="AltDB"
              className="h-12 w-auto sm:h-14"
            />

            {/* CONTACT-US HTML RENDERED (supports <p>, <br>, <h1>-<h6>) */}
            {footer["contact-us"] ? (
              <div
                className="
                  mt-4 max-w-sm text-[13px] leading-6 text-white/75
                  [&_h1]:text-[14px] [&_h1]:font-semibold [&_h1]:text-white [&_h1]:mb-1
                  [&_h2]:text-[14px] [&_h2]:font-semibold [&_h2]:text-white [&_h2]:mb-1
                  [&_h3]:text-[14px] [&_h3]:font-semibold [&_h3]:text-white [&_h3]:mb-1
                  [&_h4]:text-[14px] [&_h4]:font-semibold [&_h4]:text-white [&_h4]:mb-1
                  [&_h5]:text-[14px] [&_h5]:font-semibold [&_h5]:text-white [&_h5]:mb-1
                  [&_h6]:text-[14px] [&_h6]:font-semibold [&_h6]:text-white [&_h6]:mb-1
                  [&_p]:m-0 [&_p]:text-[13px] [&_p]:leading-6 [&_p]:text-white/75
                  [&_p+p]:mt-1.5
                "
                style={{ fontFamily: POPPINS, fontWeight: 400 }}
                dangerouslySetInnerHTML={{ __html: footer["contact-us"] }}
              />
            ) : (
              <p
                className="mt-4 max-w-sm text-[13px] leading-6 text-white/75"
                style={{ fontFamily: POPPINS, fontWeight: 400 }}
              >
                Questions about the database or partnerships? We'd love to hear
                from you.
              </p>
            )}

            <div className="mt-5 space-y-3.5">
              {/* MAIL */}
              <div>
                <p
                  className="mb-1 text-[12px] text-white/55"
                  style={{ fontFamily: POPPINS, fontWeight: 400 }}
                >
                  Mail us
                </p>

                <a
                  href={`mailto:${mail}`}
                  className="
                    break-all text-[14px] font-medium text-white
                    underline decoration-white/30 underline-offset-4
                    transition hover:decoration-white
                    focus-visible:decoration-white
                    focus-visible:outline-none
                  "
                  style={{ fontFamily: POPPINS, fontWeight: 500 }}
                >
                  {mail}
                </a>
              </div>

              {/* PHONE */}
              {footer.Phone && (
                <div>
                  <p
                    className="mb-1 text-[12px] text-white/55"
                    style={{ fontFamily: POPPINS, fontWeight: 400 }}
                  >
                    Call us
                  </p>

                  <a
                    href={`tel:${footer.Phone}`}
                    className="
                      text-[14px] font-medium text-white
                      underline decoration-white/30 underline-offset-4
                      transition hover:decoration-white
                      focus-visible:decoration-white
                      focus-visible:outline-none
                    "
                    style={{ fontFamily: POPPINS, fontWeight: 500 }}
                  >
                    {footer.Phone}
                  </a>
                </div>
              )}
            </div>

            {/* SOCIAL */}
            {socialLinks.length > 0 && (
              <div className="mt-6">
                <p
                  className="mb-2.5 text-[12px] text-white/55"
                  style={{ fontFamily: POPPINS, fontWeight: 400 }}
                >
                  Follow us
                </p>

                <div className="flex gap-2.5">
                  {socialLinks.map(({ key, alt, Icon }) => (
                    <a
                      key={key}
                      href={footer[key]}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={alt}
                      className="
                        flex h-9 w-9 items-center justify-center
                        rounded-full border border-white/20
                        bg-white/5 transition duration-300
                        hover:-translate-y-0.5
                        hover:border-white/60
                        hover:bg-white/15
                        focus-visible:outline
                        focus-visible:outline-2
                        focus-visible:outline-offset-2
                        focus-visible:outline-white
                      "
                    >
                      <Icon size={15} strokeWidth={2} aria-hidden="true" />
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

          {/* NEWSLETTER */}
          <div className="col-span-2 md:col-span-12 lg:col-span-4">
            <Newsletter description={footer["Newsletter Sign Up"]} />
          </div>
        </div>

        {/* BOTTOM BAR */}
        <div
          className="
            mt-12 flex flex-col items-center justify-between
            gap-4 border-t border-white/15 pt-5
            text-center text-[12px] text-white/65
            md:flex-row md:text-left
          "
        >
          <p style={{ fontFamily: POPPINS, fontWeight: 400 }}>
            {footer["All right"] || "© 2026 AltDB. All rights reserved."}
          </p>

          <div
            className="
              flex flex-wrap items-center justify-center
              gap-x-5 gap-y-2.5
            "
          >
            {/* DISCLAIMER */}
            <Link
              to="/Disclaimer"
              onClick={scrollToTop}
              className="
                group inline-flex items-center gap-1.5
                transition-colors hover:text-white
                focus-visible:text-white focus-visible:outline-none
              "
              style={{ fontFamily: POPPINS, fontWeight: 400 }}
            >
              <ShieldAlert
                size={14}
                strokeWidth={2}
                className="
                  opacity-80 transition-transform duration-300
                  group-hover:-translate-y-0.5
                "
                aria-hidden="true"
              />
              <span>Disclaimer</span>
            </Link>

            {/* TERMS */}
            <Link
              to="/TremsandCondition"
              onClick={scrollToTop}
              className="
                transition-colors hover:text-white
                focus-visible:text-white focus-visible:outline-none
              "
              style={{ fontFamily: POPPINS, fontWeight: 400 }}
            >
              Terms of Policy
            </Link>

            {/* PRIVACY */}
            <Link
              to="/Privacypolicy"
              onClick={scrollToTop}
              className="
                transition-colors hover:text-white
                focus-visible:text-white focus-visible:outline-none
              "
              style={{ fontFamily: POPPINS, fontWeight: 400 }}
            >
              Privacy Policy
            </Link>

            {/* BACK TO TOP */}
            <button
              type="button"
              onClick={scrollToTop}
              className="
                flex items-center gap-2 rounded-full
                border border-white/25 px-3.5 py-1.5
                text-white/85 transition
                hover:border-white/70
                hover:bg-white/10
                hover:text-white
                focus-visible:outline
                focus-visible:outline-2
                focus-visible:outline-offset-2
                focus-visible:outline-white
              "
              style={{ fontFamily: POPPINS, fontWeight: 500 }}
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