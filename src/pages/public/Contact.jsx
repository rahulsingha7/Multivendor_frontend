import React, { useState } from "react";
import toast from "react-hot-toast";
import { motion as Motion } from "framer-motion";
import {
  FiUser,
  FiMail,
  FiMessageCircle,
  FiSend,
  FiClock,
} from "react-icons/fi";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [sending, setSending] = useState(false);

  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    setSending(true);
    setTimeout(() => {
      toast.success("Message sent! We'll get back to you soon.");
      setFormData({ name: "", email: "", message: "" });
      setSending(false);
    }, 800);
  };

  return (
    <section className="py-20 sm:py-24 px-4 sm:px-10 lg:px-16 bg-base-100">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        {/* Left: copy */}
        <Motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-orange-600 dark:text-orange-400 text-sm uppercase tracking-[0.3em] font-semibold mb-3">
            Get in touch
          </p>
          <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-semibold text-ink dark:text-base-content mb-5 leading-tight">
            We'd love to
            <br />
            hear from you
          </h2>
          <p className="text-base-content/60 mb-8 text-lg">
            Have a question, feedback, or just want to say hello? Drop us a
            message and our team will get back to you within 24 hours.
          </p>

          {/* Contact highlights */}
          <div className="space-y-4">
            {[
              {
                icon: FiMail,
                title: "Email",
                value: "support@multivendor.shop",
              },
              {
                icon: FiClock,
                title: "Response time",
                value: "Within 24 hours",
              },
              {
                icon: FiMessageCircle,
                title: "Live chat",
                value: "Available 9am–6pm",
              },
            ].map(({ icon: Icon, title, value }) => (
              <div key={title} className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center shrink-0">
                  <Icon
                    className="text-orange-600 dark:text-orange-400"
                    size={20}
                  />
                </div>
                <div>
                  <p className="text-xs text-base-content/40 font-medium">
                    {title}
                  </p>
                  <p className="text-base font-semibold text-base-content">
                    {value}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Motion.div>

        {/* Right: form */}
        <Motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-base-100 rounded-2xl shadow-sm p-8 sm:p-10 border border-line dark:border-base-300"
        >
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-base-content/50 mb-2">
                Your Name
              </label>
              <div className="flex items-center gap-3 bg-base-200 rounded-xl px-4 py-3.5 border border-transparent focus-within:border-orange-400 transition">
                <FiUser className="text-base-content/40 shrink-0" />
                <input
                  type="text"
                  name="name"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full bg-transparent outline-none text-base text-base-content placeholder-base-content/40"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-base-content/50 mb-2">
                Email Address
              </label>
              <div className="flex items-center gap-3 bg-base-200 rounded-xl px-4 py-3.5 border border-transparent focus-within:border-orange-400 transition">
                <FiMail className="text-base-content/40 shrink-0" />
                <input
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full bg-transparent outline-none text-base text-base-content placeholder-base-content/40"
                />
              </div>
            </div>

            {/* Message */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-base-content/50 mb-2">
                Message
              </label>
              <div className="flex items-start gap-3 bg-base-200 rounded-xl px-4 py-3.5 border border-transparent focus-within:border-orange-400 transition">
                <FiMessageCircle className="text-base-content/40 shrink-0 mt-0.5" />
                <textarea
                  name="message"
                  rows="4"
                  placeholder="Tell us what's on your mind..."
                  value={formData.message}
                  onChange={handleChange}
                  required
                  className="w-full bg-transparent outline-none text-base text-base-content placeholder-base-content/40 resize-none"
                />
              </div>
            </div>

            <Motion.button
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={sending}
              className="w-full py-4 bg-ink dark:bg-base-content text-cream dark:text-base-100 hover:bg-orange-600 dark:hover:bg-orange-500 disabled:opacity-60 font-semibold text-base rounded-full flex items-center justify-center gap-2 transition shadow-sm hover:shadow-lg"
            >
              {sending ? (
                <span className="loading loading-spinner loading-sm" />
              ) : (
                <>
                  <FiSend />
                  Send Message
                </>
              )}
            </Motion.button>
          </form>
        </Motion.div>
      </div>
    </section>
  );
};

export default Contact;
