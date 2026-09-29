import React, { useState } from "react";
import Swal from "sweetalert2";
import { useSendContactFormMutation } from "../../Redux/api/publicApiSlice";

export default function ContactForm() {
  const [sendContactForm, { isLoading }] = useSendContactFormMutation();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    subject: "",
    email: "",
    message: "",
  });

  // errors will now store the message string instead of boolean
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim())
      newErrors.firstName = "First name is required.";
    if (!formData.lastName.trim())
      newErrors.lastName = "Last name is required.";
    if (!formData.subject) newErrors.subject = "Please choose a subject.";
    if (!formData.email.trim()) newErrors.email = "Email is required.";
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
    // Frontend validation first
    if (!validateForm()) return;

    const payload = {
      fname: formData.firstName,
      lname: formData.lastName,
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
        confirmButtonColor: "#2A57C4",
      });

      // reset
      setFormData({
        firstName: "",
        lastName: "",
        phone: "",
        subject: "",
        email: "",
        message: "",
      });
      setErrors({});
    } catch (error) {
      const apiErrors = error?.data?.errors;

      if (apiErrors && typeof apiErrors === "object") {
        const fieldErrors = {};

        // Map API field names -> form field names
        const fieldMap = {
          fname: "firstName",
          lname: "lastName",
          mobile: "phone",
          topic: "topic",
          subject: "subject",
          email: "email",
          message: "message",
        };

        Object.keys(apiErrors).forEach((field) => {
          const formField = fieldMap[field] || field;

          // Grab the first message from the array
          const message = Array.isArray(apiErrors[field])
            ? apiErrors[field][0]
            : apiErrors[field];

          fieldErrors[formField] = message;
        });

        setErrors((prev) => ({ ...prev, ...fieldErrors }));
      }

      // Only show a generic SweetAlert if there are NO field-level errors
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

  const selectBgStyle = {
    backgroundImage: `url("/arbutus-web/assets/Contact/arrow-down.png")`,
    backgroundRepeat: "no-repeat",
    backgroundPosition: "right 0.75rem center",
    backgroundSize: "1em 1em",
    paddingRight: "2.5rem",
    appearance: "none",
  };

  return (
    <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-blue-50/30">
      <div className="w-full max-w-6xl bg-white rounded-2xl border border-gray-100 shadow-xl shadow-gray-200/50 p-8 md:p-12">
        {/* Header */}
        <div className="mb-10 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3 font-roboto">
            Get in Touch
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 whitespace-nowrap overflow-hidden text-ellipsis">
            Have a question or want to work together? Fill out the form below and
            we'll get back to you as soon as possible.
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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

            {/* Subject */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subject <span className="text-red-500">*</span>
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
              {errors.subject && (
                <p className="mt-1.5 text-xs text-red-500 font-medium">
                  {errors.subject}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Email ID <span className="text-red-500">*</span>
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

          {/* Message */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Please tell us about your brand{" "}
              <span className="text-red-500">*</span>
            </label>

            <div className="relative">
              <textarea
                name="message"
                rows="6"
                value={formData.message}
                onChange={handleChange}
                placeholder="Write your message here..."
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