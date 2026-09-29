import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useGetSubscribePriceQuery } from "../../Redux/api/publicApiSlice";
import PricingPlanSkeleton from "../../Skeleton/Level/PricingPlanSkeleton";
import LoginAuth from "../Authscreens/LoginAuth";
import {
  useSendPaymentGatewayMutation,
  useSendGetSubscriptionMutation,
} from "../../Redux/api/privateApiSlice";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";

export default function PricingPlan() {
  const location = useLocation();
  const navigate = useNavigate();

  const [billingCycle, setBillingCycle] = useState("monthly");
  const [showLogin, setShowLogin] = useState(false);
  const [loadingPlanId, setLoadingPlanId] = useState(null);
  const [purchasedPlans, setPurchasedPlans] = useState([]);

  const [sendPaymentGateway] = useSendPaymentGatewayMutation();

  const [getSubscriptions, { isLoading: isSubsLoading }] =
    useSendGetSubscriptionMutation();

  // =========================================================
  // AUTH
  // =========================================================
  const { token, email } = useSelector((state) => state.auth);
  const isLoggedIn = !!token && !!email;

  // =========================================================
  // PLANS API
  // =========================================================
  const { data: priceRes, isLoading } = useGetSubscribePriceQuery();
  const plans = priceRes?.data || [];

  // =========================================================
  // NORMALIZE PLAN TYPE
  // =========================================================
  const normalizePlanType = (raw) => {
    if (!raw) return null;

    const r = String(raw).toLowerCase();

    if (r === "annual") return "yearly";
    if (r === "yearly" || r === "monthly") return r;
    if (r.includes("year")) return "yearly";

    return "monthly";
  };

  // =========================================================
  // CHECK CURRENT PURCHASE
  // =========================================================
  const isPurchasedForCurrentCycle = (planId) => {
    return purchasedPlans.some(
      (p) =>
        Number(p.id) === Number(planId) &&
        normalizePlanType(p.planType) === billingCycle &&
        !p.isExpired &&
        p.is_active
    );
  };

  // =========================================================
  // FORMAT PRICE
  // =========================================================
  const formatPrice = (value) => {
    const num = Number(value);

    if (isNaN(num)) {
      return value ?? "$0.00";
    }

    return `$${num.toFixed(2)}`;
  };

  // =========================================================
  // GET PRICE
  // =========================================================
  const getPrice = (plan) => {
    if (!plan) return "Free";

    if (String(plan.name).toLowerCase() === "free") {
      return "Free";
    }

    return billingCycle === "monthly"
      ? formatPrice(plan.monthly_price)
      : formatPrice(plan.yearly_price);
  };

  // =========================================================
  // PERIOD TEXT
  // =========================================================
  const getPeriodText = (plan) => {
    if (String(plan.name).toLowerCase() === "free") {
      return "Free";
    }

    return billingCycle === "monthly" ? "Per Month" : "Per Year";
  };

  // =========================================================
  // NORMALIZE FEATURES
  // =========================================================
  const normalizeFeatures = (features) => {
    if (!features) return [];

    if (Array.isArray(features)) {
      return features;
    }

    if (typeof features === "string") {
      return features
        .split(",")
        .map((f) => f.trim())
        .filter(Boolean);
    }

    return [String(features)];
  };

  // =========================================================
  // FETCH SUBSCRIPTIONS
  // =========================================================
  useEffect(() => {
    if (!token) {
      setPurchasedPlans([]);
      return;
    }

    let mounted = true;

    const fetchSubs = async () => {
      try {
        const res = await getSubscriptions().unwrap();

        const arr = Array.isArray(res?.data) ? res.data : [];

        const mapped = arr.map((s) => {
          const todayNow = new Date();

          const endDate = s.end_date
            ? new Date(s.end_date)
            : null;

          const isExpired = endDate
            ? endDate < todayNow
            : false;

          return {
            id: Number(s.subscription_id),
            planType:
              normalizePlanType(s.plan_type) || "monthly",
            purchasedAt: s.start_date
              ? new Date(s.start_date).toISOString()
              : new Date().toISOString(),
            endDate,
            isExpired,
            status: isExpired ? "inactive" : s.status,
            is_active: !isExpired && !!s.is_active,
            raw: s,
          };
        });

        const map = new Map();

        mapped.forEach((item) => {
          const key = `${item.id}-${item.planType}`;

          const existing = map.get(key);

          if (!existing) {
            map.set(key, item);
          } else {
            if (
              new Date(item.purchasedAt) >
              new Date(existing.purchasedAt)
            ) {
              map.set(key, item);
            }
          }
        });

        const final = Array.from(map.values());

        if (mounted) {
          setPurchasedPlans(final);
        }
      } catch (err) {
        console.error("Error fetching subscriptions:", err);
      }
    };

    fetchSubs();

    return () => {
      mounted = false;
    };
  }, [token, getSubscriptions]);

  // =========================================================
  // PAYMENT CALLBACK
  // =========================================================
  useEffect(() => {
    const query = new URLSearchParams(location.search);

    const status = query.get("status");
    const subscriptionIdRaw = query.get("subscription_id");
    const planTypeRaw = query.get("plan_type");

    if (!subscriptionIdRaw || !status) {
      return;
    }

    if (status !== "success") {
      const message =
        query.get("message") ||
        "Something went wrong with your payment.";

      Swal.fire("Payment Failed", message, "error");

      navigate(location.pathname, {
        replace: true,
      });

      return;
    }

    if (plans.length === 0) {
      return;
    }

    const subscriptionId = Number(subscriptionIdRaw);

    const planType =
      normalizePlanType(planTypeRaw) || "monthly";

    const matchedPlan = plans.find(
      (p) => Number(p.id) === subscriptionId
    );

    if (!matchedPlan) {
      Swal.fire(
        "Payment Processed",
        `Payment succeeded but plan with id ${subscriptionId} not found in current plans.`,
        "warning"
      );

      const newEntry = {
        id: subscriptionId,
        planType,
        price: null,
        purchasedAt: new Date().toISOString(),
      };

      setPurchasedPlans((prev) => {
        const filteredPrev = prev.filter(
          (p) =>
            !(
              Number(p.id) === subscriptionId &&
              normalizePlanType(p.planType) === planType
            )
        );

        return [...filteredPrev, newEntry];
      });

      navigate(location.pathname, {
        replace: true,
      });

      return;
    }

    const priceKey =
      planType === "monthly"
        ? "monthly_price"
        : "yearly_price";

    const priceValue = matchedPlan[priceKey];

    if (priceValue === undefined) {
      Swal.fire(
        "Payment Processed",
        `Payment succeeded but plan pricing for ${planType} not found.`,
        "warning"
      );
    } else {
      Swal.fire(
        "Payment Successful",
        `You purchased ${matchedPlan.name} (${planType}) — ${formatPrice(
          priceValue
        )}.`,
        "success"
      );
    }

    const newEntry = {
      id: Number(subscriptionId),
      planType,
      price: priceValue ?? null,
      purchasedAt: new Date().toISOString(),
    };

    setPurchasedPlans((prev) => {
      const filtered = prev.filter(
        (p) =>
          !(
            Number(p.id) === newEntry.id &&
            normalizePlanType(p.planType) ===
              normalizePlanType(newEntry.planType)
          )
      );

      return [...filtered, newEntry];
    });

    navigate(location.pathname, {
      replace: true,
    });
  }, [location.search, plans, navigate]);

  // =========================================================
  // BUTTON CONFIG
  // =========================================================
  const getPlanButtonConfig = (
    plan,
    index,
    purchasedThisCycle,
    expiredThisCycle
  ) => {
    const isFree =
      String(plan.name).toLowerCase() === "free";

    // ================= GUEST =================
    if (!isLoggedIn) {
      if (isFree) {
        return {
          label: "Current Plan",
          disabled: true,
          className:
            "w-full h-[42px] border border-gray-300 rounded-lg text-gray-500 bg-gray-50 cursor-not-allowed opacity-70 text-sm font-medium",
        };
      }

      if (index === 1) {
        return {
          label: "Sign In",
          disabled: false,
          onClick: () => setShowLogin(true),
          className:
            "w-full h-[42px] bg-[#2A57C4] cursor-pointer text-white rounded-lg hover:bg-[#1e46a8] transition-all duration-300 flex items-center justify-center font-semibold text-sm shadow-sm",
        };
      }

      return {
        label: "Coming Soon",
        disabled: true,
        className:
          "w-full h-[42px] rounded-lg bg-gray-300 text-gray-600 cursor-not-allowed flex items-center justify-center font-medium text-sm",
      };
    }

    // ================= LOGGED IN =================
    if (isFree) {
      return {
        label: "Free Plan",
        disabled: true,
        className:
          "w-full h-[42px] border border-gray-300 rounded-lg text-gray-500 bg-gray-50 cursor-not-allowed opacity-70 text-sm font-medium",
      };
    }

    if (purchasedThisCycle) {
      return {
        label: `Active (${billingCycle})`,
        disabled: true,
        className:
          "w-full h-[42px] bg-teal-700 text-white rounded-lg cursor-not-allowed flex items-center justify-center font-semibold text-sm",
      };
    }

    if (index === 1) {
      return {
        label: "Current Plan",
        disabled: true,
        className:
          "w-full h-[42px] bg-[#2A57C4] text-white rounded-lg cursor-not-allowed flex items-center justify-center font-semibold text-sm",
      };
    }

    return {
      label: expiredThisCycle
        ? "Coming Soon"
        : "Coming Soon",
      disabled: true,
      className:
        "w-full h-[42px] rounded-lg bg-gray-300 text-gray-600 cursor-not-allowed flex items-center justify-center font-medium text-sm",
    };
  };

  // =========================================================
  // LOADING
  // =========================================================
  if (isLoading) {
    return <PricingPlanSkeleton />;
  }

  // =========================================================
  // UI
  // =========================================================
  return (
    <div className="min-h-screen w-full bg-white px-4 sm:px-6 lg:px-8 py-5 sm:py-6 lg:py-7">
      <div className="w-full max-w-7xl mx-auto">

        {/* =====================================================
            HEADER
        ====================================================== */}
        <div className="text-center mb-7 sm:mb-8 lg:mb-9">

          <span className="inline-flex items-center justify-center rounded-full bg-[#2A57C4]/10 px-4 py-1.5 text-xs sm:text-sm font-semibold text-[#2A57C4] mb-3">
            Membership Plans
          </span>

          <h1 className="text-3xl sm:text-4xl lg:text-[42px] leading-tight font-bold tracking-tight text-gray-900 roboto-bold">
            TBD
          </h1>
        </div>

        {/* =====================================================
            BILLING TOGGLE
        ====================================================== */}
        {/*
        <div className="flex justify-center mb-8">
          <div className="inline-flex items-center rounded-full bg-white border border-gray-200 p-1 shadow-sm">
            <button
              onClick={() => setBillingCycle("monthly")}
              className={`px-5 py-2 rounded-full text-sm font-medium ${
                billingCycle === "monthly"
                  ? "bg-[#2A57C4] text-white"
                  : "text-gray-700"
              }`}
            >
              Monthly
            </button>

            <button
              onClick={() => setBillingCycle("yearly")}
              className={`px-5 py-2 rounded-full text-sm font-medium ${
                billingCycle === "yearly"
                  ? "bg-[#2A57C4] text-white"
                  : "text-gray-700"
              }`}
            >
              Annual
            </button>
          </div>
        </div>
        */}

        {/* =====================================================
            PRICING AREA
        ====================================================== */}
        <div className="relative">

          {/* EMPTY STATE */}
          {plans.length === 0 && (
            <div className="w-full text-center py-10">
              <div className="max-w-md mx-auto rounded-xl border border-gray-200 bg-white px-6 py-8 shadow-sm">
                <p className="text-base font-semibold text-gray-700">
                  No plans available.
                </p>

                <p className="text-sm text-gray-500 mt-1">
                  Please check again later.
                </p>
              </div>
            </div>
          )}

          {/* SUBSCRIPTION LOADER */}
          {isSubsLoading && (
            <div className="absolute inset-0 rounded-2xl bg-black/10 backdrop-blur-[2px] flex items-center justify-center z-30">
              <div className="bg-white rounded-lg shadow-lg px-5 py-3">
                <span className="text-gray-700 text-sm font-medium animate-pulse">
                  Loading your subscription...
                </span>
              </div>
            </div>
          )}

          {/* =====================================================
              CARDS
          ====================================================== */}
          <div className="w-full max-w-[1120px] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">

            {plans.map((plan, index) => {
              const features = normalizeFeatures(
                plan.features
              );

              const isPopular =
                String(plan.is_popular) === "1" ||
                plan.is_popular === 1 ||
                plan.is_popular === true;

              const purchasedThisCycle =
                isPurchasedForCurrentCycle(plan.id);

              const expiredThisCycle =
                purchasedPlans.some(
                  (p) =>
                    Number(p.id) === Number(plan.id) &&
                    normalizePlanType(p.planType) ===
                      billingCycle &&
                    p.isExpired
                );

              const btn = getPlanButtonConfig(
                plan,
                index,
                purchasedThisCycle,
                expiredThisCycle
              );

              const isFree =
                String(plan.name).toLowerCase() === "free";

              return (
                <div
                  key={plan.id}
                  className={`
                    group relative w-full
                    bg-white
                    rounded-2xl
                    border
                    flex flex-col
                    justify-between
                    overflow-visible
                    transition-all duration-300
                    ${
                      purchasedThisCycle
                        ? "border-teal-500 shadow-[0_8px_22px_rgba(13,148,136,0.12)]"
                        : "border-gray-200 shadow-[0_5px_20px_rgba(0,0,0,0.04)] hover:-translate-y-1 hover:border-[#2A57C4]/25 hover:shadow-[0_12px_28px_rgba(0,0,0,0.07)]"
                    }
                  `}
                >
                  {/* =================================================
                      BADGE
                  ================================================== */}
                  {isPopular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20 whitespace-nowrap">
                      <span className="inline-flex items-center justify-center bg-[#2A57C4] text-white text-xs sm:text-sm font-semibold px-5 py-1.5 rounded-full shadow-md">
                        3 Levels
                      </span>
                    </div>
                  )}

                  {/* =================================================
                      CARD CONTENT
                  ================================================== */}
                  <div className="p-5 sm:p-5 lg:p-6">

                    {/* PLAN NAME */}
                    <div className="flex items-start justify-between gap-3 mb-3">

                      <div className="min-w-0">
                        <h3 className="text-xl sm:text-[23px] lg:text-[25px] leading-tight font-bold text-gray-900">
                          {plan.name}
                        </h3>

                        {plan.title && (
                          <p className="text-gray-500 text-xs sm:text-sm mt-1.5 leading-5 line-clamp-2">
                            {plan.title}
                          </p>
                        )}
                      </div>

                      {isFree && (
                        <span className="shrink-0 rounded-full bg-gray-100 text-gray-600 px-2.5 py-1 text-[10px] sm:text-[11px] font-semibold">
                          Basic
                        </span>
                      )}
                    </div>

                    {/* PRICE */}
                    <div className="pt-3 pb-3.5 border-b border-gray-100">

                      <div className="flex items-end gap-2">
                        <span className="text-3xl sm:text-[30px] lg:text-[35px] leading-none font-semibold text-gray-900">
                          {getPrice(plan)}
                        </span>
                      </div>

                      <p className="text-gray-500 text-xs sm:text-sm mt-1.5">
                        {getPeriodText(plan)}
                      </p>
                    </div>

                    {/* FEATURES */}
                    <div className="pt-3.5">

                      <p className="text-sm font-bold text-gray-900 mb-3">
                        What's included
                      </p>

                      <ul className="space-y-2.5">
                        {features.slice(0, 3).map(
                          (feature, i) => (
                            <li
                              key={i}
                              className="flex items-start gap-2.5"
                            >
                              <span className="shrink-0 w-[18px] h-[18px] mt-[1px] rounded-full bg-green-50 flex items-center justify-center">
                                <img
                                  src="/arbutus-web/assets/Levels/correct.png"
                                  alt="tick"
                                  className="w-3 h-3 object-contain"
                                />
                              </span>

                              <span className="text-xs sm:text-[13px] lg:text-sm leading-5 text-gray-600">
                                {feature}
                              </span>
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  </div>

                  {/* =================================================
                      BUTTON
                  ================================================== */}
                  <div className="px-5 sm:px-5 lg:px-6 pb-5 sm:pb-5 lg:pb-6">

                    <button
                      disabled={btn.disabled}
                      onClick={btn.onClick}
                      className={`${btn.className} ${
                        !btn.disabled
                          ? "hover:scale-[1.01] active:scale-[0.99]"
                          : ""
                      }`}
                    >
                      {loadingPlanId === plan.id
                        ? "Processing..."
                        : btn.label}
                    </button>

                    {purchasedThisCycle && (
                      <p className="text-center text-[11px] text-teal-700 font-medium mt-2">
                        Your current subscription is active.
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* =====================================================
            CONTACT
        ====================================================== */}
        <div className="text-center mt-5 sm:mt-6">
          <div className="inline-flex items-center justify-center gap-1 text-sm">
            <span className="text-gray-500">
              Facing an issue?
            </span>

            <Link
              to="/Contactmain"
              className="text-[#2A57C4] font-semibold underline underline-offset-4 hover:text-[#1e46a8] transition"
            >
              Contact us
            </Link>
          </div>
        </div>
      </div>

      {/* LOGIN MODAL */}
      <LoginAuth
        isOpen={showLogin}
        onClose={() => setShowLogin(false)}
      />
    </div>
  );
}