"use client";

import PageLayout from "@/components/layout/PageLayout";
import Button from "@/components/ui/Button";
import { useState, type FormEvent, type ChangeEvent } from "react";

// Simple math CAPTCHA generator
function generateQuestion() {
  const a = Math.floor(Math.random() * 10) + 1;
  const b = Math.floor(Math.random() * 10) + 1;
  return { a, b, answer: String(a + b) };
}

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [captcha, setCaptcha] = useState(generateQuestion());
  const [captchaAnswer, setCaptchaAnswer] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(formData.email)) newErrors.email = "Please enter a valid email";
    if (!formData.message.trim()) newErrors.message = "Message is required";
    else if (formData.message.trim().length < 10) newErrors.message = "Message must be at least 10 characters";
    if (captchaAnswer.trim() !== captcha.answer) newErrors.captcha = "Incorrect answer, please try again";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error();
      setIsSubmitted(true);
      setFormData({ name: '', email: '', message: '' });
      setCaptchaAnswer('');
      setCaptcha(generateQuestion());
    } catch {
      alert('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageLayout title="Contact" subtitle="Let&apos;s work together">
      {isSubmitted ? (
        <div className="max-w-xl -mt-32 md:-mt-40">
          <div className="text-center py-16">
            <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-4">Message Sent!</h2>
            <p className="text-muted mb-6">Thanks for reaching out. I&apos;ll get back to you as soon as possible.</p>
            <Button onClick={() => setIsSubmitted(false)}>Send Another Message</Button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="max-w-xl -mt-16 md:-mt-24">
          <div className="space-y-8">
            {/* Name */}
            <div>
              <label className="block text-sm text-muted mb-2">Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange("name", e.target.value)}
                placeholder="Your name"
                className="w-full rounded-lg bg-surface border border-border px-4 py-3 text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              />
              {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm text-muted mb-2">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange("email", e.target.value)}
                placeholder="your@email.com"
                className="w-full rounded-lg bg-surface border border-border px-4 py-3 text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              />
              {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
            </div>

            {/* Message */}
            <div>
              <label className="block text-sm text-muted mb-2">Message</label>
              <textarea
                rows={5}
                value={formData.message}
                onChange={(e: ChangeEvent<HTMLTextAreaElement>) => handleChange("message", e.target.value)}
                placeholder="Tell me about your project or inquiry…"
                className="w-full rounded-lg bg-surface border border-border px-4 py-3 text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-indigo-500 transition resize-none"
              />
              {errors.message && <p className="mt-1 text-xs text-red-500">{errors.message}</p>}
            </div>

            {/* Math CAPTCHA */}
            <div>
              <label className="block text-sm text-muted mb-2">
                What is <span className="text-foreground font-medium">{captcha.a} + {captcha.b}</span>?
              </label>
              <input
                type="text"
                value={captchaAnswer}
                onChange={(e) => { setCaptchaAnswer(e.target.value); if (errors.captcha) setErrors((prev) => ({ ...prev, captcha: "" })); }}
                placeholder="Type the answer"
                className="w-32 rounded-lg bg-surface border border-border px-4 py-3 text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              />
              {errors.captcha && <p className="mt-1 text-xs text-red-500">{errors.captcha}</p>}
            </div>

            {/* Submit */}
            <Button type="submit" isLoading={isSubmitting} className="w-full">
              Send Message
            </Button>
          </div>
        </form>
      )}
    </PageLayout>
  );
}
