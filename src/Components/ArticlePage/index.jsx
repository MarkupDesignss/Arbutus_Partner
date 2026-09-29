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

/*
  Link behavior:

  LEFT POSTS
  -> format_url

  HERO / MAIN POST
  -> source_url

  RIGHT GRID
  -> format_url

  MORE POSTS
  -> format_url

  MEMBERS
  -> website_url
*/

function getPostExternalUrl(post, type = "format") {
  if (!post) return "";

  if (type === "source") {
    return (
      normalizeUrl(post.source_url) ||
      normalizeUrl(post.format_url) ||
      ""
    );
  }

  return (
    normalizeUrl(post.format_url) ||
    normalizeUrl(post.source_url) ||
    ""
  );
}

function openExternalUrl(url) {
  const normalizedUrl = normalizeUrl(url);

  if (!normalizedUrl) return;

  window.open(
    normalizedUrl,
    "_blank",
    "noopener,noreferrer"
  );
}

/* =========================================================
   ANIMATIONS
========================================================= */

const fadeUp = {
  hidden: {
    opacity: 0,
    y: 24,
  },

  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

const fadeIn = {
  hidden: {
    opacity: 0,
  },

  show: {
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

const staggerParent = {
  hidden: {},

  show: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05,
    },
  },
};

const staggerChild = {
  hidden: {
    opacity: 0,
    y: 18,
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
   SKELETONS
========================================================= */

function SkeletonBlock({ className = "" }) {
  return (
    <div
      className={`animate-pulse rounded bg-[#E9EDF2] ${className}`}
    />
  );
}

function SkeletonArticleRow() {
  return (
    <div className="flex gap-4">
      <SkeletonBlock className="h-[80px] w-[140px] shrink-0" />

      <div className="min-w-0 flex-1 space-y-3 pt-1">
        <SkeletonBlock className="h-4 w-[85%]" />
        <SkeletonBlock className="h-4 w-[65%]" />
        <SkeletonBlock className="h-3 w-[40%]" />

        <div className="flex items-center gap-3 pt-2">
          <SkeletonBlock className="h-3 w-20" />
          <SkeletonBlock className="h-4 w-24" />
        </div>

        <div className="flex items-center gap-2 pt-1">
          <SkeletonBlock className="h-3 w-14" />
          <SkeletonBlock className="h-3 w-14" />
          <SkeletonBlock className="h-3 w-14" />
        </div>
      </div>
    </div>
  );
}

function SkeletonSideArticle() {
  return (
    <div className="flex gap-4">
      <SkeletonBlock className="aspect-video h-auto w-[160px] shrink-0" />

      <div className="min-w-0 flex-1 space-y-3 pt-1">
        <SkeletonBlock className="h-4 w-[90%]" />
        <SkeletonBlock className="h-4 w-[70%]" />
        <SkeletonBlock className="h-3 w-[45%]" />

        <div className="flex items-center gap-3 pt-2">
          <SkeletonBlock className="h-3 w-20" />
          <SkeletonBlock className="h-4 w-24" />
        </div>
      </div>
    </div>
  );
}

function SkeletonMembers() {
  return (
    <section className="mt-20">
      <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-4">
        <SkeletonBlock className="h-6 w-28" />
        <SkeletonBlock className="h-4 w-16" />
      </div>

      <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className={`
              px-0 py-5 sm:px-6
              ${index > 0 ? "lg:border-l lg:border-[#E5E7EB]" : "lg:pl-0"}
              ${index === 0 ? "sm:pl-0" : ""}
            `}
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
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-[1440px] px-6 py-6 lg:px-10">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
          <div className="space-y-10">
            {Array.from({ length: 4 }).map((_, index) => (
              <SkeletonArticleRow key={index} />
            ))}
          </div>

          <div>
            <SkeletonBlock className="h-9 w-[75%]" />
            <SkeletonBlock className="mt-3 h-9 w-[55%]" />

            <div className="mt-5 space-y-2">
              <SkeletonBlock className="h-4 w-full" />
              <SkeletonBlock className="h-4 w-[90%]" />
            </div>

            <div className="mt-4 flex items-center gap-3">
              <SkeletonBlock className="h-3 w-20" />
              <SkeletonBlock className="h-5 w-28" />
            </div>

            <SkeletonBlock className="mt-5 aspect-video w-full" />

            <div className="mt-14 grid gap-10 md:grid-cols-2">
              <div>
                <SkeletonBlock className="h-7 w-[80%]" />
                <SkeletonBlock className="mt-4 h-4 w-full" />
                <SkeletonBlock className="mt-2 h-4 w-[80%]" />
                <SkeletonBlock className="mt-6 aspect-video w-full" />
              </div>

              <div className="space-y-9">
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

          <div className="space-y-10">
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
   IMAGE
========================================================= */

function Thumb({ src, className = "", title = "" }) {
  const image = normalizeUrl(src) || FALLBACK_IMAGE;

  return (
    <div
      className={`relative overflow-hidden rounded bg-[#F4F6F8] ${className}`}
    >
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
      <div className="flex h-8 max-w-[170px] items-center overflow-hidden">
        <img
          src={logo}
          alt={sourceName || authorName || "Source"}
          className="max-h-7 max-w-[145px] object-contain"
          onError={(event) => {
            event.currentTarget.style.display = "none";
          }}
        />
      </div>
    );
  }

  return (
    <span className="max-w-[190px] truncate text-[11px] font-semibold text-[#374151]">
      {sourceName || authorName || "Source"}
    </span>
  );
}

/* =========================================================
   TAGS
========================================================= */

function Tags({ post }) {
  const tags = [
    post?.category?.name,
    getMediaLabel(post?.media_type),
    "Commentary",
  ].filter(Boolean);

  return (
    <p className="text-[12px] font-medium text-[#2A57C4]">
      {tags.map((tag, index) => (
        <React.Fragment key={`${tag}-${index}`}>
          {index > 0 && (
            <span className="mx-1 text-[#4B5563]">|</span>
          )}

          <span className="transition-colors hover:text-[#083B6B]">
            {tag}
          </span>
        </React.Fragment>
      ))}
    </p>
  );
}

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

function formatDate(date) {
  if (!date) return "";

  try {
    const formatted = new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    });

    return formatted;
  } catch {
    return "";
  }
}

/* =========================================================
   META
========================================================= */

function Meta({ post }) {
  return (
    <>
      <div className="mt-1 flex flex-wrap items-center gap-3">
        <span className="text-[12px] text-[#9CA3AF]">
          {post?.published_date_formatted ||
            formatDate(post?.published_date)}
        </span>

        <SourceInfo
          sourceLogo={post?.source_logo}
          sourceName={post?.source_name}
          authorName={post?.author_name}
        />

        {post?.read_time ? (
          <span className="text-[11px] text-[#9CA3AF]">
            {post.read_time} min read
          </span>
        ) : null}
      </div>

      <div className="mt-1">
        <Tags post={post} />
      </div>
    </>
  );
}

/* =========================================================
   ARTICLE ROW
   LEFT POSTS + MORE POSTS
========================================================= */

function ArticleRow({
  post,
  showContent = false,
  rotateImage = false,
  linkType = "format",
}) {
  if (!post) return null;

  const externalUrl = getPostExternalUrl(post, linkType);

  return (
    <motion.article
      variants={staggerChild}
      className="group flex items-stretch gap-4"
    >
      {/* IMAGE */}

      {externalUrl ? (
        <a
          href={externalUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-[140px] shrink-0 self-stretch"
        >
          <Thumb
            src={post.image_url}
            title={post.title}
            className="h-full min-h-[80px] w-full"
          />
        </a>
      ) : (
        <div className="block w-[140px] shrink-0 self-stretch">
          <Thumb
            src={post.image_url}
            title={post.title}
            className="h-full min-h-[80px] w-full"
          />
        </div>
      )}

      {/* CONTENT */}

      <div className="min-w-0 flex-1">
        {externalUrl ? (
          <a
            href={externalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="
              block
              text-[14px]
              leading-[22px]
              text-[#111827]
              underline
              decoration-[#9CA3AF]
              underline-offset-2
              transition-colors
              hover:text-[#0B4D8C]
            "
          >
            {showContent
              ? post.content || post.excerpt || post.title
              : post.title}
          </a>
        ) : (
          <div
            className="
              block
              text-[14px]
              leading-[22px]
              text-[#111827]
            "
          >
            {showContent
              ? post.content || post.excerpt || post.title
              : post.title}
          </div>
        )}

        {post.excerpt && !showContent ? (
          <p className="mt-2 line-clamp-3 text-[12px] leading-5 text-[#6B7280]">
            {post.excerpt}
          </p>
        ) : null}

        <Meta post={post} />
      </div>
    </motion.article>
  );
}

/* =========================================================
   SMALL SIDE ARTICLE
========================================================= */

function SideArticle({ post }) {
  if (!post) return null;

  const externalUrl = getPostExternalUrl(post, "format");

  return (
    <motion.article
      variants={staggerChild}
      className="group flex items-stretch gap-4"
    >
      {/* IMAGE */}

      {externalUrl ? (
        <a
          href={externalUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-[160px] shrink-0 self-stretch"
        >
          <Thumb
            src={post.image_url}
            title={post.title}
            className="h-full min-h-[100px] w-full"
          />
        </a>
      ) : (
        <div className="block w-[160px] shrink-0 self-stretch">
          <Thumb
            src={post.image_url}
            title={post.title}
            className="h-full min-h-[100px] w-full"
          />
        </div>
      )}

      {/* CONTENT */}

      <div className="min-w-0 flex-1">
        {externalUrl ? (
          <a
            href={externalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="
              block
              text-[13px]
              leading-[22px]
              text-[#111827]
              transition-colors
              hover:text-[#0B4D8C]
            "
          >
            {post.title}
          </a>
        ) : (
          <div
            className="
              block
              text-[13px]
              leading-[22px]
              text-[#111827]
            "
          >
            {post.title}
          </div>
        )}

        {post.excerpt ? (
          <p className="mt-2 line-clamp-2 text-[11px] leading-5 text-[#6B7280]">
            {post.excerpt}
          </p>
        ) : null}

        <Meta post={post} />
      </div>
    </motion.article>
  );
}

/* =========================================================
   MEMBER LOGO
========================================================= */

function MemberLogo({ member }) {
  const logo = normalizeUrl(member?.logo_url);

  if (logo) {
    return (
      <div className="flex h-[50px] items-center">
        <img
          src={logo}
          alt={member?.name || "Member"}
          className="
            max-h-[45px]
            max-w-[170px]
            object-contain
            object-left
          "
          onError={(event) => {
            event.currentTarget.style.display = "none";
          }}
        />
      </div>
    );
  }

  return (
    <div className="flex h-[50px] items-center text-2xl font-bold text-[#111827]">
      {member?.name}
    </div>
  );
}

/* =========================================================
   MEMBERS
========================================================= */

function MembersSection({ members = [] }) {
  if (!members.length) {
    return null;
  }

  return (
    <motion.section
      className="mt-20"
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={{
        once: true,
        amount: 0.15,
      }}
    >
      <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-4">
        <h2 className="text-xl font-bold text-[#111827] md:text-2xl">
          Members
        </h2>

        <Link
          to="/PartnerDirectory"
          className="
            flex
            items-center
            gap-1.5
            text-[12px]
            font-semibold
            tracking-wide
            text-[#0B4D8C]
            transition-colors
            hover:text-[#083B6B]
          "
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
        viewport={{
          once: true,
          amount: 0.15,
        }}
      >
        {members.map((member, index) => {
          const websiteUrl = normalizeUrl(member?.website_url);

          return (
            <motion.div
              key={member.id || member.name || index}
              variants={staggerChild}
              className={`
                px-0
                py-5
                sm:px-6
                ${
                  index > 0
                    ? "lg:border-l lg:border-[#E5E7EB]"
                    : "lg:pl-0"
                }
                ${index === 0 ? "sm:pl-0" : ""}
              `}
            >
              {/* MEMBER WEBSITE URL */}

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

              <p className="mt-8 max-w-xs text-[14px] leading-6 text-[#4B5563]">
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
      className="self-start lg:sticky lg:top-6"
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={{
        once: true,
        amount: 0.2,
      }}
    >
      <div
        className="rounded-3xl p-6 text-white"
        style={{
          backgroundColor: COLORS.primary,
        }}
      >
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-white/80">
          Newsletter
        </p>

        <h3 className="mt-3 text-2xl font-medium leading-tight tracking-tight md:text-3xl">
          Insights For
          <br />
          A Brighter Tomorrow
        </h3>

        <p className="mt-4 text-[14px] leading-6 text-blue-50">
          Receive the latest perspectives on wealth, legacy and family
          offices.
        </p>

        {/* SUBSCRIBE INPUT */}

        <div className="mt-5 flex items-center rounded-full bg-white p-1.5 pl-4">
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
              text-[13px]
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
              h-10
              w-10
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
   HERO CONTENT
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
      className="mt-6"
      variants={staggerParent}
      initial="hidden"
      whileInView="show"
      viewport={{
        once: true,
        amount: 0.2,
      }}
    >
      {paragraphs.map((paragraph, index) => (
        <motion.p
          key={`${paragraph}-${index}`}
          variants={staggerChild}
          className="mb-3 text-[14px] leading-7 text-[#4B5563]"
        >
          {paragraph}
        </motion.p>
      ))}
    </motion.div>
  );
}

/* =========================================================
   MAIN PAGE
========================================================= */

export default function ArticlePage() {
  const {
    data: apiResponse,
    isLoading,
    isError,
  } = useGetCommentaryPageQuery();

  const pageData = apiResponse?.data;

  const hero = pageData?.hero || null;

  const leftPosts = Array.isArray(pageData?.left_posts)
    ? pageData.left_posts
    : [];

  const rightGrid = Array.isArray(pageData?.right_grid)
    ? pageData.right_grid
    : [];

  const members = Array.isArray(pageData?.members)
    ? pageData.members
    : [];

  const morePosts = Array.isArray(pageData?.more_posts?.items)
    ? pageData.more_posts.items
    : [];

  /* =======================================================
     LOADING
  ======================================================= */

  if (isLoading) {
    return (
      <>
        <link
          rel="preconnect"
          href="https://fonts.googleapis.com"
        />

        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />

        <link
          href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,300;0,400;0,500;0,700;0,900;1,400&display=swap"
          rel="stylesheet"
        />

        <div
          className="bg-white text-[#111827]"
          style={{
            fontFamily: "'Roboto', sans-serif",
          }}
        >
          <PageSkeleton />
        </div>
      </>
    );
  }

  /* =======================================================
     ERROR
  ======================================================= */

  if (isError || !pageData) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-white">
        <div className="text-sm text-red-500">
          Unable to load commentary content.
        </div>
      </div>
    );
  }

  /* =======================================================
     PAGE
  ======================================================= */

  return (
    <>
      <link
        rel="preconnect"
        href="https://fonts.googleapis.com"
      />

      <link
        rel="preconnect"
        href="https://fonts.gstatic.com"
        crossOrigin="anonymous"
      />

      <link
        href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,300;0,400;0,500;0,700;0,900;1,400&display=swap"
        rel="stylesheet"
      />

      <div
        className="min-h-screen bg-white text-[#111827]"
        style={{
          fontFamily: "'Roboto', sans-serif",
        }}
      >
        <div className="mx-auto max-w-[1440px] px-6 py-6 lg:px-10">
          {/* =================================================
              MAIN GRID
          ================================================= */}

          <div className="grid gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
            {/* =================================================
                LEFT POSTS
            ================================================= */}

            <motion.div
              className="space-y-10"
              variants={staggerParent}
              initial="hidden"
              animate="show"
            >
              {leftPosts.map((post, index) => (
                <ArticleRow
                  key={post.id || post.slug || index}
                  post={post}
                  showContent
                  rotateImage
                  linkType="format"
                />
              ))}
            </motion.div>

            {/* =================================================
                FEATURED / HERO
            ================================================= */}

            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="show"
            >
              {hero ? (
                <>
                  {/* HERO TITLE */}

                  <motion.h1
                    variants={fadeUp}
                    className="
                      text-3xl
                      font-semibold
                      leading-tight
                      tracking-tight
                      md:text-4xl
                    "
                    style={{
                      color: COLORS.heading,
                    }}
                  >
                    {hero.title}
                  </motion.h1>

                  {/* HERO EXCERPT */}

                  {hero.excerpt ? (
                    <motion.p
                      variants={fadeIn}
                      className="mt-5 max-w-3xl text-[14px] leading-7 text-[#4B5563]"
                    >
                      {hero.excerpt}
                    </motion.p>
                  ) : null}

                  {/* HERO META */}

                  <motion.div variants={fadeIn}>
                    <Meta post={hero} />
                  </motion.div>

                  {/* HERO IMAGE
                      MAIN CLICK -> source_url
                  */}

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
                        className="mt-5 aspect-video w-full"
                      />
                    </motion.a>
                  ) : (
                    <motion.div
                      variants={fadeIn}
                      className="group block"
                    >
                      <Thumb
                        src={hero.image_url}
                        title={hero.title}
                        className="mt-5 aspect-video w-full"
                      />
                    </motion.div>
                  )}

                  {/* HERO CONTENT */}

                  <HeroContent content={hero.content} />
                </>
              ) : null}

              {/* =================================================
                  SECONDARY GRID
              ================================================= */}

              {(rightGrid.length > 0 || leftPosts.length > 0) && (
                <div className="mt-14 grid gap-10 md:grid-cols-2">
                  {/* LEFT SECONDARY ARTICLE */}

                  {rightGrid[0] ? (
                    <motion.div
                      variants={fadeUp}
                      initial="hidden"
                      whileInView="show"
                      viewport={{
                        once: true,
                        amount: 0.2,
                      }}
                    >
                      {/* RIGHT GRID -> format_url */}

                      {getPostExternalUrl(
                        rightGrid[0],
                        "format"
                      ) ? (
                        <a
                          href={getPostExternalUrl(
                            rightGrid[0],
                            "format"
                          )}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block"
                        >
                          <h2
                            className="
                              text-2xl
                              font-bold
                              leading-tight
                              tracking-tight
                              text-[#111827]
                              hover:text-[#0B4D8C]
                              md:text-3xl
                            "
                          >
                            {rightGrid[0].title}
                          </h2>
                        </a>
                      ) : (
                        <h2
                          className="
                            text-2xl
                            font-bold
                            leading-tight
                            tracking-tight
                            text-[#111827]
                            md:text-3xl
                          "
                        >
                          {rightGrid[0].title}
                        </h2>
                      )}

                      {rightGrid[0].excerpt ? (
                        <p className="mt-5 text-[14px] leading-7 text-[#4B5563]">
                          {rightGrid[0].excerpt}
                        </p>
                      ) : null}

                      <Meta post={rightGrid[0]} />

                      {getPostExternalUrl(
                        rightGrid[0],
                        "format"
                      ) ? (
                        <a
                          href={getPostExternalUrl(
                            rightGrid[0],
                            "format"
                          )}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group block"
                        >
                          <Thumb
                            src={rightGrid[0].image_url}
                            title={rightGrid[0].title}
                            className="mt-6 aspect-video w-full"
                          />
                        </a>
                      ) : (
                        <div className="group block">
                          <Thumb
                            src={rightGrid[0].image_url}
                            title={rightGrid[0].title}
                            className="mt-6 aspect-video w-full"
                          />
                        </div>
                      )}
                    </motion.div>
                  ) : null}

                  {/* RIGHT SIDE GRID */}

                  <motion.div
                    className="space-y-9"
                    variants={staggerParent}
                    initial="hidden"
                    whileInView="show"
                    viewport={{
                      once: true,
                      amount: 0.15,
                    }}
                  >
                    {rightGrid.slice(1, 4).map((post, index) => (
                      <SideArticle
                        key={post.id || post.slug || index}
                        post={post}
                      />
                    ))}
                  </motion.div>
                </div>
              )}
            </motion.div>
          </div>

          {/* =================================================
              MEMBERS
          ================================================= */}

          <MembersSection members={members} />

          {/* =================================================
              MORE POSTS + NEWSLETTER
          ================================================= */}

          <div className="mt-14 grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)_minmax(0,1fr)]">
            {/* EMPTY LEFT */}

            <div className="hidden lg:block" />

            {/* MORE POSTS */}

            <div>
              {morePosts.length > 0 ? (
                <motion.div
                  className="space-y-10"
                  variants={staggerParent}
                  initial="hidden"
                  whileInView="show"
                  viewport={{
                    once: true,
                    amount: 0.1,
                  }}
                >
                  {morePosts.map((post, index) => (
                    <ArticleRow
                      key={post.id || post.slug || index}
                      post={post}
                      linkType="format"
                    />
                  ))}
                </motion.div>
              ) : null}

              {/* LOAD MORE */}

              {pageData?.more_posts?.pagination?.has_more ? (
                <motion.div
                  className="mt-12 flex justify-center"
                  variants={fadeIn}
                  initial="hidden"
                  whileInView="show"
                  viewport={{
                    once: true,
                  }}
                >
                  <button
                    type="button"
                    className="
                      rounded-full
                      border
                      border-[#D1D5DB]
                      px-8
                      py-2.5
                      text-[13px]
                      font-semibold
                      tracking-wide
                      text-[#0B4D8C]
                      transition-all
                      duration-300
                      hover:border-[#0B4D8C]
                      hover:bg-[#F5F8FC]
                    "
                  >
                    LOAD MORE
                  </button>
                </motion.div>
              ) : null}
            </div>

            {/* NEWSLETTER */}

            <Newsletter />
          </div>
        </div>
      </div>
    </>
  );
}