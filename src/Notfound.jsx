import React from "react";
import { Link } from "react-router-dom";

const Notfound = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 px-4">
      <div className="flex flex-col md:flex-row items-center justify-center max-w-5xl gap-12">
        {/* Left Content */}
        <div className="flex flex-col items-start text-left max-w-md">
          <h1 className="text-8xl font-bold text-slate-700 mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-gray-800 mb-3">
            You weren't meant to see this...
          </h2>
          <p className="text-gray-500 mb-8 leading-relaxed">
            Either the internet has broken or we couldn't find the file that you
            were looking for.
          </p>
          <Link to="/">
          <button className="px-8 py-3 cursor-pointer bg-slate-600 text-white rounded-full hover:bg-slate-700 transition-all duration-300 shadow-lg hover:shadow-xl">
            Take Me Back
          </button>
          </Link>
        </div>

        {/* Right Illustration */}
        <div className="relative">
          <svg
            width="300"
            height="300"
            viewBox="0 0 300 300"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="animate-float"
          >
            {/* Magnifying Glass Handle */}
            <path
              d="M180 80 L240 20"
              stroke="#94a3b8"
              strokeWidth="12"
              strokeLinecap="round"
            />
            <path
              d="M175 85 L235 25"
              stroke="#cbd5e1"
              strokeWidth="8"
              strokeLinecap="round"
            />

            {/* Magnifying Glass Rim */}
            <circle
              cx="140"
              cy="120"
              r="65"
              fill="none"
              stroke="#94a3b8"
              strokeWidth="8"
            />
            <circle
              cx="140"
              cy="120"
              r="58"
              fill="none"
              stroke="#cbd5e1"
              strokeWidth="3"
            />

            {/* Glass Lens (with gradient) */}
            <defs>
              <radialGradient id="glassGradient" cx="0.3" cy="0.3">
                <stop offset="0%" stopColor="#e0f2fe" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#bae6fd" stopOpacity="0.3" />
              </radialGradient>
            </defs>
            <circle cx="140" cy="120" r="55" fill="url(#glassGradient)" />

            {/* Glass Reflection */}
            <ellipse
              cx="125"
              cy="105"
              rx="20"
              ry="25"
              fill="white"
              opacity="0.5"
            />

            {/* Handle End Circle */}
            <circle
              cx="245"
              cy="15"
              r="12"
              fill="#7dd3fc"
              stroke="#38bdf8"
              strokeWidth="3"
            />

            {/* Magnifying Glass Lid/Pan */}
            <ellipse
              cx="140"
              cy="230"
              rx="90"
              ry="25"
              fill="#e2e8f0"
              stroke="#cbd5e1"
              strokeWidth="4"
            />
            <ellipse cx="140" cy="227" rx="85" ry="22" fill="#f1f5f9" />

            {/* Pan Inner Shadow */}
            <ellipse
              cx="140"
              cy="227"
              rx="75"
              ry="18"
              fill="#e2e8f0"
              opacity="0.5"
            />

            {/* Search Dots/Particles */}
            <circle cx="100" cy="180" r="4" fill="#94a3b8" opacity="0.6">
              <animate
                attributeName="opacity"
                values="0.6;0.2;0.6"
                dur="2s"
                repeatCount="indefinite"
              />
            </circle>
            <circle cx="115" cy="195" r="3" fill="#94a3b8" opacity="0.4">
              <animate
                attributeName="opacity"
                values="0.4;0.1;0.4"
                dur="2.5s"
                repeatCount="indefinite"
              />
            </circle>
            <circle cx="130" cy="185" r="3.5" fill="#94a3b8" opacity="0.5">
              <animate
                attributeName="opacity"
                values="0.5;0.15;0.5"
                dur="1.8s"
                repeatCount="indefinite"
              />
            </circle>
          </svg>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default Notfound;
