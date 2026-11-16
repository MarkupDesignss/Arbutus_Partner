import React, { useState } from "react";
import { useParams } from "react-router-dom";

import {
  ArrowRight,
  ArrowUpRight,
  MapPin,
  Linkedin,
  Mail,
  Globe2,
  BriefcaseBusiness,
  Users,
  ChartNoAxesCombined,
  FileText,
} from "lucide-react";

import { useGetMemberDirectoryByIdQuery } from "../../Redux/api/publicApiSlice";

/* =========================================================
   CONFIGURATION
========================================================= */

// Set true only if the website navbar is position: fixed.
const NAVBAR_IS_FIXED = false;
const NAVBAR_HEIGHT = 64;

// Original fallback URL preserved.
const DEFAULT_CONTACT_URL = "https://peartreecanada.com/contact-us/";

/* =========================================================
   X / TWITTER ICON
========================================================= */

const XIcon = ({ size = 16, className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    aria-hidden="true"
  >
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

/* =========================================================
   HELPERS (logic unchanged)
========================================================= */

const safeLink = (value) => {
  if (!value || typeof value !== "string") return null;

  const url = value.trim();

  if (/^(https?:\/\/|mailto:|tel:)/i.test(url)) return url;

  if (/^(?!javascript:)[\w.-]+\.[a-z]{2,}(?:[/?#].*)?$/i.test(url)) {
    return `https://${url}`;
  }

  if (url.startsWith("/") && !url.startsWith("//")) return url;

  return null;
};

const socialLink = (social = {}, keys = []) => {
  const value = keys.map((key) => social?.[key]).find(Boolean);
  return safeLink(value);
};

const getDisplayText = (value) => {
  if (typeof value === "string" || typeof value === "number") {
    return String(value);
  }
  return value?.name || value?.title || "";
};

const getContactLink = (social = {}, perspective = {}) => {
  const contact =
    perspective?.cta_url ||
    perspective?.cta_link ||
    perspective?.contact_url ||
    perspective?.contact_link ||
    social?.contact ||
    social?.contact_url ||
    social?.contact_link;

  if (contact) return safeLink(contact) || DEFAULT_CONTACT_URL;

  const email = social?.email || social?.contact_email;
  if (email) return `mailto:${email}`;

  return DEFAULT_CONTACT_URL;
};

const getExternalProps = (href) => {
  if (/^https?:\/\//i.test(href || "")) {
    return { target: "_blank", rel: "noopener noreferrer" };
  }
  return {};
};

/* =========================================================
   SHARED STYLES
========================================================= */

const FOCUS =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7bb2ff] focus-visible:ring-offset-2";

/* Fine dotted texture used on dark + light panels */
const DOT_DARK = {
  backgroundImage:
    "radial-gradient(rgba(255,255,255,0.07) 1px, transparent 1px)",
  backgroundSize: "22px 22px",
};

const DOT_LIGHT = {
  backgroundImage: "radial-gradient(rgba(36,95,200,0.10) 1px, transparent 1px)",
  backgroundSize: "24px 24px",
};

/* =========================================================
   SECTION HEADING
========================================================= */

const SectionHeading = ({ kicker, title, text }) => (
  <div className="mb-12 max-w-2xl">
    <div className="mb-4 flex items-center gap-3">
      <span className="h-[3px] w-10 rounded-full bg-gradient-to-r from-[#245fc8] to-[#7bb2ff]" />
      <span className="text-[13px] font-semibold text-[#3169cf]">{kicker}</span>
    </div>

    <h2 className="text-3xl font-bold leading-tight tracking-tight text-[#0f2239] sm:text-[40px]">
      {title}
    </h2>

    {text && (
      <p className="mt-4 text-[15px] leading-7 text-slate-500 sm:text-base">
        {text}
      </p>
    )}
  </div>
);

/* =========================================================
   ACTION BUTTON
========================================================= */

const ActionButton = ({ icon: Icon, href, children, primary = false }) => {
  if (!href) return null;

  return (
    <a
      href={href}
      {...getExternalProps(href)}
      className={`
        group inline-flex min-h-[46px] items-center justify-center gap-2.5
        rounded-xl px-5 py-2.5 text-[13px] font-semibold
        transition-all duration-200 hover:-translate-y-0.5 ${FOCUS}
        ${
          primary
            ? "bg-gradient-to-br from-[#4a8bf5] to-[#2465d4] text-white shadow-lg shadow-blue-900/30 hover:shadow-xl hover:shadow-blue-900/40"
            : "border border-white/20 bg-white/[0.07] text-white backdrop-blur hover:border-white/40 hover:bg-white/15"
        }
      `}
    >
      {Icon && <Icon size={16} className="shrink-0" />}
      <span>{children}</span>
      {primary && (
        <ArrowRight
          size={15}
          className="transition-transform duration-200 group-hover:translate-x-1"
        />
      )}
    </a>
  );
};

/* =========================================================
   HERO SECTION
========================================================= */

const HeroSection = ({
  name,
  tagline,
  category,
  location,
  description,
  logoUrl,
  bannerUrl,
  socialLinks = {},
  perspective = {},
}) => {
  const twitterLink = socialLink(socialLinks, [
    "twitter",
    "twitter_url",
    "x",
    "x_url",
  ]);

  const linkedinLink = socialLink(socialLinks, [
    "linkedin",
    "linkedin_url",
    "linkedIn",
    "linkedIn_url",
  ]);

  const contactUrl = getContactLink(socialLinks, perspective);

  return (
    <section className="relative w-full overflow-hidden bg-[#0b1d33]">
      <div className="grid w-full grid-cols-1 lg:grid-cols-[46%_54%]">
        {/* ================= BANNER ================= */}
        <div className="relative order-1 h-[320px] w-full min-w-0 overflow-hidden bg-[#dce7f2] sm:h-[440px] lg:order-2 lg:h-[680px]">
          {bannerUrl ? (
            <>
              <img
                src={bannerUrl}
                alt={`${name || "Member"} banner`}
                className="absolute inset-0 block h-full w-full object-cover object-top"
                loading="eager"
              />

              {/* blend image into the navy panel */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0b1d33]/70 via-transparent to-transparent lg:hidden" />
              <div className="pointer-events-none absolute inset-y-0 left-0 hidden w-48 bg-gradient-to-r from-[#0b1d33] to-transparent lg:block" />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#0b1d33]/50 to-transparent" />
            </>
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#1a3a63] to-[#0b1d33] text-[#7290b2]">
              <Globe2 size={80} strokeWidth={1} />
            </div>
          )}

          {/* location chip on banner */}
          {location && (
            <div className="absolute bottom-5 right-5 hidden items-center gap-2 rounded-full border border-white/25 bg-[#0b1d33]/55 px-4 py-2 text-xs font-medium text-white backdrop-blur-md sm:inline-flex lg:bottom-8 lg:right-8">
              <MapPin size={14} className="text-[#7bb2ff]" />
              {getDisplayText(location)}
            </div>
          )}
        </div>

        {/* ================= CONTENT ================= */}
        <div
          className="relative order-2 flex min-w-0 items-center bg-gradient-to-br from-[#0b1d33] via-[#0e2742] to-[#133660] px-6 py-14 sm:px-10 sm:py-16 lg:order-1 lg:min-h-[680px] lg:px-12 xl:px-16"
        >
          {/* texture */}
          <div className="pointer-events-none absolute inset-0" style={DOT_DARK} />

          {/* glow */}
          <div className="pointer-events-none absolute -left-24 -top-24 h-[380px] w-[380px] rounded-full bg-blue-500/15 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-32 right-0 h-[300px] w-[300px] rounded-full bg-sky-400/10 blur-3xl" />

          <div className="relative z-10 w-full max-w-[600px]">
            {/* logo + tagline */}
            <div className="mb-8 flex flex-wrap items-center gap-3">
              {logoUrl && (
                <div className="flex min-h-[60px] max-w-[220px] items-center justify-center rounded-xl bg-white px-5 py-2.5 shadow-xl shadow-black/20 ring-1 ring-white/60">
                  <img
                    src={logoUrl}
                    alt={`${name || "Member"} logo`}
                    className="max-h-[46px] max-w-[175px] object-contain"
                  />
                </div>
              )}

              {tagline && (
                <span className="inline-flex items-center gap-2 rounded-full border border-[#7bb2ff]/40 bg-[#7bb2ff]/10 px-4 py-2 text-[11px] font-semibold tracking-[0.1em] text-[#cfe2ff]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#7bb2ff]" />
                  {tagline}
                </span>
              )}
            </div>

            {/* name */}
            <h1 className="max-w-[620px] break-words text-[34px] font-extrabold leading-[1.1] tracking-[-0.03em] text-white sm:text-[42px] lg:text-[46px] xl:text-[54px]">
              {name}
            </h1>

            {/* category + location */}
            {(category || location) && (
              <div className="mt-6 flex flex-wrap items-center gap-3 text-[13px] font-medium text-blue-100">
                {category && (
                  <span className="inline-flex items-center gap-2 rounded-lg bg-white/[0.07] px-3 py-1.5 ring-1 ring-white/10">
                    <BriefcaseBusiness size={15} className="text-[#7bb2ff]" />
                    {getDisplayText(category)}
                  </span>
                )}

                {location && (
                  <span className="inline-flex items-center gap-2 rounded-lg bg-white/[0.07] px-3 py-1.5 ring-1 ring-white/10 sm:hidden">
                    <MapPin size={15} className="text-[#7bb2ff]" />
                    {getDisplayText(location)}
                  </span>
                )}
              </div>
            )}

            {/* description */}
            {description && (
              <p className="mt-7 max-w-[540px] border-l-2 border-[#7bb2ff]/50 pl-5 text-[15px] leading-[1.85] text-[#d4dfeb] sm:text-base">
                {description}
              </p>
            )}

            {/* actions */}
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <ActionButton href={twitterLink} icon={XIcon}>
                Twitter
              </ActionButton>

              <ActionButton href={linkedinLink} icon={Linkedin}>
                LinkedIn
              </ActionButton>

              <ActionButton href={contactUrl} icon={Mail} primary>
                Contact Us
              </ActionButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

/* =========================================================
   FEATURE ICON STYLES
========================================================= */

const ICON_STYLES = [
  { icon: BriefcaseBusiness, color: "text-[#245fc8]", bg: "bg-[#eaf2ff]", bar: "from-[#245fc8] to-[#7bb2ff]" },
  { icon: Users, color: "text-[#128a91]", bg: "bg-[#e3f7f7]", bar: "from-[#128a91] to-[#5fd0d5]" },
  { icon: ChartNoAxesCombined, color: "text-[#6c59c7]", bg: "bg-[#efebff]", bar: "from-[#6c59c7] to-[#b2a5f5]" },
];

/* =========================================================
   FEATURE ICON
========================================================= */

const FeatureIcon = ({ iconUrl, Icon, color, bg }) => {
  const [imageFailed, setImageFailed] = useState(false);

  return (
    <div
      className={`mb-6 flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl ring-1 ring-black/5 transition-transform duration-300 group-hover:scale-105 ${bg} ${color}`}
    >
      {iconUrl && !imageFailed ? (
        <img
          src={iconUrl}
          alt=""
          className="h-11 w-11 object-contain"
          onError={() => setImageFailed(true)}
        />
      ) : (
        <Icon size={25} strokeWidth={1.7} />
      )}
    </div>
  );
};

/* =========================================================
   FEATURE CARD
========================================================= */

const FeatureCard = ({ icon: Icon, iconUrl, color, bg, bar, title, description }) => (
  <article className="group relative h-full overflow-hidden rounded-3xl border border-[#e3eaf5] bg-white p-7 shadow-[0_8px_30px_rgba(23,51,86,0.04)] transition-all duration-300 hover:-translate-y-1.5 hover:border-blue-200 hover:shadow-[0_24px_60px_rgba(23,51,86,0.12)] sm:p-9">
    {/* top accent bar */}
    <div
      className={`absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-gradient-to-r transition-transform duration-500 group-hover:scale-x-100 ${bar}`}
    />

    <FeatureIcon iconUrl={iconUrl} Icon={Icon} color={color} bg={bg} />

    <h3 className="text-[18px] font-bold leading-snug tracking-tight text-[#10253d]">
      {title}
    </h3>

    <p className="mt-3 text-[15px] leading-[1.8] text-[#5f7088]">
      {description}
    </p>
  </article>
);

/* =========================================================
   EXPERTISE SECTION
========================================================= */

const ExpertiseSection = ({ expertises = [] }) => {
  if (!Array.isArray(expertises) || !expertises.length) return null;

  return (
    <section className="relative bg-[#f4f7fc] py-20 sm:py-24 lg:py-28">
      <div className="pointer-events-none absolute inset-0" style={DOT_LIGHT} />

      <div className="relative mx-auto max-w-[1320px] px-5 sm:px-8 lg:px-12">
        <SectionHeading
          kicker="What sets us apart"
          title="Expertise & Opportunities"
          text="Explore the strengths, strategies and opportunities within our partner network."
        />

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {expertises.map((item, index) => {
            const style = ICON_STYLES[index % ICON_STYLES.length];
            const apiIcon = item?.icon_url || item?.icon || null;

            return (
              <FeatureCard
                key={item?.id || index}
                icon={style.icon}
                iconUrl={apiIcon}
                color={style.color}
                bg={style.bg}
                bar={style.bar}
                title={item?.title || item?.name || ""}
                description={item?.description || item?.text || ""}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
};

/* =========================================================
   PERSPECTIVE SECTION
========================================================= */

const PerspectiveSection = ({ perspective = {}, socialLinks = {} }) => {
  if (!perspective?.title) return null;

  const images = Array.isArray(perspective?.images) ? perspective.images : [];
  const image = images[0] || null;
  const ctaUrl = getContactLink(socialLinks, perspective);

  return (
    <section className="overflow-hidden bg-white py-20 sm:py-24 lg:py-28">
      <div className="mx-auto grid max-w-[1320px] grid-cols-1 items-center gap-14 px-5 sm:px-8 lg:grid-cols-2 lg:gap-20 lg:px-12">
        {/* IMAGE with offset frame */}
        <div className="relative mx-3 sm:mx-0">
          <div className="absolute -bottom-4 -left-4 h-full w-full rounded-[28px] border-2 border-[#bcd3f7] sm:-bottom-6 sm:-left-6" />
          <div className="absolute -right-6 -top-6 hidden h-28 w-28 rounded-full bg-[#eaf2ff] sm:block" />

          <div className="relative overflow-hidden rounded-[28px] bg-[#e8eff8] shadow-[0_30px_70px_rgba(25,48,76,0.18)]">
            <div className="aspect-[5/4]">
              {image ? (
                <img
                  src={image}
                  alt={perspective.title}
                  className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-[#6a8ebd]">
                  <Globe2 size={80} strokeWidth={1} />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* CONTENT */}
        <div>
          <div className="mb-5 flex items-center gap-3">
            <span className="h-[3px] w-10 rounded-full bg-gradient-to-r from-[#245fc8] to-[#7bb2ff]" />
            <span className="text-[13px] font-semibold text-[#3169cf]">
              {perspective?.label || "Our Perspective"}
            </span>
          </div>

          <h2 className="text-3xl font-bold leading-[1.15] tracking-tight text-[#0f2239] sm:text-[40px]">
            {perspective.title}
          </h2>

          {perspective.description && (
            <p className="mt-6 max-w-[560px] whitespace-pre-line text-base leading-[1.9] text-[#5a6b7f]">
              {perspective.description}
            </p>
          )}

          <a
            href={ctaUrl}
            {...getExternalProps(ctaUrl)}
            className={`group mt-9 inline-flex items-center gap-3 rounded-xl bg-gradient-to-br from-[#2d6fe0] to-[#194da8] px-7 py-4 text-sm font-semibold text-white shadow-lg shadow-blue-900/20 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl ${FOCUS}`}
          >
            {perspective?.cta_text || "Contact Us"}
            <ArrowRight
              size={17}
              className="transition-transform duration-200 group-hover:translate-x-1"
            />
          </a>
        </div>
      </div>
    </section>
  );
};

/* =========================================================
   ARTICLE CARD
========================================================= */

const ArticleCard = ({ article }) => {
  const {
    image_url,
    image_badge,
    title,
    published_date_formatted,
    source_name,
    source_logo,
    category,
    media_type,
    insight_topic,
    format_url,
  } = article;

  const tags = [getDisplayText(category), getDisplayText(insight_topic)].filter(
    Boolean,
  );

  const articleUrl = safeLink(format_url);
  const isPdf = media_type === "pdf";

  const content = (
    <article className="group flex h-full flex-col overflow-hidden rounded-3xl border border-[#e3eaf5] bg-white shadow-[0_8px_30px_rgba(23,51,86,0.04)] transition-all duration-300 hover:-translate-y-1.5 hover:border-blue-200 hover:shadow-[0_24px_60px_rgba(23,51,86,0.13)]">
      {/* IMAGE */}
      <div className="relative aspect-[16/9] overflow-hidden bg-[#eaf0f8]">
        {image_url ? (
          <img
            src={image_url}
            alt={title || "Article"}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-[#eaf2ff] to-[#dbe7f7] text-[#7b99c1]">
            {isPdf ? <FileText size={44} strokeWidth={1.4} /> : <Globe2 size={44} strokeWidth={1.4} />}
          </div>
        )}

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0b1d33]/30 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        {image_badge && (
          <span className="absolute left-4 top-4 rounded-full bg-[#0f2a4a]/90 px-3 py-1 text-[11px] font-semibold text-white backdrop-blur">
            {image_badge}
          </span>
        )}
      </div>

      {/* DETAILS */}
      <div className="flex flex-1 flex-col p-6 sm:p-7">
        <div className="mb-3 flex flex-wrap items-center gap-x-3 gap-y-2 text-xs font-medium text-[#718197]">
          {published_date_formatted && <span>{published_date_formatted}</span>}

          {source_logo ? (
            <img
              src={source_logo}
              alt={source_name || "Source"}
              className="max-h-5 max-w-24 object-contain"
            />
          ) : source_name ? (
            <span
              className={
                isPdf
                  ? "rounded-md bg-[#173b65] px-2 py-1 text-[11px] text-white"
                  : "font-semibold text-[#d71920]"
              }
            >
              {source_name}
            </span>
          ) : null}
        </div>

        <h3 className="text-[17px] font-bold leading-[1.5] text-[#10253d] transition-colors group-hover:text-[#245fc8]">
          {title}
        </h3>

        {tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {tags.map((tag, index) => (
              <span
                key={index}
                className="rounded-full bg-[#eef4ff] px-3 py-1 text-[11px] font-medium text-[#2d65bb]"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {articleUrl && (
          <div className="mt-auto flex items-center justify-between border-t border-[#edf1f7] pt-5 text-[13px] font-semibold text-[#2766d0]">
            <span className="mt-5">Read article</span>
            <span className="mt-5 flex h-8 w-8 items-center justify-center rounded-full bg-[#eaf2ff] transition-all duration-300 group-hover:bg-[#2766d0] group-hover:text-white">
              <ArrowUpRight size={15} />
            </span>
          </div>
        )}
      </div>
    </article>
  );

  if (!articleUrl) return content;

  return (
    <a
      href={articleUrl}
      {...getExternalProps(articleUrl)}
      className={`block h-full rounded-3xl ${FOCUS}`}
    >
      {content}
    </a>
  );
};

/* =========================================================
   ARTICLES SECTION
========================================================= */

const ArticlesSection = ({ posts = [] }) => {
  const [visibleCount, setVisibleCount] = useState(9);

  if (!Array.isArray(posts) || !posts.length) return null;

  const visibleArticles = posts.slice(0, visibleCount);

  const handleLoadMore = () => {
    setVisibleCount((current) => Math.min(current + 3, posts.length));
  };

  return (
    <section className="relative bg-[#f4f7fc] py-20 sm:py-24 lg:py-28">
      <div className="pointer-events-none absolute inset-0" style={DOT_LIGHT} />

      <div className="relative mx-auto max-w-[1320px] px-5 sm:px-8 lg:px-12">
        <SectionHeading kicker="Insights & updates" title="Latest Articles" />

        <div className="grid grid-cols-1 gap-7 md:grid-cols-2 lg:grid-cols-3">
          {visibleArticles.map((article, index) => (
            <ArticleCard key={article?.id || index} article={article} />
          ))}
        </div>

        {visibleCount < posts.length && (
          <div className="mt-12 text-center">
            <button
              type="button"
              onClick={handleLoadMore}
              className={`rounded-xl border border-[#b9cbed] bg-white px-8 py-3.5 text-sm font-semibold text-[#245fc8] shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-[#245fc8] hover:bg-[#245fc8] hover:text-white hover:shadow-lg ${FOCUS}`}
            >
              Load more articles
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

/* =========================================================
   LOADING SKELETON
========================================================= */

const LoadingSkeleton = () => (
  <div
    className="min-h-[70vh] w-full animate-pulse bg-[#f4f7fc]"
    role="status"
    aria-label="Loading member"
  >
    <div className="grid lg:grid-cols-[46%_54%]">
      <div className="space-y-5 bg-[#0e2742] px-10 py-20">
        <div className="h-14 w-52 rounded-xl bg-white/15" />
        <div className="h-12 w-4/5 rounded-lg bg-white/15" />
        <div className="h-4 w-3/5 rounded bg-white/10" />
        <div className="h-4 w-2/5 rounded bg-white/10" />
        <div className="flex gap-3 pt-4">
          <div className="h-11 w-28 rounded-xl bg-white/10" />
          <div className="h-11 w-28 rounded-xl bg-white/10" />
          <div className="h-11 w-36 rounded-xl bg-blue-500/30" />
        </div>
      </div>
      <div className="min-h-[320px] bg-[#dce7f2] lg:min-h-[600px]" />
    </div>
  </div>
);

/* =========================================================
   MAIN COMPONENT
========================================================= */

const FieraRealEstate = () => {
  const { id } = useParams();

  const {
    data: response,
    isLoading,
    isError,
    error,
  } = useGetMemberDirectoryByIdQuery(id, {
    skip: !id,
  });

  if (isLoading) return <LoadingSkeleton />;

  if (isError) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center px-5 text-center">
        <div className="max-w-md rounded-2xl border border-red-100 bg-red-50 px-8 py-6 text-red-600">
          {error?.data?.message || "Failed to load member."}
        </div>
      </div>
    );
  }

  const member = response?.data;

  if (!member) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-slate-500">
        Member not found.
      </div>
    );
  }

  const {
    name,
    tagline,
    category,
    location,
    description,
    logo_url,
    banner_url,
    social_links = {},
    expertises = [],
    perspective = {},
    posts = [],
  } = member;

  return (
    <main
      className="fiera-real-estate-page min-h-screen bg-white text-[#3d474d] antialiased"
      style={{
        paddingTop: NAVBAR_IS_FIXED ? `${NAVBAR_HEIGHT}px` : undefined,
      }}
    >
      <HeroSection
        name={name}
        tagline={tagline}
        category={category}
        location={location}
        description={description}
        logoUrl={logo_url}
        bannerUrl={banner_url}
        socialLinks={social_links}
        perspective={perspective}
      />

      <ExpertiseSection expertises={expertises} />

      <PerspectiveSection perspective={perspective} socialLinks={social_links} />

      <ArticlesSection posts={posts} />
    </main>
  );
};

export default FieraRealEstate;