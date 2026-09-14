import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  useSendSubscribeMutation,
  useGetFooterQuery,
} from "./Redux/api/publicApiSlice";
import Swal from "sweetalert2";
import { FaFacebookF } from "react-icons/fa";

const Footer = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const { data: footerRes } = useGetFooterQuery();
  const footer = footerRes?.data || {};

  const [sendSubscribe, { isLoading }] = useSendSubscribeMutation();

  const handleSubscribe = async () => {
    if (!email) {
      Swal.fire("Error", "Please enter your email address.", "error");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Swal.fire(
        "Invalid Email",
        "Please enter a valid email address.",
        "warning"
      );
      return;
    }

    try {
      const res = await sendSubscribe({ email }).unwrap();
      Swal.fire(
        "Success",
        res?.message || "Email address saved successfully!",
        "success"
      );
      setEmail("");
    } catch (error) {
      Swal.fire(
        "Failed",
        error?.data?.message || "Something went wrong",
        "error"
      );
    }
  };

  const handleNavigation = (path) => {
    navigate(path);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative bg-[#2A57C4] overflow-hidden">
      {/* WAVE */}
      <img
        src="/arbutus-web/assets/Footer/wave.png"
        alt="wave"
        className="absolute top-0 left-0 w-full h-full object-cover"
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-6 pb-8">
        {/* LOGO + SOCIAL */}
        <div className="flex flex-col md:flex-row justify-between items-start">
          <img
            src="/arbutus-web/assets/Footer/logo.png"
            alt="AltDB"
            className="h-18"
          />

          <div className="mt-6 md:mt-0 text-sm md:text-right">
            <p className="mb-2 text-white/80">Follow us on:</p>
            <div className="flex md:justify-end gap-4">
              {footer.linkedin && (
                <a href={footer.linkedin} target="_blank" rel="noreferrer">
                  <img
                    src="/arbutus-web/assets/Footer/linkedin.png"
                    className="w-5 h-5 cursor-pointer"
                    alt="linkedin"
                  />
                </a>
              )}

              {/* {footer.facebook && (
                <a
                  href={footer.facebook}
                  target="_blank"
                  rel="noreferrer"
                  className="w-5 h-5 rounded-full bg-white flex items-center justify-center hover:scale-110 transition-all duration-300"
                >
                  <FaFacebookF className="text-white text-sm" />
                </a>
              )} */}
              
              {footer.youtube && (
                <a href={footer.youtube} target="_blank" rel="noreferrer">
                  <img
                    src="/arbutus-web/assets/Footer/youtube.png"
                    className="w-5 h-5 cursor-pointer"
                    alt="youtube"
                  />
                </a>
              )}

              {footer.twitter && (
                <a href={footer.twitter} target="_blank" rel="noreferrer">
                  <img
                    src="/arbutus-web/assets/Footer/twitter.png"
                    className="w-5 h-5 cursor-pointer"
                    alt="twitter"
                  />
                </a>
              )}
            </div>
          </div>
        </div>

        {/* DIVIDER */}
        <div className="my-5 h-px bg-white/30" />

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 text-sm text-white">
          {/* CONTACT */}
          <div>
            <h4 className="font-semibold mb-4">Contact us</h4>
            <p className="text-white/70 mb-4">
              {footer["contact-us"] || "Lorem ipsum dolor sit amet consectetur adipiscing elitcdd"}
            </p>

            <p className="text-white/70 mb-1">Mail us:</p>
            <a
              href={`mailto:${footer.mail || "info@altdb.ca"}`}
              className="underline hover:text-white"
            >
              {footer.mail || "info@altdb.ca"}
            </a>

            {footer.Phone && (
              <>
                <p className="text-white/70 mt-2 mb-1">Call us:</p>
                <a
                  href={`tel:${footer.Phone}`}
                  className="underline hover:text-white"
                >
                  {footer.Phone}
                </a>
              </>
            )}
          </div>

          {/* QUICK LINKS */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-white/70">
              <li>
                <Link
                  to="/AltDatabaseMain"
                  onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                  className="hover:text-white transition-colors"
                >
                  AltDB Database
                </Link>
              </li>
              <li>
                <Link
                  to="/Newsmain"
                  onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                  className="hover:text-white transition-colors"
                >
                  Newsletter
                </Link>
              </li>
              <li>
                <Link
                  to="/Aboutmain"
                  onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                  className="hover:text-white transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/Resarchmain"
                  onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                  className="hover:text-white transition-colors"
                >
                  Research
                </Link>
              </li>
              <li>
                <Link
                  to="/Levelmain"
                  onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                  className="hover:text-white transition-colors"
                >
                  Levels
                </Link>
              </li>
              <li>
                <Link
                  to="/Contactmain"
                  onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                  className="hover:text-white transition-colors"
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* TOOLS */}
          <div>
            <h4 className="font-semibold mb-4">Tools</h4>
            <button
              onClick={() => handleNavigation("/Resarchmain")}
              className="text-white/70 hover:text-white transition-colors cursor-pointer bg-transparent border-none p-0 font-inherit text-sm"
            >
              AltDB Screener
            </button>
          </div>

          {/* SUBSCRIBE */}
          <div>
            <h4 className="font-semibold mb-4">
              Subscribe for updates & periodic newsletter
            </h4>

            <div className="relative mt-6">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your Email Address"
                className="w-full h-12 rounded-full bg-white/20 px-5 pr-14 placeholder:text-white/70 outline-none text-white"
              />

              <button
                onClick={handleSubscribe}
                disabled={isLoading}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <img
                    src="/arbutus-web/assets/Footer/arrow-right.png"
                    alt="submit"
                    className="w-12 h-12 object-cover"
                  />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* BOTTOM */}
        <div className="my-10 h-px bg-white/30" />

        <div className="flex flex-col md:flex-row justify-between items-center text-sm text-white/80">
          <p>{footer["All right"] || "© 2026 AltDB. All rights reserved."}</p>
          <div className="flex gap-4 mt-2 md:mt-0">
            <Link
              to="/TremsandCondition"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="hover:text-white transition-colors"
            >
              Terms of Policy
            </Link>
            <Link
              to="/Privacypolicy"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="hover:text-white transition-colors"
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