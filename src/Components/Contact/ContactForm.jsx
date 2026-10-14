import React, { useState } from "react";
import Swal from "sweetalert2";
import { useSendContactFormMutation } from "../../Redux/api/publicApiSlice";

export default function ContactForm() {
  const [sendContactForm, { isLoading }] = useSendContactFormMutation();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    subject: "",
    message: "",
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim())
      newErrors.firstName = "First name is required.";
    if (!formData.lastName.trim())
      newErrors.lastName = "Last name is required.";
    if (!formData.email.trim()) newErrors.email = "Email is required.";
    if (!formData.subject)
      newErrors.subject = "Please select an option.";
    if (!formData.message.trim()) newErrors.message = "Message is required.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => {
        const updated = { ...prev };
        delete updated[name];
        return updated;
      });
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    const payload = {
      fname: formData.firstName,
      lname: formData.lastName,
      mobile: formData.phone,
      email: formData.email,
      subject: formData.subject,
      message: formData.message,
    };

    try {
      await sendContactForm(payload).unwrap();

      Swal.fire({
        icon: "success",
        title: "Message Sent!",
        text: "Thank you for contacting us. Our team will get back to you shortly.",
        confirmButtonColor: "#2A57C4",
      });

      setFormData({
        firstName: "",
        lastName: "",
        phone: "",
        email: "",
        subject: "",
        message: "",
      });
      setErrors({});
    } catch (error) {
      const apiErrors = error?.data?.errors;

      if (apiErrors && typeof apiErrors === "object") {
        const fieldErrors = {};

        const fieldMap = {
          fname: "firstName",
          lname: "lastName",
          mobile: "phone",
          email: "email",
          is_industry_professional: "subject",
          message: "message",
        };

        Object.keys(apiErrors).forEach((field) => {
          const formField = fieldMap[field] || field;
          const message = Array.isArray(apiErrors[field])
            ? apiErrors[field][0]
            : apiErrors[field];

          fieldErrors[formField] = message;
        });

        setErrors((prev) => ({ ...prev, ...fieldErrors }));
      }

      if (!apiErrors || Object.keys(apiErrors).length === 0) {
        Swal.fire({
          icon: "error",
          title: "Failed",
          text:
            error?.data?.message ||
            "Something went wrong. Please check the form and try again.",
          confirmButtonColor: "#2A57C4",
        });
      }
    }
  };

  const wordCount = formData.message
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;

  const inputStyle = (field) =>
    `w-full px-4 py-3 rounded-xl outline-none transition-all text-sm bg-gray-50/50
     ${
       errors[field]
         ? "border border-red-400 ring-2 ring-red-100 bg-red-50/30"
         : "border border-gray-200 focus:border-[#2A57C4] focus:ring-2 focus:ring-[#2A57C4]/20 focus:bg-white"
     }
     placeholder:text-gray-400`;

  return (
    <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-blue-50/30">
      <div className="w-full max-w-6xl bg-white rounded-2xl border border-gray-100 shadow-xl shadow-gray-200/50 p-8 md:p-12">
        {/* Header */}
        <div className="mb-10 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 font-poppins">
            Get in Touch
          </h2>

          <p className="text-xs sm:text-sm text-gray-500 max-w-3xl mx-auto leading-relaxed mt-3 font-poppins">
            Have a question, want to submit an article, or inform us of a
            missing alternative investment fund?
            <br className="hidden sm:block" />
            Fill out the form below and we'll get back to you as soon as
            possible.
          </p>
        </div>

        <div className="space-y-6">
          {/* First Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* First Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                First Name <span className="text-red-500">*</span>
              </label>
              <input
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="Enter first name"
                className={inputStyle("firstName")}
              />
              {errors.firstName && (
                <p className="mt-1.5 text-xs text-red-500 font-medium">
                  {errors.firstName}
                </p>
              )}
            </div>

            {/* Last Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Last Name <span className="text-red-500">*</span>
              </label>
              <input
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Enter last name"
                className={inputStyle("lastName")}
              />
              {errors.lastName && (
                <p className="mt-1.5 text-xs text-red-500 font-medium">
                  {errors.lastName}
                </p>
              )}
            </div>
          </div>

          {/* Second Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Phone (Optional) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <input
                name="phone"
                placeholder="Enter phone number"
                value={formData.phone}
                onChange={handleChange}
                className={inputStyle("phone")}
              />
              {errors.phone && (
                <p className="mt-1.5 text-xs text-red-500 font-medium">
                  {errors.phone}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Email <span className="text-red-500">*</span>
              </label>
              <input
                name="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                className={inputStyle("email")}
              />
              {errors.email && (
                <p className="mt-1.5 text-xs text-red-500 font-medium">
                  {errors.email}
                </p>
              )}
            </div>
          </div>

          {/* Third Row - Industry Professional Dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Are you an industry professional?{" "}
              <span className="text-red-500">*</span>
            </label>
            <select
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              className={`${inputStyle(
                "subject"
              )} cursor-pointer appearance-none bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 fill=%22none%22 viewBox=%220 0 24 24%22 stroke=%22%236b7280%22 stroke-width=%222%22><path stroke-linecap=%22round%22 stroke-linejoin=%22round%22 d=%22M19 9l-7 7-7-7%22/></svg>')] bg-[length:18px] bg-[right_1rem_center] bg-no-repeat pr-10 ${
                formData.subject === ""
                  ? "text-gray-400"
                  : "text-gray-800"
              }`}
            >
              <option value="" disabled>
                Select an option
              </option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
            {errors.subject && (
              <p className="mt-1.5 text-xs text-red-500 font-medium">
                {errors.subject}
              </p>
            )}
          </div>

          {/* Message */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
            How can we help?<span className="text-red-500">*</span>
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

            {/* Counter */}
            <div className="flex justify-end mt-1.5">
              <span className="text-xs text-gray-400 font-medium">
                {wordCount}/100 Words
              </span>
            </div>

            {errors.message && (
              <p className="mt-1.5 text-xs text-red-500 font-medium">
                {errors.message}
              </p>
            )}
          </div>

          {/* Submit */}
          <div>
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full md:w-auto px-10 py-3.5 bg-[#2A57C4] hover:bg-[#1e46a8] text-white cursor-pointer rounded-xl font-medium text-sm tracking-wide transition-all duration-200 shadow-lg shadow-[#2A57C4]/25 hover:shadow-[#2A57C4]/40 disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.98]"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg
                    className="animate-spin h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  Submitting...
                </span>
              ) : (
                "Submit"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}