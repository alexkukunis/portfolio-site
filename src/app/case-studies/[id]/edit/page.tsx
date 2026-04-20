"use client";

import PageLayout from "@/components/layout/PageLayout";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import Button from "@/components/ui/Button";
import { useState } from "react";

export default function EditCaseStudyPage() {
  const [formData, setFormData] = useState({
    title: "E-commerce Mobile App Redesign",
    subtitle: "A comprehensive redesign of a fashion retail app resulting in 35% increase in conversions",
    client: "FashionRetail Co.",
    duration: "3 months",
    role: "Lead UX/UI Designer",
    category: "Mobile",
    tags: "UX Research, Mobile Design, E-commerce, Prototyping, User Testing",
    startDate: "2024-01-01",
    endDate: "2024-03-31",
    description:
      "This project involved a complete redesign of a fashion retail mobile application used by over 500,000 monthly active users. The goal was to modernize the user experience, improve conversion metrics, and establish a scalable design system.",
    challenges: "Low conversion rate on checkout flow (12%); High cart abandonment rate (68%); Outdated design system inconsistent with brand;",
    solutions: "Conducted 30+ user interviews to identify pain points; Redesigned checkout flow with progress indicators; Implemented new design system with reusable components;",
    outcomes: "35% increase in conversion rate; Reduced cart abandonment to 45%; 4.8/5 app store rating; 2x improvement in task completion time;",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setIsSubmitting(false);
    console.log("Form updated:", formData);
  };

  return (
    <PageLayout
      title="Edit Case Study"
      subtitle="Update your case study details"
    >
      <div className="max-w-3xl mx-auto">
        <Card>
          <form onSubmit={handleSubmit} className="p-6 space-y-8">
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Project Title"
                value={formData.title}
                onChange={(e) => handleChange("title", e.target.value)}
              />
              <Input
                label="Category"
                as="select"
                value={formData.category}
                onChange={(e) => handleChange("category", e.target.value)}
              >
                <option value="Mobile">Mobile</option>
                <option value="Web">Web</option>
                <option value="Design System">Design System</option>
                <option value="Research">Research</option>
              </Input>
            </div>
            <Input
              label="Subtitle"
              value={formData.subtitle}
              onChange={(e) => handleChange("subtitle", e.target.value)}
            />

            {/* Project Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Client"
                value={formData.client}
                onChange={(e) => handleChange("client", e.target.value)}
              />
              <Input
                label="Your Role"
                value={formData.role}
                onChange={(e) => handleChange("role", e.target.value)}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Duration"
                value={formData.duration}
                onChange={(e) => handleChange("duration", e.target.value)}
              />
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Start Date"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => handleChange("startDate", e.target.value)}
                />
                <Input
                  label="End Date"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => handleChange("endDate", e.target.value)}
                />
              </div>
            </div>

            {/* Content */}
            <Textarea
              label="Tags (comma separated)"
              value={formData.tags}
              onChange={(e) => handleChange("tags", e.target.value)}
            />
            <Textarea
              label="Project Description"
              rows={4}
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
            />

            {/* Challenges, Solutions, Outcomes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Textarea
                label="Challenges"
                rows={3}
                value={formData.challenges}
                onChange={(e) => handleChange("challenges", e.target.value)}
              />
              <Textarea
                label="Solutions"
                rows={3}
                value={formData.solutions}
                onChange={(e) => handleChange("solutions", e.target.value)}
              />
            </div>
            <Textarea
              label="Outcomes"
              rows={3}
              value={formData.outcomes}
              onChange={(e) => handleChange("outcomes", e.target.value)}
            />

            {/* Actions */}
            <div className="flex gap-4">
              <Button type="submit" isLoading={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save Changes"}
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
      </div>
    </PageLayout>
  );
}
