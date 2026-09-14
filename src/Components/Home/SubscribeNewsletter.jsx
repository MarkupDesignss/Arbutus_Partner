import React, { useState } from "react";
import Swal from "sweetalert2";
import { useSendSubscribeMutation } from "../../Redux/api/publicApiSlice";

export default function SubscribeNewsletter() {
  const [sendSubscribe, { isLoading }] = useSendSubscribeMutation();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubscribe = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.name || !formData.email) {
      Swal.fire("Error", "Please enter your name and email", "error");
      return;
    }

    if (!emailRegex.test(formData.email)) {
      Swal.fire("Error", "Please enter a valid email address", "error");
      return;
    }

    try {
      await sendSubscribe({
        name: formData.name,
        email: formData.email,
      }).unwrap();

      Swal.fire({
        icon: "success",
        title: "Subscribed!",
        text: "You have successfully subscribed to our newsletter.",
        confirmButtonColor: "#2A57C4",
      });

      setFormData({ name: "", email: "" });
    } catch (error) {
      Swal.fire(
        "Failed",
        error?.data?.message || "Subscription failed. Please try again.",
        "error"
      );
    }
  };

  return (
    <div className="w-full bg-gradient-to-br from-[#EFF4FF] via-[#f8faff] to-[#EFF4FF] mt-10 py-12 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-200/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4"></div>
      
      <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-10 lg:gap-16">

          {/* LEFT SECTION - Enhanced */}
          <div className="text-center lg:text-left">
            {/* Badge */}
            <div className="inline-block bg-[#2A57C4]/10 text-[#2A57C4] text-xs font-semibold px-4 py-1.5 rounded-full mb-4">
              📬 Newsletter
            </div>
            
            <h2 className="text-3xl sm:text-4xl font-bold leading-snug text-gray-800">
              Subscribe For Updates & <br className="hidden lg:block" />
              <span className="text-[#2A57C4]">Periodic Newsletter</span>
            </h2>

            <p className="text-sm text-gray-500 mt-3">
              ✨ (Will Provide A Zoho Crm Campaigns Code Link)
            </p>

            <div className="mt-8 space-y-4 max-w-md mx-auto lg:mx-0">

              {/* Name Input - Enhanced */}
              <div className="relative group">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your Name"
                  className="w-full h-12 px-4 pr-10 text-gray-700 bg-white/80 backdrop-blur-sm rounded-xl border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2A57C4] focus:border-transparent transition-all duration-300 placeholder-gray-400 shadow-sm hover:shadow-md"
                />
                {!formData.name && (
                  <span className="absolute text-red-500 pointer-events-none" style={{ top: "50%", right: "14px", transform: "translateY(-50%)" }}>
                    *
                  </span>
                )}
              </div>

              {/* Email Input - Enhanced */}
              <div className="relative group">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Your Email ID"
                  className="w-full h-12 px-4 pr-10 text-gray-700 bg-white/80 backdrop-blur-sm rounded-xl border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2A57C4] focus:border-transparent transition-all duration-300 placeholder-gray-400 shadow-sm hover:shadow-md"
                />
                {!formData.email && (
                  <span className="absolute text-red-500 pointer-events-none" style={{ top: "50%", right: "14px", transform: "translateY(-50%)" }}>
                    *
                  </span>
                )}
              </div>

              {/* Subscribe Button - Enhanced */}
              <button
                onClick={handleSubscribe}
                disabled={isLoading}
                className="w-full sm:w-auto px-8 h-12 bg-gradient-to-r from-[#2A57C4] to-[#1a3f8a] text-white rounded-xl font-semibold hover:shadow-lg hover:scale-[1.02] transition-all duration-300 disabled:opacity-60 disabled:hover:scale-100 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Subscribing...
                  </>
                ) : (
                  <>
                    Subscribe Now
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </>
                )}
              </button>
            
            </div>
          </div>

          {/* RIGHT SECTION - Enhanced Image */}
          <div className="relative flex justify-center lg:justify-end mt-6 lg:mt-0 lg:-my-20 lg:-top-8">
            <div className="relative group">
          
              {/* Image with Shadow and Border */}
              <div className="relative ">
                <img
                  src="/arbutus-web/assets/Home/SubscribeNewsletter/SubscribeNewsletter.png"
                  alt="Subscribe Newsletter"
                  className="w-full max-w-sm sm:max-w-md lg:max-w-xl h-auto object-contain rounded-2xl transform group-hover:scale-[1.02] transition-transform duration-500"
                />
              </div>
              
              {/* Floating Badge */}
              <div className="absolute -top-4 -right-4 bg-white rounded-full shadow-lg px-4 py-2 flex items-center gap-2 animate-bounce-slow">
                <span className="text-green-500 text-xl">✓</span>
                <span className="text-xs font-semibold text-gray-700">Trusted</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}