"use client";

import PageLayout from "@/components/layout/PageLayout";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import Button from "@/components/ui/Button";
import { useState, type ChangeEvent } from "react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }
    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    } else if (formData.message.trim().length < 10) {
      newErrors.message = "Message must be at least 10 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setIsSubmitted(true);
    setFormData({ name: "", email: "", subject: "", message: "" });
    setTimeout(() => setIsSubmitted(false), 5000);
  };

  if (isSubmitted) {
    return (
      <PageLayout title="Contact" subtitle="Get in touch">
        <div className="max-w-xl mx-auto">
          <Card className="p-12 text-center">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Message Sent!</h2>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              Thanks for reaching out. I&apos;ll get back to you as soon as possible.
            </p>
            <Button onClick={() => setIsSubmitted(false)}>Send Another Message</Button>
          </Card>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout title="Contact" subtitle="Let&apos;s create something amazing together">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contact Info */}
          <div className="space-y-8">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
                Let&apos;s connect
              </h2>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                I&apos;m always open to discussing new projects, creative ideas,
                or opportunities to collaborate. Whether you have a question or just want to say hi,
                I&apos;ll try my best to get back to you!
              </p>
            </div>

            {/* Contact Cards */}
            <div className="space-y-3">
              <Card className="p-4 flex items-center group hover:border-slate-300 dark:hover:border-slate-600 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mr-4">
                  <svg className="w-5 h-5 text-slate-700 dark:text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide">Email</p>
                  <a href="mailto:hello@portfolio.com" className="font-medium text-slate-900 dark:text-white">
                    hello@portfolio.com
                  </a>
                </div>
              </Card>

              <Card className="p-4 flex items-center">
                <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mr-4">
                  <svg className="w-5 h-5 text-slate-700 dark:text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide">Location</p>
                  <p className="font-medium text-slate-900 dark:text-white">San Francisco, CA</p>
                </div>
              </Card>

              <Card className="p-4 flex items-center">
                <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mr-4">
                  <svg className="w-5 h-5 text-slate-700 dark:text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide">Availability</p>
                  <p className="font-medium text-green-600 dark:text-green-400">Open for projects</p>
                </div>
              </Card>
            </div>

            {/* Social Links */}
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Follow</h3>
              <div className="flex gap-3">
                {[
                  { name: "LinkedIn", icon: "M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6z" },
                  { name: "GitHub", icon: "M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22" },
                  { name: "Dribbble", icon: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c5.51 0 10-4.48 10-10S17.51 2 12 2zm6.605 4.61a8.502 8.502 0 011.93 5.314c-.281-.054-3.101-.629-5.943-.271-.065-.141-.12-.293-.184-.445" },
                ].map((social) => (
                  <a
                    key={social.name}
                    href="#"
                    className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center hover:bg-slate-900 dark:hover:bg-white hover:text-white dark:hover:text-slate-900 transition-all"
                    aria-label={social.name}
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d={social.icon} />
                    </svg>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <Card className="p-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Name"
                  placeholder="Your name"
                  value={formData.name}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange("name", e.target.value)}
                  error={errors.name}
                />
                <Input
                  label="Email"
                  type="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange("email", e.target.value)}
                  error={errors.email}
                />
              </div>
              <Input
                label="Subject"
                placeholder="How can I help?"
                value={formData.subject}
                onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange("subject", e.target.value)}
              />
              <Textarea
                label="Message"
                placeholder="Tell me about your project or inquiry..."
                rows={5}
                value={formData.message}
                onChange={(e: ChangeEvent<HTMLTextAreaElement>) => handleChange("message", e.target.value)}
                error={errors.message}
              />
              <Button type="submit" isLoading={isSubmitting} className="w-full">
                Send Message
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </PageLayout>
  );
}
