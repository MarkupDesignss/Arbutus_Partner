import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Share2,
  Bookmark,
  Linkedin,
  Link2,
  ChevronDown,
  ArrowRight,
  User,
  MoveRightIcon,
} from "lucide-react";

import {
  useGetCommentaryPageQuery,
  useSendSubscribeMutation,
} from "../../Redux/api/publicApiSlice";

// SweetAlert2
import Swal from "sweetalert2";

// Local images
import FeaturedMain from "../../../public/assets/img1.png";
import CtaBanner from "../../../public/assets/img4.png";

/* =========================================================
   FRAMER MOTION VARIANTS
========================================================= */

const fadeUp = {
  hidden: {
    opacity: 0,
    y: 25,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.65,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const fadeLeft = {
  hidden: {
    opacity: 0,
    x: -25,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.55,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const fadeRight = {
  hidden: {
    opacity: 0,
    x: 30,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.65,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const cardItem = {
  hidden: {
    opacity: 0,
    y: 18,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const imageReveal = {
  hidden: {
    opacity: 0,
    scale: 1.03,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

/* =========================================================
   SIDEBAR ARTICLE
========================================================= */

const SidebarArticle = ({ article, index }) => {
  return (
    <motion.article
      variants={cardItem}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
      whileHover={{ x: 4 }}
      transition={{ duration: 0.2 }}
      className="group border-b border-[#e8e8e8] py-4 first:pt-3"
    >
      <div className="flex gap-4 items-start">
        <div className="min-w-0 flex-1">
          <span className="block text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.08em] text-[#777] mb-2">
            {article.category?.name || "Commentary"}
          </span>

          <h4 className="text-[13px] sm:text-[14px] leading-[1.4] font-semibold text-[#1b1b1b] line-clamp-3">
            {article.title}
          </h4>

          <div className="mt-2 flex items-center gap-1.5 text-[10px] sm:text-[11px] text-[#999]">
            <User size={12} strokeWidth={1.5} />
            <span>{article.published_date_formatted}</span>
          </div>
        </div>

        <motion.img
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.3 }}
          src={article.image_url}
          alt={article.title}
          className="w-[72px] h-[58px] sm:w-[78px] sm:h-[64px] object-cover flex-shrink-0 rounded-[4px]"
        />
      </div>
    </motion.article>
  );
};

/* =========================================================
   COMMENTARY CARD
========================================================= */

const CommentaryCard = ({ article }) => {
  return (
    <motion.article
      variants={cardItem}
      whileHover={{ x: 4 }}
      transition={{ duration: 0.2 }}
      className="flex gap-4 border-b border-[#e8e8e8] pb-4 last:border-0"
    >
      <div className="min-w-0 flex-1">
        <span className="block text-[10px] font-bold uppercase tracking-[0.08em] text-[#777] mb-2">
          {article.category?.name || "Commentary"}
        </span>

        <h4 className="text-[13px] sm:text-[14px] leading-[1.4] font-semibold text-[#222] line-clamp-3">
          {article.title}
        </h4>

        <p className="mt-2 text-[10px] sm:text-[11px] text-[#999]">
          {article.published_date_formatted}
        </p>
      </div>

      <motion.img
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.3 }}
        src={article.image_url}
        alt={article.title}
        className="w-[82px] h-[64px] sm:w-[95px] sm:h-[72px] object-cover rounded-[4px] flex-shrink-0"
      />
    </motion.article>
  );
};

/* =========================================================
   MEMBER CARD
========================================================= */

const MemberCard = ({ member }) => {
  return (
    <motion.article
      variants={cardItem}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.25 }}
      className="min-w-0"
    >
      <div className="h-[55px] flex items-center mb-4">
        <img
          src={member.logo_url}
          alt={member.name}
          className="max-h-[42px] max-w-[145px] object-contain object-left"
        />
      </div>

      <p className="text-[12px] sm:text-[13px] leading-[1.65] text-[#777] max-w-[420px]">
        {member.description}
      </p>

      <a
        href={member.website_url}
        target="_blank"
        rel="noreferrer"
        className="mt-2 inline-block text-[11px] font-semibold text-[#3764aa] hover:text-[#111] transition"
      >
        Visit Website →
      </a>
    </motion.article>
  );
};

/* =========================================================
   ARTICLE FEED CARD
========================================================= */

const ArticleFeedCard = ({ article }) => {
  return (
    <motion.article
      variants={cardItem}
      whileHover={{ x: 4 }}
      transition={{ duration: 0.2 }}
      className="flex items-center gap-4 py-4 border-b border-[#e8e8e8] last:border-0"
    >
      <div className="flex-1 min-w-0">
        <span className="block text-[10px] font-bold uppercase tracking-[0.08em] text-[#777] mb-2">
          {article.category?.name || "Commentary"}
        </span>

        <h4 className="text-[13px] sm:text-[14px] font-semibold leading-[1.45] text-[#222] line-clamp-2">
          {article.title}
        </h4>

        <p className="text-[10px] sm:text-[11px] text-[#999] mt-2">
          {article.published_date_formatted}
        </p>
      </div>

      <motion.img
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.3 }}
        src={article.image_url}
        alt={article.title}
        className="w-[68px] h-[62px] sm:w-[76px] sm:h-[68px] object-cover rounded-[4px] flex-shrink-0"
      />
    </motion.article>
  );
};

/* =========================================================
   LOADING SKELETON
========================================================= */

const LoadingSkeleton = () => (
  <div className="max-w-[1320px] mx-auto px-5 sm:px-8 lg:px-12 py-16 animate-pulse">
    <div className="grid grid-cols-1 lg:grid-cols-[290px_minmax(0,1fr)] gap-10 lg:gap-[60px]">
      <div className="space-y-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-[70px] bg-gray-100 rounded" />
        ))}
      </div>

      <div className="space-y-6">
        <div className="h-[40px] bg-gray-100 rounded w-3/4" />
        <div className="h-[200px] bg-gray-100 rounded" />
        <div className="h-[300px] bg-gray-100 rounded" />
      </div>
    </div>
  </div>
);

/* =========================================================
   MAIN PAGE
========================================================= */

const ArticlePage = () => {
  const { data, isLoading, isError, error, refetch } =
    useGetCommentaryPageQuery();

  /* =========================================================
     SUBSCRIBE API
  ========================================================= */

  const [sendSubscribe, { isLoading: isSubscribing }] =
    useSendSubscribeMutation();

  const [email, setEmail] = useState("");

  /* =========================================================
     SUBSCRIBE HANDLER
  ========================================================= */

  const handleSubscribe = async (e) => {
    e.preventDefault();

    const trimmedEmail = email.trim();

    // Empty email
    if (!trimmedEmail) {
      await Swal.fire({
        icon: "warning",
        title: "Email Required",
        text: "Please enter your email address.",
        confirmButtonText: "OK",
        confirmButtonColor: "#2456b5",
      });

      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(trimmedEmail)) {
      await Swal.fire({
        icon: "warning",
        title: "Invalid Email",
        text: "Please enter a valid email address.",
        confirmButtonText: "OK",
        confirmButtonColor: "#2456b5",
      });

      return;
    }

    try {
      const response = await sendSubscribe({
        email: trimmedEmail,
      }).unwrap();

      setEmail("");

      await Swal.fire({
        icon: "success",
        title: "Subscribed Successfully",
        text:
          response?.message ||
          "You have successfully subscribed to our newsletter.",
        confirmButtonText: "Done",
        confirmButtonColor: "#2456b5",
      });
    } catch (err) {
      console.error("Subscription Error:", err);

      const errorMessage =
        err?.data?.message ||
        err?.data?.error ||
        err?.message ||
        "Something went wrong. Please try again.";

      await Swal.fire({
        icon: "error",
        title: "Subscription Failed",
        text: errorMessage,
        confirmButtonText: "Try Again",
        confirmButtonColor: "#2456b5",
      });
    }
  };

  /* ---------- Loading ---------- */

  if (isLoading) return <LoadingSkeleton />;

  /* ---------- Error ---------- */

  if (isError) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center gap-4 text-center px-4"
        style={{ fontFamily: "'Poppins', sans-serif" }}
      >
        <p className="text-[#555]">
          {error?.data?.message || "Something went wrong while loading."}
        </p>

        <button
          onClick={refetch}
          className="px-5 py-2 rounded-full bg-[#3764aa] text-white text-[12px] font-semibold hover:bg-[#2456b5] transition"
        >
          Retry
        </button>
      </div>
    );
  }

  /* ---------- Data ---------- */

  const hero = data?.data?.hero;
  const posts = data?.data?.posts?.items || [];
  const sidebar = data?.data?.sidebar || [];
  const members = data?.data?.members || [];
  const pagination = data?.data?.posts?.pagination;

  return (
    <>
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
            <div className="grid grid-cols-1 lg:grid-cols-[290px_minmax(0,1fr)] gap-10 lg:gap-[60px] items-start">
              {/* =================================================
                  LEFT SIDEBAR — Related Articles
                  STICKY ON DESKTOP
              ================================================= */}

              <aside className="order-2 lg:order-1 self-start lg:sticky lg:top-[90px] h-fit">
                <motion.div
                  variants={fadeLeft}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.2 }}
                >
                  <div className="flex items-center justify-between border-b border-[#d8d8d8] pb-3 mb-1">
                    <h3 className="text-[16px] sm:text-[17px] font-bold text-[#1c1c1c]">
                      Related Articles
                    </h3>

                    <button className="flex items-center gap-1.5 text-[11px] font-semibold text-[#3764aa] hover:text-[#111] transition">
                      View All
                      <ArrowRight size={13} />
                    </button>
                  </div>

                  <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    animate="visible"
                  >
                    {sidebar.map((article, index) => (
                      <SidebarArticle
                        article={article}
                        index={index}
                        key={article.id}
                      />
                    ))}
                  </motion.div>

                  <motion.button
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full mt-6 py-3 border border-[#d8d8d8] rounded-full text-[11px] sm:text-[12px] font-semibold text-[#555] flex items-center justify-center gap-2 hover:border-[#999] transition"
                  >
                    Load More
                    <ChevronDown size={14} />
                  </motion.button>
                </motion.div>
              </aside>

              {/* =================================================
                  RIGHT MAIN ARTICLE
              ================================================= */}

              <main className="order-1 lg:order-2 min-w-0">
                {/* =================================================
                    ARTICLE HEADER
                ================================================= */}

                {hero && (
                  <motion.header
                    variants={fadeRight}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.15 }}
                    className="mb-8"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.14em] text-[#777]">
                        {hero.category?.name || "Commentary"}
                      </span>

                      <span className="h-[1px] w-[45px] bg-[#d5d5d5]" />
                    </div>

                    <h1 className="text-[22px] sm:text-[27px] lg:text-[31px] leading-[1.08] font-bold tracking-[-0.035em] text-[#151515] mb-5 max-w-[900px]">
                      {hero.title}
                    </h1>

                    <p className="text-[14px] sm:text-[15px] lg:text-[16px] leading-[1.65] text-[#777] max-w-[850px] mb-7">
                      {hero.excerpt}
                    </p>

                    {/* Author + Social */}
                    <div className="flex items-center flex-wrap gap-y-3">
                      {hero.author_avatar && (
                        <motion.img
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.45 }}
                          src={hero.author_avatar}
                          alt={hero.author_name}
                          className="w-[42px] h-[42px] sm:w-[46px] sm:h-[46px] rounded-full object-cover mr-3"
                        />
                      )}

                      <div>
                        <p className="text-[12px] sm:text-[13px] font-semibold text-[#222]">
                          By {hero.author_name}
                        </p>

                        <p className="text-[10px] sm:text-[11px] text-[#999] mt-1">
                          {hero.published_date_formatted}&nbsp; • &nbsp;
                          {hero.read_time} min read
                        </p>
                      </div>

                      <div className="ml-auto flex items-center gap-2">
                        {(hero.source_url || hero.format_url) && (
                          <motion.a
                            whileHover={{ scale: 1.08, y: -2 }}
                            whileTap={{ scale: 0.96 }}
                            href={hero.source_url || hero.format_url}
                            target="_blank"
                            rel="noreferrer"
                            className="w-[34px] h-[34px] rounded-full border border-[#e3e3e3] flex items-center justify-center text-[#777] hover:text-[#111] hover:border-[#aaa] transition"
                          >
                            <Linkedin size={14} />
                          </motion.a>
                        )}

                        <motion.button
                          whileHover={{ scale: 1.08, y: -2 }}
                          whileTap={{ scale: 0.96 }}
                          type="button"
                          onClick={() =>
                            navigator.share?.({
                              title: hero.title,
                              url: window.location.href,
                            })
                          }
                          className="w-[34px] h-[34px] rounded-full border border-[#e3e3e3] flex items-center justify-center text-[#777] hover:text-[#111] hover:border-[#aaa] transition"
                        >
                          <Share2 size={14} />
                        </motion.button>

                        <motion.button
                          whileHover={{ scale: 1.08, y: -2 }}
                          whileTap={{ scale: 0.96 }}
                          type="button"
                          onClick={() =>
                            navigator.clipboard.writeText(
                              window.location.href
                            )
                          }
                          className="w-[34px] h-[34px] rounded-full border border-[#e3e3e3] flex items-center justify-center text-[#777] hover:text-[#111] hover:border-[#aaa] transition"
                        >
                          <Link2 size={14} />
                        </motion.button>

                        <motion.button
                          whileHover={{ scale: 1.08, y: -2 }}
                          whileTap={{ scale: 0.96 }}
                          type="button"
                          className="w-[34px] h-[34px] rounded-full border border-[#e3e3e3] flex items-center justify-center text-[#777] hover:text-[#111] hover:border-[#aaa] transition"
                        >
                          <Bookmark size={14} />
                        </motion.button>
                      </div>
                    </div>
                  </motion.header>
                )}

                {/* =================================================
                    FEATURED IMAGE
                ================================================= */}

                {hero?.image_url && (
                  <motion.div
                    variants={imageReveal}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                    className="w-full h-[280px] sm:h-[390px] lg:h-[200px] overflow-hidden rounded-[5px] mb-8"
                  >
                    <motion.img
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.6 }}
                      src={hero.image_url}
                      alt={hero.title}
                      className="w-full h-full object-cover object-center"
                    />
                  </motion.div>
                )}

                {/* =================================================
                    ARTICLE CONTENT
                ================================================= */}

                <motion.section
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.12 }}
                  className="mb-12"
                >
                  <h2 className="text-[22px] sm:text-[27px] lg:text-[31px] font-bold leading-[1.2] text-[#171717] mb-4 max-w-[900px]">
                    {hero?.title}
                  </h2>

                  <p className="text-[14px] sm:text-[15px] lg:text-[16px] text-[#707070] leading-[1.75] max-w-[900px]">
                    {hero?.excerpt}
                  </p>

                  {hero?.content &&
                    hero.content !== "Full content here..." && (
                      <div
                        className="mt-4 text-[14px] sm:text-[15px] lg:text-[16px] text-[#707070] leading-[1.75] max-w-[900px] prose"
                        dangerouslySetInnerHTML={{
                          __html: hero.content,
                        }}
                      />
                    )}
                </motion.section>

                {/* =================================================
                    COMMENTARY
                ================================================= */}

                {posts.length > 0 && (
                  <motion.section
                    variants={fadeUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.1 }}
                    className="mb-12"
                  >
                    <div className="flex items-center gap-3 mb-5">
                      <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#3764aa]">
                        {posts[0]?.category?.name || "Commentary"}
                      </span>

                      <span className="h-[1px] flex-1 bg-[#e3e3e3]" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-[1.15fr_0.85fr] gap-6">
                      {/* Big image */}
                      <motion.a
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, amount: 0.15 }}
                        transition={{ duration: 0.65 }}
                        whileHover={{ y: -4 }}
                        href={
                          posts[0]?.format_url ||
                          `/blog/${posts[0]?.slug}`
                        }
                        target={
                          posts[0]?.media_type === "weblink"
                            ? "_blank"
                            : "_self"
                        }
                        rel="noreferrer"
                        className="block h-[260px] sm:h-[330px] lg:h-[380px] overflow-hidden rounded-[5px] group"
                      >
                        <motion.img
                          whileHover={{ scale: 1.05 }}
                          transition={{ duration: 0.6 }}
                          src={posts[0]?.image_url}
                          alt={posts[0]?.title}
                          className="w-full h-full object-cover object-center"
                        />
                      </motion.a>

                      {/* Small cards */}
                      <motion.div
                        variants={staggerContainer}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.1 }}
                        className="flex flex-col gap-5"
                      >
                        {posts.slice(1, 4).map((article) => (
                          <CommentaryCard
                            article={article}
                            key={article.id}
                          />
                        ))}
                      </motion.div>
                    </div>
                  </motion.section>
                )}

                {/* =================================================
                    MEMBERS
                ================================================= */}

                {members.length > 0 && (
                  <motion.section
                    variants={fadeUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.1 }}
                    className="mb-12"
                  >
                    <div className="flex items-center justify-between border-b border-[#dedede] pb-3 mb-7">
                      <h3 className="text-[18px] sm:text-[20px] font-bold text-[#181818]">
                        Members
                      </h3>

                      <button className="flex items-center gap-1.5 text-[11px] font-semibold text-[#3764aa] hover:text-[#111] transition">
                        View All
                        <ArrowRight size={13} />
                      </button>
                    </div>

                    <motion.div
                      variants={staggerContainer}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true, amount: 0.1 }}
                      className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-10"
                    >
                      {members.map((member) => (
                        <MemberCard member={member} key={member.id} />
                      ))}
                    </motion.div>
                  </motion.section>
                )}

                {/* =================================================
                    LOWER ARTICLE FEED
                ================================================= */}

                {posts.length > 4 && (
                  <motion.section
                    variants={fadeUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.08 }}
                    className="mb-10"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#3764aa]">
                        Daily ETF Flows
                      </span>

                      <span className="h-[1px] flex-1 bg-[#e3e3e3]" />
                    </div>

                    <motion.div
                      variants={staggerContainer}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true, amount: 0.08 }}
                      className="grid grid-cols-1 md:grid-cols-2 gap-x-10"
                    >
                      {posts.slice(4).map((article) => (
                        <ArticleFeedCard
                          article={article}
                          key={`feed-${article.id}`}
                        />
                      ))}
                    </motion.div>
                  </motion.section>
                )}

                {/* =================================================
                    PAGINATION INFO
                ================================================= */}

                {pagination && pagination.last_page > 1 && (
                  <motion.div
                    variants={fadeUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="flex items-center justify-between text-[11px] text-[#999] mb-6"
                  >
                    <span>
                      Page {pagination.current_page} of{" "}
                      {pagination.last_page}
                    </span>

                    <span>Total: {pagination.total} posts</span>
                  </motion.div>
                )}
              </main>
            </div>
          </section>

          {/* =====================================================
              BOTTOM CTA
          ===================================================== */}

          <motion.section
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            className="pb-12 sm:pb-16"
          >
            <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_1.15fr] gap-[3px] rounded-[8px] overflow-hidden">
              {/* Image 1 */}
              <motion.div
                whileHover={{ scale: 1.01 }}
                transition={{ duration: 0.4 }}
                className="h-[220px] sm:h-[250px] lg:h-[280px] overflow-hidden"
              >
                <img
                  src={CtaBanner}
                  alt=""
                  className="w-full h-full object-cover object-center"
                />
              </motion.div>

              {/* Image 2 */}
              <motion.div
                whileHover={{ scale: 1.01 }}
                transition={{ duration: 0.4 }}
                className="h-[220px] sm:h-[250px] lg:h-[280px] overflow-hidden"
              >
                <img
                  src={FeaturedMain}
                  alt=""
                  className="w-full h-full object-cover object-center"
                />
              </motion.div>

              {/* =================================================
                  SUBSCRIPTION
              ================================================= */}

              <div className="bg-[#2456b5] h-[220px] sm:h-[250px] lg:h-[280px] px-7 sm:px-9 flex flex-col justify-center">
                <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.15em] font-bold text-white/70 mb-3">
                  Newsletter
                </span>

                <h2 className="text-[20px] sm:text-[22px] lg:text-[22px] leading-[1.1] font-bold text-white mb-3">
                  Insights For
                  <br />
                  A Brighter Tomorrow
                </h2>

                <p className="text-[11px] sm:text-[12px] text-white/75 leading-[1.55] mb-5 max-w-[280px]">
                  Receive the latest perspectives, insights and family
                  office news directly in your inbox.
                </p>

                <form
                  onSubmit={handleSubscribe}
                  className="relative max-w-[300px]"
                >
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    disabled={isSubscribing}
                    autoComplete="email"
                    className="w-full h-[40px] rounded-full bg-white px-4 pr-12 text-[11px] sm:text-[12px] text-[#333] outline-none placeholder:text-[#aaa] disabled:opacity-70"
                  />

                  <motion.button
                    whileHover={!isSubscribing ? { scale: 1.05 } : {}}
                    whileTap={!isSubscribing ? { scale: 0.95 } : {}}
                    type="submit"
                    disabled={isSubscribing}
                    className="absolute right-[3px] top-[3px] w-[34px] h-[34px] rounded-full bg-[#d9d9d9] text-[#2456b5] flex items-center justify-center hover:bg-white transition disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {isSubscribing ? (
                      <span className="w-[14px] h-[14px] border-2 border-[#2456b5]/30 border-t-[#2456b5] rounded-full animate-spin" />
                    ) : (
                      <MoveRightIcon size={15} />
                    )}
                  </motion.button>
                </form>
              </div>
            </div>
          </motion.section>
        </div>
      </div>
    </>
  );
};

export default ArticlePage;