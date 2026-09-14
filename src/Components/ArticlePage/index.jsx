import React from "react";
import {
  Share2,
  Bookmark,
  Linkedin,
  Link2,
  ChevronDown,
  ArrowRight,
  Search,
  User,
} from "lucide-react";

// Local images
import FeaturedMain from "../../../public/assets/img1.png";
import FeaturedMain2 from "../../../public/assets/img7.png";
import FeaturedSunset from "../../../public/assets/img2.png";
import CtaBanner from "../../../public/assets/img4.png";
import AuthorImg from "../../../public/assets/img3.png";
import SideImg1 from "../../../public/assets/img5.png";
import SideImg2 from "../../../public/assets/img6.png";
import MemberLogo1 from "../../../public/assets/img1.png";
import MemberLogo2 from "../../../public/assets/img2.png";
import MemberLogo3 from "../../../public/assets/img3.png";
import MemberLogo4 from "../../../public/assets/img4.png";
import SmallArticle1 from "../../../public/assets/img5.png";
import SmallArticle2 from "../../../public/assets/img6.png";

/* =========================================================
   DATA
========================================================= */

const SIDEBAR_ARTICLES = [
  {
    tag: "DAILY ETF FLOWS",
    title:
      "The largest inflows in emerging markets focused on China's 2025 stimulus measures.",
    date: "Jul 13, 2025",
    image: SideImg1,
  },
  {
    tag: "DAILY ETF FLOWS",
    title:
      "The largest inflows in emerging markets focused on China's 2025 stimulus measures.",
    date: "Jul 13, 2025",
    image: SideImg2,
  },
  {
    tag: "DAILY ETF FLOWS",
    title:
      "The largest inflows in emerging markets focused on China's 2025 stimulus measures.",
    date: "Jul 13, 2025",
    image: SmallArticle1,
  },
  {
    tag: "DAILY ETF FLOWS",
    title:
      "The largest inflows in emerging markets focused on China's 2025 stimulus measures.",
    date: "Jul 13, 2025",
    image: SmallArticle2,
  },
  {
    tag: "DAILY ETF FLOWS",
    title:
      "The largest inflows in emerging markets focused on China's 2025 stimulus measures.",
    date: "Jul 13, 2025",
    image: SideImg1,
  },
  {
    tag: "DAILY ETF FLOWS",
    title:
      "The largest inflows in emerging markets focused on China's 2025 stimulus measures.",
    date: "Jul 13, 2025",
    image: SideImg2,
  },
  {
    tag: "DAILY ETF FLOWS",
    title:
      "The largest inflows in emerging markets focused on China's 2025 stimulus measures.",
    date: "Jul 13, 2025",
    image: SmallArticle1,
  },
  {
    tag: "DAILY ETF FLOWS",
    title:
      "The largest inflows in emerging markets focused on China's 2025 stimulus measures.",
    date: "Jul 13, 2025",
    image: SmallArticle2,
  },
];

const COMMENTARY_SIDE = [
  {
    tag: "COMMENTARY",
    title:
      "The largest inflows in emerging markets focused on China's 2025 stimulus measures.",
    date: "Jul 12, 2025",
    image: SideImg1,
  },
  {
    tag: "COMMENTARY",
    title:
      "The largest inflows in emerging markets focused on China's 2025 stimulus measures.",
    date: "Jul 12, 2025",
    image: SideImg2,
  },
  {
    tag: "COMMENTARY",
    title:
      "The largest inflows in emerging markets focused on China's 2025 stimulus measures.",
    date: "Jul 12, 2025",
    image: SmallArticle2,
  },
];

const MEMBERS = [
  {
    logo: MemberLogo1,
    name: "PearTree",
    text: "PearTree Canada provides families with straightforward, accessible and low cost options for impact and philanthropy in Canada.",
  },
  {
    logo: MemberLogo2,
    name: "Canso",
    text: "Canso provides access to the institutional approach to fixed income that we've been implementing for institutional clients for over 25 years.",
  },
  {
    logo: MemberLogo3,
    name: "Prime Quadrant",
    text: "Prime Quadrant is a full-service investment advisory firm that helps affluent families make informed investment decisions.",
  },
  {
    logo: MemberLogo4,
    name: "EQUITON",
    text: "Equiton is a private equity firm offering real estate investment solutions to Canadian investors, focused on income and long-term capital appreciation.",
  },
];

/* =========================================================
   SIDEBAR ARTICLE
========================================================= */

const SidebarArticle = ({ article }) => {
  return (
    <article className="group border-b border-[#e8e8e8] py-4 first:pt-3">
      <div className="flex gap-4 items-start">
        <div className="min-w-0 flex-1">
          <span className="block text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.08em] text-[#777] mb-2">
            {article.tag}
          </span>

          <h4 className="text-[13px] sm:text-[14px] leading-[1.4] font-semibold text-[#1b1b1b] line-clamp-3">
            {article.title}
          </h4>

          <div className="mt-2 flex items-center gap-1.5 text-[10px] sm:text-[11px] text-[#999]">
            <User size={12} strokeWidth={1.5} />
            <span>{article.date}</span>
          </div>
        </div>

        <img
          src={article.image}
          alt=""
          className="w-[72px] h-[58px] sm:w-[78px] sm:h-[64px] object-cover flex-shrink-0 rounded-[4px]"
        />
      </div>
    </article>
  );
};

/* =========================================================
   COMMENTARY CARD
========================================================= */

const CommentaryCard = ({ article }) => {
  return (
    <article className="flex gap-4 border-b border-[#e8e8e8] pb-4 last:border-0">
      <div className="min-w-0 flex-1">
        <span className="block text-[10px] font-bold uppercase tracking-[0.08em] text-[#777] mb-2">
          {article.tag}
        </span>

        <h4 className="text-[13px] sm:text-[14px] leading-[1.4] font-semibold text-[#222] line-clamp-3">
          {article.title}
        </h4>

        <p className="mt-2 text-[10px] sm:text-[11px] text-[#999]">
          {article.date}
        </p>
      </div>

      <img
        src={article.image}
        alt=""
        className="w-[82px] h-[64px] sm:w-[95px] sm:h-[72px] object-cover rounded-[4px] flex-shrink-0"
      />
    </article>
  );
};

/* =========================================================
   MEMBER CARD
========================================================= */

const MemberCard = ({ member }) => {
  return (
    <article className="min-w-0">
      <div className="h-[55px] flex items-center mb-4">
        <img
          src={member.logo}
          alt={member.name}
          className="max-h-[42px] max-w-[145px] object-contain object-left"
        />
      </div>

      <p className="text-[12px] sm:text-[13px] leading-[1.65] text-[#777] max-w-[420px]">
        {member.text}
      </p>
    </article>
  );
};

/* =========================================================
   ARTICLE FEED CARD
========================================================= */

const ArticleFeedCard = ({ article }) => {
  return (
    <article className="flex items-center gap-4 py-4 border-b border-[#e8e8e8] last:border-0">
      <div className="flex-1 min-w-0">
        <span className="block text-[10px] font-bold uppercase tracking-[0.08em] text-[#777] mb-2">
          {article.tag}
        </span>

        <h4 className="text-[13px] sm:text-[14px] font-semibold leading-[1.45] text-[#222] line-clamp-2">
          {article.title}
        </h4>

        <p className="text-[10px] sm:text-[11px] text-[#999] mt-2">
          {article.date}
        </p>
      </div>

      <img
        src={article.image}
        alt=""
        className="w-[68px] h-[62px] sm:w-[76px] sm:h-[68px] object-cover rounded-[4px] flex-shrink-0"
      />
    </article>
  );
};

/* =========================================================
   MAIN PAGE
========================================================= */

const ArticlePage = () => {
  return (
    <>
      {/* Poppins Font Import */}
      <style>
        {`@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800;900&display=swap');`}
      </style>

      <div
        className="min-h-screen bg-white text-[#222]"
        style={{ fontFamily: "'Poppins', sans-serif" }}
      >
        <div className="max-w-[1320px] mx-auto px-5 sm:px-8 lg:px-12">
          {/* =================================================
              MAIN CONTENT
          ================================================= */}

          <section className="py-10 sm:py-14 lg:py-16">
            <div className="grid grid-cols-1 lg:grid-cols-[290px_minmax(0,1fr)] gap-10 lg:gap-[60px]">
              {/* =================================================
                  LEFT SIDEBAR
              ================================================= */}

              <aside className="order-2 lg:order-1">
                <div className="flex items-center justify-between border-b border-[#d8d8d8] pb-3 mb-1">
                  <h3 className="text-[16px] sm:text-[17px] font-bold text-[#1c1c1c]">
                    Related Articles
                  </h3>

                  <button className="flex items-center gap-1.5 text-[11px] font-semibold text-[#3764aa] hover:text-[#111] transition">
                    View All
                    <ArrowRight size={13} />
                  </button>
                </div>

                <div>
                  {SIDEBAR_ARTICLES.map((article, index) => (
                    <SidebarArticle
                      article={article}
                      key={`${article.title}-${index}`}
                    />
                  ))}
                </div>

                <button className="w-full mt-6 py-3 border border-[#d8d8d8] rounded-full text-[11px] sm:text-[12px] font-semibold text-[#555] flex items-center justify-center gap-2 hover:border-[#999] transition">
                  Load More
                  <ChevronDown size={14} />
                </button>
              </aside>

              {/* =================================================
                  RIGHT MAIN ARTICLE
              ================================================= */}

              <main className="order-1 lg:order-2 min-w-0">
                {/* =================================================
                    ARTICLE HEADER
                ================================================= */}

                <header className="mb-8">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.14em] text-[#777]">
                      Commentary
                    </span>

                    <span className="h-[1px] w-[45px] bg-[#d5d5d5]" />
                  </div>

                  <h1 className="text-[22px] sm:text-[27px] lg:text-[31px] leading-[1.08] font-bold tracking-[-0.035em] text-[#151515] mb-5 max-w-[900px]">
                    Smarter decisions start here, powered by AI, Automates
                  </h1>

                  <p className="text-[14px] sm:text-[15px] lg:text-[16px] leading-[1.65] text-[#777] max-w-[850px] mb-7">
                    Artificial intelligence transforms data into insight,
                    information into clarity, and powers smarter decisions. We
                    are focused on delivering businesses a smarter, simpler and
                    more intelligent way to work.
                  </p>

                  {/* Author + Social */}
                  <div className="flex items-center">
                    <img
                      src={AuthorImg}
                      alt="Author"
                      className="w-[42px] h-[42px] sm:w-[46px] sm:h-[46px] rounded-full object-cover mr-3"
                    />

                    <div>
                      <p className="text-[12px] sm:text-[13px] font-semibold text-[#222]">
                        By Charles Marrison
                      </p>

                      <p className="text-[10px] sm:text-[11px] text-[#999] mt-1">
                        July 25, 2025&nbsp; • &nbsp;5 min read
                      </p>
                    </div>

                    <div className="ml-auto flex items-center gap-2">
                      <button
                        type="button"
                        className="w-[34px] h-[34px] rounded-full border border-[#e3e3e3] flex items-center justify-center text-[#777] hover:text-[#111] hover:border-[#aaa] transition"
                      >
                        <Linkedin size={14} />
                      </button>

                      <button
                        type="button"
                        className="w-[34px] h-[34px] rounded-full border border-[#e3e3e3] flex items-center justify-center text-[#777] hover:text-[#111] hover:border-[#aaa] transition"
                      >
                        <Share2 size={14} />
                      </button>

                      <button
                        type="button"
                        className="w-[34px] h-[34px] rounded-full border border-[#e3e3e3] flex items-center justify-center text-[#777] hover:text-[#111] hover:border-[#aaa] transition"
                      >
                        <Link2 size={14} />
                      </button>

                      <button
                        type="button"
                        className="w-[34px] h-[34px] rounded-full border border-[#e3e3e3] flex items-center justify-center text-[#777] hover:text-[#111] hover:border-[#aaa] transition"
                      >
                        <Bookmark size={14} />
                      </button>
                    </div>
                  </div>
                </header>

                {/* =================================================
                    FEATURED IMAGE
                ================================================= */}

                <div className="w-full h-[280px] sm:h-[390px] lg:h-[200px] overflow-hidden rounded-[5px] mb-8">
                  <img
                    src={FeaturedMain2}
                    alt="Featured article"
                    className="w-full  object-cover object-center"
                  />
                </div>

                {/* =================================================
                    ARTICLE CONTENT
                ====== =========================================== */}

                <section className="mb-12">
                  <h2 className="text-[22px] sm:text-[27px] lg:text-[31px] font-bold leading-[1.2] text-[#171717] mb-4 max-w-[900px]">
                    Smarter decisions start here, powered by AI, Automates
                    complexity
                  </h2>

                  <p className="text-[14px] sm:text-[15px] lg:text-[16px] text-[#707070] leading-[1.75] mb-4 max-w-[900px]">
                    Artificial intelligence has the power to transform how we
                    work, making complex tasks simpler and freeing up time for
                    what matters most. We are committed to using AI technologies
                    thoughtfully, ethically and responsibly to help people make
                    smarter decisions and improve outcomes across the board.
                  </p>

                  <p className="text-[14px] sm:text-[15px] lg:text-[16px] text-[#707070] leading-[1.75] max-w-[900px]">
                    From automating routine processes to surfacing hidden
                    insights in data, AI is already reshaping the way industries
                    operate. Our goal is to ensure that these benefits are
                    widely shared — empowering individuals and organizations to
                    focus on the decisions and relationships that create the
                    most value.
                  </p>
                </section>

                {/* =================================================
                    COMMENTARY
                ================================================= */}

                <section className="mb-12">
                  <div className="flex items-center gap-3 mb-5">
                    <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#3764aa]">
                      Commentary
                    </span>

                    <span className="h-[1px] flex-1 bg-[#e3e3e3]" />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-[1.15fr_0.85fr] gap-6">
                    {/* Big image */}
                    <div className="h-[260px] sm:h-[330px] lg:h-[380px] overflow-hidden rounded-[5px]">
                      <img
                        src={FeaturedSunset}
                        alt="Commentary"
                        className="w-full h-full object-cover object-center"
                      />
                    </div>

                    {/* Small cards */}
                    <div className="flex flex-col gap-5">
                      {COMMENTARY_SIDE.map((article, index) => (
                        <CommentaryCard
                          article={article}
                          key={`${article.title}-${index}`}
                        />
                      ))}
                    </div>
                  </div>
                </section>

                {/* =================================================
                    MEMBERS
                ================================================= */}

                <section className="mb-12">
                  <div className="flex items-center justify-between border-b border-[#dedede] pb-3 mb-7">
                    <h3 className="text-[18px] sm:text-[20px] font-bold text-[#181818]">
                      Members
                    </h3>

                    <button className="flex items-center gap-1.5 text-[11px] font-semibold text-[#3764aa] hover:text-[#111] transition">
                      View All
                      <ArrowRight size={13} />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-10">
                    {MEMBERS.map((member, index) => (
                      <MemberCard
                        member={member}
                        key={`${member.name}-${index}`}
                      />
                    ))}
                  </div>
                </section>

                {/* =================================================
                    LOWER ARTICLE FEED
                ================================================= */}

                <section className="mb-10">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#3764aa]">
                      Daily ETF Flows
                    </span>

                    <span className="h-[1px] flex-1 bg-[#e3e3e3]" />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10">
                    {SIDEBAR_ARTICLES.slice(0, 6).map((article, index) => (
                      <ArticleFeedCard
                        article={article}
                        key={`feed-${index}`}
                      />
                    ))}
                  </div>
                </section>
              </main>
            </div>
          </section>

          {/* =====================================================
              BOTTOM CTA
          ===================================================== */}

          <section className="pb-12 sm:pb-16">
            <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_1.15fr] gap-[3px] rounded-[8px] overflow-hidden">
              {/* Image 1 */}
              <div className="h-[220px] sm:h-[250px] lg:h-[280px] overflow-hidden">
                <img
                  src={CtaBanner}
                  alt=""
                  className="w-full h-full object-cover object-center"
                />
              </div>

              {/* Image 2 */}
              <div className="h-[220px] sm:h-[250px] lg:h-[280px] overflow-hidden">
                <img
                  src={FeaturedMain}
                  alt=""
                  className="w-full h-full object-cover object-center"
                />
              </div>

              {/* Subscription */}
              <div className="bg-[#2456b5] h-[220px] sm:h-[250px] lg:h-[280px] px-7 sm:px-9 flex flex-col justify-center">
                <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.15em] font-bold text-white/70 mb-3">
                  Newsletter
                </span>

                <h2 className="text-[20px] sm:text-[22px] lg:text-[22px] leading-[1.1] font-bold text-white mb-3">
                  Insights For
                  <br />A Brighter Tomorrow
                </h2>

                <p className="text-[11px] sm:text-[12px] text-white/75 leading-[1.55] mb-5 max-w-[280px]">
                  Receive the latest perspectives, insights and family office
                  news directly in your inbox.
                </p>

                <div className="relative max-w-[300px]">
                  <input
                    type="email"
                    placeholder="Enter your email address"
                    className="w-full h-[40px] rounded-full bg-white px-4 pr-11 text-[11px] sm:text-[12px] text-[#333] outline-none placeholder:text-[#aaa]"
                  />

                  <button
                    type="button"
                    className="absolute right-[3px] top-[3px] w-[34px] h-[34px] rounded-full bg-[#d9d9d9] text-[#2456b5] flex items-center justify-center hover:bg-white transition"
                  >
                    <Search size={15} />
                  </button>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

export default ArticlePage;
