"use client";

import PageLayout from "@/components/layout/PageLayout";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import Button from "@/components/ui/Button";
import { useState, type ChangeEvent } from "react";

export default function NewCaseStudyPage() {
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    client: "",
    duration: "",
    role: "",
    category: "Mobile",
    tags: "",
    startDate: "",
    endDate: "",
    description: "",
    challenges: "",
    solutions: "",
    outcomes: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSubmitting(false);
    console.log("Form submitted:", formData);
  };

  return (
    <PageLayout title="New Case Study" subtitle="Create a detailed case study">
      <div className="max-w-3xl mx-auto">
        <Card>
          <form onSubmit={handleSubmit} className="p-6 space-y-8">
            <section className="space-y-4">
              <Input
                label="Project Title"
                placeholder="e.g., E-commerce Mobile App Redesign"
                value={formData.title}
                onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange("title", e.target.value)}
              />
              <Input
                label="Project Subtitle"
                placeholder="Brief description highlighting the key result"
                value={formData.subtitle}
                onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange("subtitle", e.target.value)}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Client / Company"
                  placeholder="Client name"
                  value={formData.client}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange("client", e.target.value)}
                />
                <Input
                  label="Duration"
                  placeholder="e.g., 3 months"
                  value={formData.duration}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange("duration", e.target.value)}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Your Role"
                  placeholder="e.g., Lead UX Designer"
                  value={formData.role}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange("role", e.target.value)}
                />
                <Input
                  label="Category"
                  as="select"
                  value={formData.category}
                  onChange={(e: ChangeEvent<HTMLSelectElement>) => handleChange("category", e.target.value)}
                >
                  <option value="Mobile">Mobile</option>
                  <option value="Web">Web</option>
                  <option value="Design System">Design System</option>
                  <option value="Research">Research</option>
                </Input>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Project Timeline</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Start Date"
                  type="date"
                  value={formData.startDate}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange("startDate", e.target.value)}
                />
                <Input
                  label="End Date"
                  type="date"
                  value={formData.endDate}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange("endDate", e.target.value)}
                />
              </div>
            </section>

            <section className="space-y-4">
              <Textarea
                label="Project Description"
                placeholder="Provide context about the project, the problem you were solving, and the goals..."
                rows={5}
                value={formData.description}
                onChange={(e: ChangeEvent<HTMLTextAreaElement>) => handleChange("description", e.target.value)}
              />
            </section>

            <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Textarea
                label="Challenges"
                placeholder="List the main challenges, comma separated"
                rows={3}
                value={formData.challenges}
                onChange={(e: ChangeEvent<HTMLTextAreaElement>) => handleChange("challenges", e.target.value)}
              />
              <Textarea
                label="Solutions"
                placeholder="List your solutions, comma separated"
                rows={3}
                value={formData.solutions}
                onChange={(e: ChangeEvent<HTMLTextAreaElement>) => handleChange("solutions", e.target.value)}
              />
            </section>

            <Textarea
              label="Key Outcomes"
              placeholder="List measurable results and impact, comma separated"
              rows={3}
              value={formData.outcomes}
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) => handleChange("outcomes", e.target.value)}
            />

            <Input
              label="Skills & Tags"
              placeholder="UX Research, Mobile Design, Prototyping, etc."
              value={formData.tags}
              onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange("tags", e.target.value)}
            />

            <div className="flex gap-4 pt-4 border-t border-slate-200 dark:border-slate-700">
              <Button type="submit" isLoading={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save Case Study"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => window.history.back()}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Card>

        <div className="mt-8 p-6 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
          <h3 className="font-semibold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
            <svg className="w-5 h-5 text-slate-600 dark:text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Tips for Great Case Studies
          </h3>
          <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-1 ml-7">
            <li>• Focus on the problem and your role in solving it</li>
            <li>• Use specific metrics and data to demonstrate impact</li>
            <li>• Include visuals (mockups, screenshots) in your final case study</li>
            <li>• Tell a story: challenge, process, solution, results</li>
            <li>• Be concise but provide enough detail for context</li>
          </ul>
        </div>
      </div>
    </PageLayout>
  );
}
