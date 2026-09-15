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

  // ✅ auth se email aur token dono lo
  const { token, email } = useSelector((state) => state.auth);
  const isLoggedIn = !!token && !!email;

  const { data: priceRes, isLoading } = useGetSubscribePriceQuery();
  const plans = priceRes?.data || [];

  const normalizePlanType = (raw) => {
    if (!raw) return null;
    const r = String(raw).toLowerCase();
    if (r === "annual") return "yearly";
    if (r === "yearly" || r === "monthly") return r;
    if (r.includes("year")) return "yearly";
    return "monthly";
  };

  const isPurchasedForCurrentCycle = (planId) => {
    return purchasedPlans.some(
      (p) =>
        Number(p.id) === Number(planId) &&
        normalizePlanType(p.planType) === billingCycle &&
        !p.isExpired &&
        p.is_active
    );
  };

  const formatPrice = (value) => {
    const num = Number(value);
    if (isNaN(num)) return value ?? "$0.00";
    return `$${num.toFixed(2)}`;
  };

  const getPrice = (plan) => {
    if (!plan) return "$0.00";
    if (String(plan.name).toLowerCase() === "free") return "$0.00";
    return billingCycle === "monthly"
      ? formatPrice(plan.monthly_price)
      : formatPrice(plan.yearly_price);
  };

  const getPeriodText = (plan) => {
    if (String(plan.name).toLowerCase() === "free") return "Free";
    return billingCycle === "monthly" ? "Per Month" : "Per Year";
  };

  const normalizeFeatures = (features) => {
    if (!features) return [];
    if (Array.isArray(features)) return features;
    if (typeof features === "string") {
      return features
        .split(",")
        .map((f) => f.trim())
        .filter(Boolean);
    }
    return [String(features)];
  };

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
          const endDate = s.end_date ? new Date(s.end_date) : null;
          const isExpired = endDate ? endDate < todayNow : false;

          return {
            id: Number(s.subscription_id),
            planType: normalizePlanType(s.plan_type) || "monthly",
            purchasedAt: s.start_date
              ? new Date(s.start_date).toISOString()
              : new Date().toISOString(),
            endDate: endDate,
            isExpired: isExpired,
            status: isExpired ? "inactive" : s.status,
            is_active: !isExpired && !!s.is_active,
            raw: s,
          };
        });

        const map = new Map();
        mapped.forEach((item) => {
          const key = `${item.id}-${item.planType}`;
          const existing = map.get(key);
          if (!existing) map.set(key, item);
          else {
            if (new Date(item.purchasedAt) > new Date(existing.purchasedAt)) {
              map.set(key, item);
            }
          }
        });

        const final = Array.from(map.values());
        if (mounted) setPurchasedPlans(final);
      } catch (err) {
        console.error("Error fetching subscriptions:", err);
      }
    };

    fetchSubs();

    return () => {
      mounted = false;
    };
  }, [token, getSubscriptions]);

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
        query.get("message") || "Something went wrong with your payment.";
      Swal.fire("Payment Failed", message, "error");
      navigate(location.pathname, { replace: true });
      return;
    }

    if (plans.length === 0) {
      return;
    }

    const subscriptionId = Number(subscriptionIdRaw);
    const planType = normalizePlanType(planTypeRaw) || "monthly";
    const matchedPlan = plans.find((p) => Number(p.id) === subscriptionId);

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
      navigate(location.pathname, { replace: true });
      return;
    }

    const priceKey = planType === "monthly" ? "monthly_price" : "yearly_price";
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

    navigate(location.pathname, { replace: true });
  }, [location.search, plans, navigate]);


  const getPlanButtonConfig = (plan, index, purchasedThisCycle, expiredThisCycle) => {
    const isFree = String(plan.name).toLowerCase() === "free";

    // ---- GUEST (logged out) ----
    if (!isLoggedIn) {
      if (isFree) {
        return {
          label: "Current Plan",
          disabled: true,
          className:
            "w-full py-3 border rounded-lg text-gray-500 cursor-not-allowed opacity-60",
        };
      }

      if (index === 1) {
        // second plan -> Sign In
        return {
          label: "Sign In",
          disabled: false,
          onClick: () => setShowLogin(true),
          className:
            "w-full py-3 bg-[#2A57C4] cursor-pointer text-white rounded-lg hover:bg-[#1e46a8] transition flex items-center justify-center gap-2 font-medium",
        };
      }

      // third (aur baaki) -> Coming Soon
      return {
        label: "Coming Soon",
        disabled: true,
        className:
          "w-full py-3 rounded-lg bg-gray-400 text-white cursor-not-allowed flex items-center justify-center gap-2",
      };
    }

    // ---- LOGGED IN ----
    if (isFree) {
      return {
        label: "Free Plan",
        disabled: true,
        className:
          "w-full py-3 border rounded-lg text-gray-500 cursor-not-allowed opacity-60",
      };
    }

    if (purchasedThisCycle) {
      return {
        label: `Active (${billingCycle})`,
        disabled: true,
        className:
          "w-full py-3 bg-teal-700 text-white rounded-lg cursor-not-allowed flex items-center justify-center gap-2",
      };
    }

    if (index === 1) {
      // second plan -> Current Plan (kyunki user logged in hai)
      return {
        label: "Current Plan",
        disabled: true,
        className:
          "w-full py-3 bg-[#2A57C4] text-white rounded-lg cursor-not-allowed flex items-center justify-center gap-2 font-medium",
      };
    }

    // third aur baaki -> Coming Soon
    return {
      label: expiredThisCycle ? "Coming Soon" : "Coming Soon",
      disabled: true,
      className:
        "w-full py-3 rounded-lg bg-gray-400 text-white cursor-not-allowed flex items-center justify-center gap-2",
    };
  };

  if (isLoading) return <PricingPlanSkeleton />;

  return (
    <div className="min-h-screen py-10 px-4">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="text-center mb-8">
          <h1 className="text-4xl mb-4 roboto-bold">TBD</h1>
          <p className="max-w-2xl mx-auto text-gray-700">
            Sed ut perspiciatis unde omnis iste natus error sit voluptatem
            accusantium doloremque laudantium, totam rem aperiam, eaque ipsa
            quae ab illo.
          </p>
        </div>

        {/* BILLING TOGGLE */}
        <div className="flex justify-center mb-16">
          <div className="inline-flex rounded-full bg-white border border-gray-300 p-1 gap-2">
            <button
              onClick={() => setBillingCycle("monthly")}
              className={`px-8 py-3 rounded-full text-sm ${
                billingCycle === "monthly"
                  ? "bg-[#2A57C4] text-white"
                  : "text-gray-700"
              }`}
            >
              Monthly
            </button>

            <button
              onClick={() => setBillingCycle("yearly")}
              className={`px-8 py-3 rounded-full text-sm flex items-center gap-2 ${
                billingCycle === "yearly"
                  ? "bg-[#2A57C4] text-white"
                  : "text-gray-700 border border-[#4A4A4A]"
              }`}
            >
              Annual
              <span className="text-xs px-2 py-1 rounded bg-white text-black">
                Save 20%
              </span>
            </button>
          </div>
        </div>

        {/* PRICING CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto relative">
          {plans.length === 0 && (
            <div className="col-span-full text-center text-gray-500">
              No plans available.
            </div>
          )}

          {isSubsLoading && (
            <div className="absolute inset-0 rounded-2xl loading-gradient opacity-20 flex items-center justify-center z-20">
              <span className="text-white text-sm animate-pulse">
                Loading your subscription...
              </span>
            </div>
          )}

          {plans.map((plan, index) => {
            const features = normalizeFeatures(plan.features);
            const isPopular =
              String(plan.is_popular) === "1" ||
              plan.is_popular === 1 ||
              plan.is_popular === true;

            const purchasedThisCycle = isPurchasedForCurrentCycle(plan.id);
            const expiredThisCycle = purchasedPlans.some(
              (p) =>
                Number(p.id) === Number(plan.id) &&
                normalizePlanType(p.planType) === billingCycle &&
                p.isExpired
            );

            const btn = getPlanButtonConfig(
              plan,
              index,
              purchasedThisCycle,
              expiredThisCycle
            );

            return (
              <div
                key={plan.id}
                className={`relative bg-white rounded-2xl p-8 border-2 flex flex-col justify-between ${
                  purchasedThisCycle
                    ? "border-teal-500 shadow-lg"
                    : "border-gray-200"
                }`}
              >
                {/* MOST POPULAR BADGE */}
                {isPopular && (
                  <div className="absolute -top-5 left-1/2 -translate-x-1/2 z-10">
                    <span className="bg-[#2A57C4] text-white text-sm px-8 py-2.5 rounded-full shadow-md">
                      3 Levels
                    </span>
                  </div>
                )}

                <div>
                  <h3 className="text-2xl font-semibold mb-2">{plan.name}</h3>

                  {plan.title && (
                    <p className="text-gray-500 text-sm mb-6">{plan.title}</p>
                  )}

                  <div className="mb-6">
                    <span className="text-4xl font-bold">
                      {getPrice(plan)}
                    </span>
                    <p className="text-gray-500 text-sm mt-2">
                      {getPeriodText(plan)}
                    </p>
                  </div>

                  <ul className="space-y-3 mb-8">
                    {features.slice(0, 3).map((feature, i) => (
                      <li key={i} className="flex items-start">
                        <img
                          src="/arbutus-web/assets/Levels/correct.png"
                          alt="tick"
                          className="w-4 h-4 mr-3 mt-1"
                        />
                        <span className="text-sm text-gray-600">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <button
                    disabled={btn.disabled}
                    onClick={btn.onClick}
                    className={btn.className}
                  >
                    {btn.label}
                  </button>

                  <p className="text-center text-gray-500 text-sm mt-4">
                    30 days money back guarantee
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-600">
            Facing an issue?{" "}
            <Link to="/Contactmain" className="text-[#2A57C4] underline">
              Contact us
            </Link>
          </p>
        </div>
      </div>

      <LoginAuth isOpen={showLogin} onClose={() => setShowLogin(false)} />
    </div>
  );
}