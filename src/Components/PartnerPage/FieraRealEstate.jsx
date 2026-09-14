import React from "react";
import {
  Home,
  Share2,
  Settings,
  MapPin,
  ArrowRight,
  Twitter,
  Linkedin,
  Search,
} from "lucide-react";

import Building from "../../../public/assets/img4.png";
import Logo from "../../../public/assets/img6.png";
import Proj5 from "../../../public/assets/img5.png";
import Proj4 from "../../../public/assets/img4.png";
import Proj3 from "../../../public/assets/img3.png";
import Proj2 from "../../../public/assets/img2.png";
import Proj1 from "../../../public/assets/img1.png";

const HERO_IMG = Building;
const ARTICLE_IMG = Proj5;

const FEATURES = [
  {
    icon: Home,
    color: "text-lime-700",
    bg: "bg-lime-50",
    title: "Expertise",
    text: "An entrepreneurial team enabling institutional and family-office clients to benefit from a unique combination of creativity and innovation supported by industry-leading expertise and investment analysis.",
  },
  {
    icon: Share2,
    color: "text-sky-600",
    bg: "bg-sky-50",
    title: "Diversification",
    text: "An entrepreneurial team enabling institutional and family-office clients to benefit from a unique combination of creativity and innovation supported by industry-leading expertise and investment analysis.",
  },
  {
    icon: Settings,
    color: "text-teal-600",
    bg: "bg-teal-50",
    title: "Business Model",
    text: "We collaborate with a network of property managers, external development managers and leasing groups in every market to obtain the best insights and remain agile, partnering with top-tier talent to uphold the highest standards.",
  },
];

const ARTICLES = [
  {
    tag: "Commentary",
    title:
      "Canada's 2025 Caprate Update: highlights tightening credit conditions, rising rents, and shrinking margins for market-integrated assets.",
    date: "Jul 13, 2025 | 10:00:00 AM",
  },
  {
    tag: "Insights",
    title:
      "Canada's 2025 Caprate Update: highlights tightening credit conditions, rising rents, and shrinking margins for market-integrated assets.",
    date: "Jul 13, 2025 | 10:00:00 AM",
  },
  {
    tag: "News Letter",
    title:
      "Canada's 2025 Caprate Update: highlights tightening credit conditions, rising rents, and shrinking margins for market-integrated assets.",
    date: "Jul 13, 2025 | 10:00:00 AM",
  },
];

const FeatureCard = ({ icon: Icon, color, bg, title, text }) => (
  <div className="flex flex-col items-start text-left">
    <div
      className={`w-12 h-12 rounded-full ${bg} flex items-center justify-center mb-5 ${color}`}
    >
      <Icon size={22} strokeWidth={1.75} />
    </div>
    <h3 className="text-sm font-bold tracking-wider uppercase text-gray-900 mb-3">
      {title}
    </h3>
    <p className="text-sm text-gray-500 leading-relaxed">{text}</p>
  </div>
);

const FieraRealEstate = () => {
  return (
    <div className="font-sans text-gray-800 bg-white">
      {/* --- HERO SECTION (shorter banner) --- */}
      <header className="relative w-full h-[70vh] min-h-[480px] overflow-hidden">
        {/* Full-bleed background image */}
        <img
          src={HERO_IMG}
          alt="Modern Building"
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Gradient scrim so text stays legible over the photo */}
        <div className="absolute inset-0 bg-gradient-to-r from-white via-white/85 lg:via-white/60 to-transparent" />

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto h-full px-6 lg:px-10 flex flex-col justify-center">
          <div className="w-full lg:w-[46%]">
            {/* Bigger logo */}
            <div className="flex items-center gap-3 mb-6">
              <img
                src={Logo}
                alt="Fiera Logo"
                className="w-46 h-16 object-contain"
              />
              <div className="leading-tight">
                
              </div>
            </div>

            <span className="text-[11px] font-semibold tracking-widest text-gray-400 mb-2 uppercase">
              Member
            </span>
            <h1 className="text-4xl md:text-5xl font-extrabold text-[#0B4D8C] leading-tight tracking-tight mb-3">
              FIERA REAL ESTATE
            </h1>

            <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-xs text-gray-500 mb-5">
              <span>Real Estate Investment Management</span>
              <span className="flex items-center gap-1">
                <MapPin size={12} /> Toronto, Montreal and Halifax
              </span>
            </div>

            <p className="text-gray-600 text-sm mb-8 max-w-md leading-relaxed">
              Fiera Real Estate is a team of experienced real estate
              professionals committed to delivering exceptional investment
              performance for its clients, including those in the family office
              space. Fiera Real Estate is a culture of innovation, integrity and
              ownership of every task.
            </p>

            <div className="flex flex-wrap gap-3">
              <button className="px-6 py-2.5 rounded-full font-semibold text-xs tracking-wide bg-[#0B4D8C] text-white flex items-center gap-2 hover:bg-[#083b6b] transition-colors">
                <Twitter size={14} /> TWITTER
              </button>
              <button className="px-6 py-2.5 rounded-full font-semibold text-xs tracking-wide bg-white text-gray-700 border border-gray-300 flex items-center gap-2 hover:border-gray-500 transition-colors">
                <Linkedin size={14} /> LINKEDIN
              </button>
            </div>
          </div>
        </div>

        {/* Scroll cue */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 hidden lg:flex flex-col items-center gap-2 text-white/80">
          <span className="text-[10px] tracking-[0.25em] uppercase">
            Scroll
          </span>
          <div className="w-px h-8 bg-white/60" />
        </div>
      </header>

      {/* --- FEATURES GRID SECTION --- */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-12 gap-y-14">
            {FEATURES.map((f, i) => (
              <FeatureCard key={`row1-${i}`} {...f} />
            ))}
            {FEATURES.map((f, i) => (
              <FeatureCard key={`row2-${i}`} {...f} />
            ))}
          </div>
        </div>
      </section>

      {/* --- PROJECTS / GALLERY SECTION --- */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 flex flex-col lg:flex-row gap-14 items-start">
          {/* Gallery */}
          <div className="w-full lg:w-3/5 flex flex-col gap-4">
            <div className="flex gap-4 h-[180px] lg:h-[220px]">
              <img
                src={Proj1}
                alt="Project 1"
                className="w-1/2 h-full object-cover rounded"
              />
              <img
                src={Proj2}
                alt="Project 2"
                className="w-1/2 h-full object-cover rounded"
              />
            </div>
            <div className="w-full h-[180px] lg:h-[220px]">
              <img
                src={Proj3}
                alt="Project 3"
                className="w-full h-full object-cover rounded"
              />
            </div>
          </div>

          {/* Text */}
          <div className="w-full lg:w-2/5 pt-2">
            <h4 className="text-[11px] font-bold tracking-[0.2em] text-gray-400 uppercase mb-3">
              Our Perspective
            </h4>
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 leading-tight mb-5">
              INVESTING IN STRONGER COMMUNITIES
            </h2>
            <p className="text-gray-600 text-sm leading-relaxed mb-7">
              Fiera Real Estate seeks to create long-term value through
              high-quality real estate investments across diverse markets and
              asset classes.
            </p>
            <a
              href="#"
              className="inline-flex items-center gap-2 text-[#0B4D8C] font-semibold text-xs tracking-wide hover:gap-3 transition-all duration-300"
            >
              LEARN MORE ABOUT OUR APPROACH <ArrowRight size={14} />
            </a>
          </div>
        </div>
      </section>

      {/* --- RELATED ARTICLES SECTION --- */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="flex justify-between items-center border-b border-gray-200 pb-4 mb-10">
            <h3 className="text-lg font-bold text-gray-900">
              Related Articles
            </h3>
            <a
              href="#"
              className="text-xs font-semibold text-gray-500 hover:text-[#0B4D8C] flex items-center gap-1 transition-colors"
            >
              View All <ArrowRight size={13} />
            </a>
          </div>

          <div className="flex flex-col lg:flex-row gap-10">
            {/* Articles list */}
            <div className="w-full lg:w-3/5 flex flex-col gap-8">
              {ARTICLES.map((a, i) => (
                <div
                  key={i}
                  className={i !== 0 ? "pt-8 border-t border-gray-100" : ""}
                >
                  <span className="text-[11px] font-bold tracking-wider text-[#0B4D8C] uppercase mb-2 block">
                    {a.tag}
                  </span>
                  <h4 className="text-sm font-semibold text-gray-900 leading-snug mb-2">
                    {a.title}
                  </h4>
                  <p className="text-xs text-gray-400">{a.date}</p>
                </div>
              ))}
            </div>

            {/* Side image */}
            <div className="w-full lg:w-2/5">
              <div className="relative rounded overflow-hidden h-[280px] lg:h-full">
                <img
                  src={ARTICLE_IMG}
                  alt="Market insights"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent flex items-end p-4">
                  <Search className="text-white/90" size={22} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FieraRealEstate;
