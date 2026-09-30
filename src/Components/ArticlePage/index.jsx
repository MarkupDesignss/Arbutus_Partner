import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  useGetCommentaryPageQuery,
  useSendSubscribeMutation,
} from "../../Redux/api/publicApiSlice";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";

/* =========================================================
   COLORS
========================================================= */
const COLORS = {
  primary: "#0B4D8C",
  primaryDark: "#083B6B",
  heading: "#000000",
  body: "#4B5563",
  muted: "#9CA3AF",
  border: "#E5E7EB",
};

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200";

/* =========================================================
   HELPERS
========================================================= */
function normalizeUrl(value) {
  if (!value) return "";
  const url = String(value).trim();
  const markdownMatch = url.match(/\((https?:\/\/[^)]+)\)/);
  if (markdownMatch?.[1]) {
    return markdownMatch[1];
  }
  return url;
}

function getPostExternalUrl(post, type = "format") {
  if (!post) return "";
  if (type === "source") {
    return normalizeUrl(post.source_url) || normalizeUrl(post.format_url) || "";
  }
  return normalizeUrl(post.format_url) || normalizeUrl(post.source_url) || "";
}

/* =========================================================
   ANIMATIONS
========================================================= */
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

const fadeIn = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

const staggerParent = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
};

const staggerChild = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: "easeOut" },
  },
};

/* =========================================================
   SKELETON LOADERS
========================================================= */
function SkeletonBlock({ className = "" }) {
  return <div className={`animate-pulse rounded bg-[#E9EDF2] ${className}`} />;
}

function SkeletonArticleRow() {
  return (
    <div className="flex items-stretch gap-[17px]">
      <SkeletonBlock className="h-[163px] w-[203px] shrink-0" />
      <div className="min-w-0 flex-1 space-y-3 pt-1">
        <SkeletonBlock className="h-4 w-[97%]" />
        <SkeletonBlock className="h-4 w-[92%]" />
        <SkeletonBlock className="h-4 w-[88%]" />
        <SkeletonBlock className="h-4 w-[62%]" />
        <div className="flex items-center gap-3 pt-3">
          <SkeletonBlock className="h-3 w-20" />
          <SkeletonBlock className="h-5 w-24" />
        </div>
        <SkeletonBlock className="h-3 w-[58%]" />
      </div>
    </div>
  );
}

function SkeletonSideArticle() {
  return (
    <div className="flex gap-[17px]">
      <SkeletonBlock className="h-[139px] w-[203px] shrink-0" />
      <div className="min-w-0 flex-1 space-y-3 pt-1">
        <SkeletonBlock className="h-4 w-[95%]" />
        <SkeletonBlock className="h-4 w-[80%]" />
        <SkeletonBlock className="h-3 w-[45%]" />
        <div className="flex items-center gap-3 pt-2">
          <SkeletonBlock className="h-3 w-20" />
          <SkeletonBlock className="h-5 w-24" />
        </div>
      </div>
    </div>
  );
}

function SkeletonMembers() {
  return (
    <section className="mt-[80px]">
      <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-4">
        <SkeletonBlock className="h-7 w-28" />
        <SkeletonBlock className="h-4 w-16" />
      </div>
      <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className={`px-0 py-5 sm:px-6 ${index > 0 ? "lg:border-l lg:border-[#E5E7EB]" : "lg:pl-0"} ${index === 0 ? "sm:pl-0" : ""}`}
          >
            <SkeletonBlock className="h-[50px] w-[140px]" />
            <div className="mt-8 space-y-2">
              <SkeletonBlock className="h-3 w-full" />
              <SkeletonBlock className="h-3 w-[90%]" />
              <SkeletonBlock className="h-3 w-[80%]" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function SkeletonNewsletter() {
  return (
    <aside className="self-start lg:sticky lg:top-6">
      <div className="animate-pulse rounded-3xl bg-[#0B4D8C]/80 p-6">
        <SkeletonBlock className="h-3 w-20 bg-white/30" />
        <SkeletonBlock className="mt-4 h-7 w-[80%] bg-white/30" />
        <SkeletonBlock className="mt-2 h-7 w-[60%] bg-white/30" />
        <SkeletonBlock className="mt-4 h-3 w-full bg-white/20" />
        <SkeletonBlock className="mt-2 h-3 w-[80%] bg-white/20" />
        <SkeletonBlock className="mt-5 h-12 w-full rounded-full bg-white/40" />
      </div>
    </aside>
  );
}

function PageSkeleton() {
  return (
    <div className="min-h-screen bg-white font-poppins">
      <div className="mx-auto max-w-[1608px] px-5 pt-[42px] pb-10 lg:px-0">
        <div className="grid gap-12 lg:grid-cols-1 xl:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] xl:gap-[112px]">
          <div className="space-y-[35px]">
            {Array.from({ length: 4 }).map((_, index) => (
              <SkeletonArticleRow key={index} />
            ))}
          </div>
          <div>
            <SkeletonBlock className="h-[43px] w-[72%]" />
            <SkeletonBlock className="mt-6 h-5 w-full" />
            <SkeletonBlock className="mt-2 h-5 w-[92%]" />
            <div className="mt-4 flex items-center gap-3">
              <SkeletonBlock className="h-4 w-20" />
              <SkeletonBlock className="h-6 w-28" />
            </div>
            <SkeletonBlock className="mt-5 aspect-[2.28/1] w-full" />
            <div className="mt-[46px] grid gap-[17px] md:grid-cols-2">
              <div>
                <SkeletonBlock className="h-9 w-[78%]" />
                <SkeletonBlock className="mt-4 h-4 w-full" />
                <SkeletonBlock className="mt-2 h-4 w-[90%]" />
                <SkeletonBlock className="mt-6 h-[210px] w-full" />
              </div>
              <div className="space-y-[35px]">
                {Array.from({ length: 3 }).map((_, index) => (
                  <SkeletonSideArticle key={index} />
                ))}
              </div>
            </div>
          </div>
        </div>
        <SkeletonMembers />
        <div className="mt-14 grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)_minmax(0,1fr)]">
          <div className="hidden lg:block" />
          <div className="space-y-[35px]">
            {Array.from({ length: 3 }).map((_, index) => (
              <SkeletonArticleRow key={index} />
            ))}
          </div>
          <SkeletonNewsletter />
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   IMAGE COMPONENT
========================================================= */
function Thumb({ src, className = "", title = "" }) {
  const image = normalizeUrl(src) || FALLBACK_IMAGE;
  return (
    <div className={`relative overflow-hidden bg-[#F4F6F8] ${className}`}>
      <img
        src={image}
        alt={title || "Article"}
        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        loading="lazy"
        onError={(event) => {
          event.currentTarget.src = FALLBACK_IMAGE;
        }}
      />
    </div>
  );
}

/* =========================================================
   SOURCE INFO
========================================================= */
function SourceInfo({ sourceLogo, sourceName, authorName }) {
  const logo = normalizeUrl(sourceLogo);
  if (logo) {
    return (
      <div className="flex h-[24px] max-w-[170px] items-center overflow-hidden">
        <img
          src={logo}
          alt={sourceName || authorName || "Source"}
          className="max-h-[24px] max-w-[145px] object-contain"
          onError={(event) => {
            event.currentTarget.style.display = "none";
          }}
        />
      </div>
    );
  }
  return (
    <span className="max-w-[190px] truncate font-poppins text-[11px] font-semibold text-[#374151]">
      {sourceName || authorName || "Source"}
    </span>
  );
}

/* =========================================================
   TAGS & DATE
========================================================= */
function getMediaLabel(mediaType) {
  const labels = {
    podcast: "Podcast",
    weblink: "Weblink",
    pdf: "PDF",
    video: "Video",
    article: "Article",
  };
  return labels[String(mediaType || "").toLowerCase()] || null;
}

function Tags({ post }) {
  const tags = [
    post?.category?.name,
    getMediaLabel(post?.media_type),
    "Commentary",
  ].filter(Boolean);

  return (
    <p className="font-poppins text-[12px] font-medium leading-[18px] text-[#2A57C4]">
      {tags.map((tag, index) => (
        <React.Fragment key={`${tag}-${index}`}>
          {index > 0 && <span className="mx-1 text-[#4B5563]">|</span>}
          <span className="transition-colors hover:text-[#083B6B]">{tag}</span>
        </React.Fragment>
      ))}
    </p>
  );
}

function formatDate(date) {
  if (!date) return "";
  try {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    });
  } catch {
    return "";
  }
}

function Meta({ post }) {
  return (
    <div className="font-poppins">
      <div className="mt-[9px] flex flex-wrap items-center gap-[12px]">
        <span className="font-poppins text-[12px] leading-[18px] text-[#9CA3AF]">
          {post?.published_date_formatted || formatDate(post?.published_date)}
        </span>
        <SourceInfo
          sourceLogo={post?.source_logo}
          sourceName={post?.source_name}
          authorName={post?.author_name}
        />
        {post?.read_time ? (
          <span className="font-poppins text-[11px] leading-[18px] text-[#9CA3AF]">
            {post.read_time} min read
          </span>
        ) : null}
      </div>
      <div className="mt-[5px]">
        <Tags post={post} />
      </div>
    </div>
  );
}

/* =========================================================
   ARTICLE ROW (Left side & bottom lists) - POPPINS
========================================================= */
function ArticleRow({ post, linkType = "format" }) {
  if (!post) return null;
  const externalUrl = getPostExternalUrl(post, linkType);

  return (
    <motion.article
      variants={staggerChild}
      className="group flex items-stretch gap-[17px]"
    >
      {/* IMAGE */}
      {externalUrl ? (
        <a
          href={externalUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-[203px] min-w-[203px] shrink-0 self-stretch"
        >
          <Thumb
            src={post.image_url}
            title={post.title}
            className="h-[163px] min-h-[163px] w-[203px]"
          />
        </a>
      ) : (
        <div className="block w-[203px] min-w-[203px] shrink-0 self-stretch">
          <Thumb
            src={post.image_url}
            title={post.title}
            className="h-[163px] min-h-[163px] w-[203px]"
          />
        </div>
      )}

      {/* CONTENT */}
      <div className="min-w-0 flex-1 font-poppins">
        {externalUrl ? (
          <a
            href={externalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-poppins block text-[13px] leading-[20px] tracking-[-0.003em] text-[#111111] underline decoration-[#777777] underline-offset-[2px] transition-colors hover:text-[#0B4D8C]"
          >
            {post.title}
          </a>
        ) : (
          <div className="font-poppins block text-[13px] leading-[20px] tracking-[-0.003em] text-[#111111]">
            {post.title}
          </div>
        )}

        {post.excerpt ? (
          <p className="mt-[8px] line-clamp-3 font-poppins text-[11px] leading-[18px] text-[#6B7280]">
            {post.excerpt}
          </p>
        ) : null}

        <Meta post={post} />
      </div>
    </motion.article>
  );
}

/* =========================================================
   SMALL SIDE ARTICLE (Right side stack) - ROBOTO
========================================================= */
function SideArticle({ post }) {
  if (!post) return null;
  const externalUrl = getPostExternalUrl(post, "format");

  return (
    <motion.article
      variants={staggerChild}
      className="group flex items-start gap-[17px]"
    >
      {/* IMAGE */}
      {externalUrl ? (
        <a
          href={externalUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-[203px] min-w-[203px] shrink-0"
        >
          <Thumb
            src={post.image_url}
            title={post.title}
            className="h-[139px] min-h-[139px] w-[203px]"
          />
        </a>
      ) : (
        <div className="block w-[203px] min-w-[203px] shrink-0">
          <Thumb
            src={post.image_url}
            title={post.title}
            className="h-[139px] min-h-[139px] w-[203px]"
          />
        </div>
      )}

      {/* CONTENT */}
      <div className="min-w-0 flex-1 font-poppins">
        {externalUrl ? (
          <a
            href={externalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="roboto-heading block text-[12px] leading-[19px] text-[#111111] transition-colors hover:text-[#0B4D8C]"
          >
            {post.title}
          </a>
        ) : (
          <div className="roboto-heading block text-[12px] leading-[19px] text-[#111111]">
            {post.title}
          </div>
        )}

        {post.excerpt ? (
          <p className="mt-[7px] line-clamp-2 font-poppins text-[10.5px] leading-[17px] text-[#6B7280]">
            {post.excerpt}
          </p>
        ) : null}

        <Meta post={post} />
      </div>
    </motion.article>
  );
}

/* =========================================================
   MEMBER LOGO & SECTION - ROBOTO
========================================================= */
function MemberLogo({ member }) {
  const logo = normalizeUrl(member?.logo_url);
  if (logo) {
    return (
      <div className="flex h-[50px] items-center">
        <img
          src={logo}
          alt={member?.name || "Member"}
          className="max-h-[45px] max-w-[170px] object-contain object-left"
          onError={(event) => {
            event.currentTarget.style.display = "none";
          }}
        />
      </div>
    );
  }
  return (
    <div className="roboto-heading flex h-[50px] items-center text-2xl text-[#111827]">
      {member?.name}
    </div>
  );
}

function MembersSection({ members = [] }) {
  if (!members.length) return null;

  return (
    <motion.section
      className="mt-[80px] font-poppins"
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.15 }}
    >
      <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-4">
        <h2 className="roboto-heading text-[26px] leading-[32px] text-[#111827]">
          Members
        </h2>
        <Link
          to="/PartnerDirectory"
          className="flex items-center gap-1.5 font-poppins text-[12px] font-semibold tracking-wide text-[#0B4D8C] transition-colors hover:text-[#083B6B]"
        >
          View All
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
        </Link>
      </div>

      <motion.div
        className="mt-10 grid sm:grid-cols-2 lg:grid-cols-4"
        variants={staggerParent}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.15 }}
      >
        {members.map((member, index) => {
          const websiteUrl = normalizeUrl(member?.website_url);
          return (
            <motion.div
              key={member.id || member.name || index}
              variants={staggerChild}
              className={`px-0 py-5 sm:px-6 ${index > 0 ? "lg:border-l lg:border-[#E5E7EB]" : "lg:pl-0"} ${index === 0 ? "sm:pl-0" : ""}`}
            >
              {websiteUrl ? (
                <a
                  href={websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <MemberLogo member={member} />
                </a>
              ) : (
                <div className="block">
                  <MemberLogo member={member} />
                </div>
              )}
              <p className="mt-8 max-w-xs font-poppins text-[14px] leading-6 text-[#4B5563]">
                {member.description}
              </p>
            </motion.div>
          );
        })}
      </motion.div>
    </motion.section>
  );
}

/* =========================================================
   NEWSLETTER - ROBOTO
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
      const res = await sendSubscribe({ email: trimmedEmail }).unwrap();
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
      const apiMessage =
        error?.data?.errors?.email?.[0] ||
        error?.data?.message ||
        error?.message ||
        "Something went wrong. Please try again.";
      Swal.fire({
        icon: "error",
        title: "Subscription Failed",
        text: apiMessage,
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
      className="self-start font-poppins lg:sticky lg:top-6"
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
    >
      <div
        className="rounded-3xl p-6 text-white"
        style={{ backgroundColor: COLORS.primary }}
      >
        <p className="font-poppins text-[11px] font-bold uppercase tracking-[0.18em] text-white/80">
          Newsletter
        </p>
        <h3 className="roboto-heading mt-3 text-2xl leading-tight tracking-tight md:text-3xl">
          Insights For
          <br />A Brighter Tomorrow
        </h3>
        <p className="mt-4 font-poppins text-[14px] leading-6 text-blue-50">
          Receive the latest perspectives on wealth, legacy and family offices.
        </p>

        <div className="mt-5 flex items-center rounded-full bg-white p-1.5 pl-4">
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Enter your email address"
            disabled={isLoading}
            className="min-w-0 flex-1 bg-transparent font-poppins text-[13px] text-[#111827] outline-none placeholder:text-[#9CA3AF] disabled:cursor-not-allowed disabled:opacity-60"
          />
          <button
            type="button"
            aria-label="Subscribe"
            onClick={handleSubscribe}
            disabled={isLoading}
            className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full bg-[#E7EEF7] font-poppins text-[#0B4D8C] transition-all duration-300 hover:bg-[#D9E6F4] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isLoading ? (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#0B4D8C] border-t-transparent" />
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
   HERO CONTENT (Main Article) - ROBOTO
========================================================= */
function HeroContent({ content }) {
  if (!content) return null;
  const paragraphs = String(content)
    .split(/\r?\n/)
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, 2);

  if (!paragraphs.length) return null;

  return (
    <motion.div
      className="mt-6 font-poppins"
      variants={staggerParent}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
    >
      {paragraphs.map((paragraph, index) => (
        <motion.p
          key={`${paragraph}-${index}`}
          variants={staggerChild}
          className="mb-3 font-poppins text-[14px] leading-7 text-[#4B5563]"
        >
          {paragraph}
        </motion.p>
      ))}
    </motion.div>
  );
}

/* =========================================================
   MAIN PAGE COMPONENT
========================================================= */
export default function ArticlePage() {
  const { data: apiResponse, isLoading, isError } = useGetCommentaryPageQuery();

  const POSTS_PER_LOAD = 5;
  const [visibleMoreCount, setVisibleMoreCount] = useState(POSTS_PER_LOAD);

  const pageData = apiResponse?.data;
  const hero = pageData?.hero || null;
  const leftPosts = Array.isArray(pageData?.left_posts)
    ? pageData.left_posts
    : [];
  const rightGrid = Array.isArray(pageData?.right_grid)
    ? pageData.right_grid
    : [];
  const members = Array.isArray(pageData?.members) ? pageData.members : [];
  const morePosts = Array.isArray(pageData?.more_posts?.items)
    ? pageData.more_posts.items
    : [];

  const visibleMorePosts = morePosts.slice(0, visibleMoreCount);
  const handleLoadMore = () => {
    setVisibleMoreCount((prev) =>
      Math.min(prev + POSTS_PER_LOAD, morePosts.length),
    );
  };
  const hasMorePosts = visibleMoreCount < morePosts.length;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white font-poppins">
        <PageSkeleton />
      </div>
    );
  }

  if (isError || !pageData) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-white font-poppins">
        <div className="font-poppins text-sm text-red-500">
          Unable to load commentary content.
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-poppins text-[#111827]">
      <div className="mx-auto max-w-[1608px] px-5 pt-[42px] pb-10 lg:px-0">
        {/* =================================================
            MAIN TOP GRID
        ================================================= */}
        <div className="grid gap-12 lg:grid-cols-1 xl:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] xl:gap-[112px]">
          {/* LEFT ARTICLES - POPPINS */}
          <motion.div
            className="space-y-[35px]"
            variants={staggerParent}
            initial="hidden"
            animate="show"
          >
            {leftPosts.map((post, index) => (
              <ArticleRow
                key={post.id || post.slug || index}
                post={post}
                linkType="format"
              />
            ))}
          </motion.div>

          {/* RIGHT FEATURED AREA - ROBOTO */}
          <motion.div variants={fadeUp} initial="hidden" animate="show">
            {hero ? (
              <>
                {/* HERO TITLE - ROBOTO */}
                <motion.h1
                  variants={fadeUp}
                  className="roboto-heading text-[34px] leading-[42px] tracking-[-0.025em] text-black md:text-[36px] md:leading-[43px]"
                  style={{ color: COLORS.heading }}
                >
                  {hero.title}
                </motion.h1>

                {/* HERO DESCRIPTION */}
                {hero.excerpt ? (
                  <motion.p
                    variants={fadeIn}
                    className="mt-[21px] max-w-full font-poppins text-[15px] leading-[24px] text-[#4B5563]"
                  >
                    {hero.excerpt}
                  </motion.p>
                ) : null}

                {/* HERO META */}
                <motion.div variants={fadeIn}>
                  <Meta post={hero} />
                </motion.div>

                {/* HERO IMAGE */}
                {getPostExternalUrl(hero, "source") ? (
                  <motion.a
                    variants={fadeIn}
                    href={getPostExternalUrl(hero, "source")}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group block"
                  >
                    <Thumb
                      src={hero.image_url}
                      title={hero.title}
                      className="mt-[18px] aspect-[2.28/1] w-full"
                    />
                  </motion.a>
                ) : (
                  <motion.div variants={fadeIn} className="group block">
                    <Thumb
                      src={hero.image_url}
                      title={hero.title}
                      className="mt-[18px] aspect-[2.28/1] w-full"
                    />
                  </motion.div>
                )}

                {/* HERO CONTENT */}
                <HeroContent content={hero.content} />
              </>
            ) : null}

            {/* SECONDARY GRID */}
            {rightGrid.length > 0 ? (
              <div className="mt-[46px] grid gap-[17px] md:grid-cols-2">
                {/* SECONDARY FEATURED CARD - ROBOTO */}
                {rightGrid[0] ? (
                  <motion.div
                    variants={fadeUp}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, amount: 0.2 }}
                  >
                    {getPostExternalUrl(rightGrid[0], "format") ? (
                      <a
                        href={getPostExternalUrl(rightGrid[0], "format")}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block"
                      >
                        <h2 className="roboto-heading max-w-[430px] text-[29px] leading-[35px] tracking-[-0.02em] text-[#344B55] transition-colors hover:text-[#0B4D8C]">
                          {rightGrid[0].title}
                        </h2>
                      </a>
                    ) : (
                      <h2 className="roboto-heading max-w-[430px] text-[29px] leading-[35px] tracking-[-0.02em] text-[#344B55]">
                        {rightGrid[0].title}
                      </h2>
                    )}

                    {rightGrid[0].excerpt ? (
                      <p className="mt-[13px] max-w-[430px] font-poppins text-[14px] leading-[26px] text-[#4B5563]">
                        {rightGrid[0].excerpt}
                      </p>
                    ) : null}

                    <Meta post={rightGrid[0]} />

                    {getPostExternalUrl(rightGrid[0], "format") ? (
                      <a
                        href={getPostExternalUrl(rightGrid[0], "format")}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group block"
                      >
                        <Thumb
                          src={rightGrid[0].image_url}
                          title={rightGrid[0].title}
                          className="mt-[18px] aspect-[1.9/1] w-full"
                        />
                      </a>
                    ) : (
                      <div className="group block">
                        <Thumb
                          src={rightGrid[0].image_url}
                          title={rightGrid[0].title}
                          className="mt-[18px] aspect-[1.9/1] w-full"
                        />
                      </div>
                    )}
                  </motion.div>
                ) : null}

                {/* RIGHT SIDE SMALL ARTICLES - ROBOTO */}
                <motion.div
                  className="space-y-[35px]"
                  variants={staggerParent}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, amount: 0.15 }}
                >
                  {rightGrid.slice(1, 4).map((post, index) => (
                    <SideArticle
                      key={post.id || post.slug || index}
                      post={post}
                    />
                  ))}
                </motion.div>
              </div>
            ) : null}
          </motion.div>
        </div>

        {/* =================================================
            MEMBERS SECTION - ROBOTO
        ================================================= */}
        <MembersSection members={members} />

        {/* =================================================
            MORE POSTS + NEWSLETTER
        ================================================= */}
        <div className="mt-[56px] grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)_minmax(0,1fr)]">
          <div className="hidden lg:block" />

          {/* MORE POSTS - POPPINS */}
          <div>
            {visibleMorePosts.length > 0 ? (
              <div className="space-y-[35px]">
                {visibleMorePosts.map((post, index) => (
                  <motion.div
                    key={post.id ?? `${post.slug}-${index}`}
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45, ease: "easeOut" }}
                  >
                    <ArticleRow post={post} linkType="format" />
                  </motion.div>
                ))}
              </div>
            ) : null}

            {/* LOAD MORE BUTTON */}
            {hasMorePosts ? (
              <motion.div
                className="mt-12 flex justify-center"
                variants={fadeIn}
                initial="hidden"
                animate="show"
              >
                <button
                  type="button"
                  onClick={handleLoadMore}
                  className="cursor-pointer rounded-full border border-[#D1D5DB] px-8 py-2.5 font-poppins text-[13px] font-semibold tracking-wide text-[#0B4D8C] transition-all duration-300 hover:border-[#0B4D8C] hover:bg-[#F5F8FC] active:scale-[0.98]"
                >
                  LOAD MORE
                </button>
              </motion.div>
            ) : null}
          </div>

          {/* NEWSLETTER - ROBOTO */}
          <Newsletter />
        </div>
      </div>
    </div>
  );
}
