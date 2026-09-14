import React, { useState } from "react";
import Swal from "sweetalert2";
import { useSendContactFormMutation } from "../../Redux/api/publicApiSlice";

export default function ContactForm() {
  const [sendContactForm, { isLoading }] =
    useSendContactFormMutation();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    topic: "",
    phone: "",
    subject: "",
    email: "",
    message: "",
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName) newErrors.firstName = true;
    if (!formData.lastName) newErrors.lastName = true;
    if (!formData.topic) newErrors.topic = true;
    if (!formData.phone) newErrors.phone = true;
    if (!formData.subject) newErrors.subject = true;
    if (!formData.email) newErrors.email = true;
    if (!formData.message) newErrors.message = true;

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: false }));
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    const payload = {
      fname: formData.firstName,
      lname: formData.lastName,
      topic: formData.topic,
      mobile: formData.phone,
      subject: formData.subject,
      email: formData.email,
      message: formData.message,
    };

    try {
      await sendContactForm(payload).unwrap();

      Swal.fire({
        icon: "success",
        title: "Message Sent!",
        text: "Thank you for contacting us. Our team will get back to you shortly.",
      });

      // reset
      setFormData({
        firstName: "",
        lastName: "",
        topic: "",
        phone: "",
        subject: "",
        email: "",
        message: "",
      });
      setErrors({});
    } catch (error) {
      Swal.fire(
        "Failed",
        error?.data?.message || "Something went wrong.",
        "error"
      );
    }
  };

  const wordCount = formData.message
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;

  const inputStyle = (field) =>
    `w-full px-4 py-3  border border-[#A4A4A4] rounded-lg outline-none transition-all text-sm
     ${errors[field] ? "border-red-500 ring-1 ring-red-500" : "border-[#A4A4A4] focus:ring-2 focus:ring-blue-500"}
     `;

  const selectBgStyle = {
    backgroundImage: `url("/arbutus-web/assets/Contact/arrow-down.png")`,
    backgroundRepeat: "no-repeat",
    backgroundPosition: "right 0.75rem center",
    backgroundSize: "1em 1em",
    paddingRight: "2.5rem",
    appearance: "none",
  };

  return (
    <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-6xl bg-white rounded-lg border border-[#9F9F9F] p-8 md:p-12">
        <div className="space-y-6">
          {/* First Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* First Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                First Name<span className="text-red-500"> *</span>
              </label>
              <input
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="Enter first name"
                className={inputStyle("firstName")}
              />
            </div>

            {/* Last Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Last Name<span className="text-red-500"> *</span>
              </label>
              <input
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Enter last name"
                className={inputStyle("lastName")}
              />
            </div>

            {/* Topic */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Topic<span className="text-red-500"> *</span>
              </label>
              <select
                name="topic"
                value={formData.topic}
                onChange={handleChange}
                className={inputStyle("topic")}
                style={selectBgStyle}
              >
                <option value="">Choose one</option>
                <option value="general">General Inquiry</option>
                <option value="support">Support</option>
                <option value="sales">Sales</option>
                <option value="partnership">Partnership</option>
              </select>
            </div>
          </div>

          {/* Second Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number<span className="text-red-500"> *</span>
              </label>
              <input
                name="phone"
                placeholder="e.g. +1234567890"
                value={formData.phone}
                onChange={handleChange}
                className={inputStyle("phone")}
              />
            </div>

            {/* Subject */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subject<span className="text-red-500"> *</span>
              </label>
              <select
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                className={inputStyle("subject")}
                style={selectBgStyle}
              >
                <option value="">Choose subject</option>
                <option value="product">Product Question</option>
                <option value="technical">Technical Issue</option>
                <option value="billing">Billing</option>
                <option value="feedback">Feedback</option>
              </select>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Email ID<span className="text-red-500"> *</span>
              </label>
              <input
                name="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                className={inputStyle("email")}
              />
            </div>
          </div>

          {/* Message */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Please tell us about your brand
              <span className="text-red-500"> *</span>
            </label>

            <div className="relative">
              <textarea
                name="message"
                rows="6"
                value={formData.message}
                onChange={handleChange}
                placeholder="Type your message here..."
                maxLength={900}
                className={`${inputStyle("message")} resize-none`}
              />
            </div>

            {/*  Counter OUTSIDE & right aligned */}
            <div className="flex justify-end mt-1">
              <span className="text-xs text-[#4A4A4A] roboto-medium">
                {wordCount}/100 Words
              </span>
            </div>
          </div>


          {/* Submit */}
          <div>
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="px-10 py-2.5 bg-[#2A57C4] text-white cursor-pointer rounded-full font-roboto disabled:opacity-60"
            >
              {isLoading ? "Submitting..." : "Submit"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
