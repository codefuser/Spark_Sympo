"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contactSchema } from "@/lib/validations/schemas";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { MapPin, Mail, Phone, Clock, Send, CheckCircle2 } from "lucide-react";

export default function ContactPage() {
  const { showToast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: any) => {
    setSubmitting(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();
      if (res.ok && result.success) {
        setSentSuccess(true);
        showToast("Message Sent!", "We will respond shortly.", "success");
        reset();
      } else {
        showToast("Error", result.message || "Failed to send message", "error");
      }
    } catch (err) {
      showToast("Network Error", "Unable to submit message", "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 py-12 space-y-12 max-w-5xl">
      <SectionHeading
        badge="GET IN TOUCH"
        title="Contact SPARKTRON Organizing Desk"
        description="Have questions regarding event rules, bus routes, registration fees, or accommodation? Drop us a message below."
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left: Contact Info */}
        <div className="space-y-6">
          <Card className="space-y-6">
            <h3 className="text-xl font-bold text-white font-mono">Symposium Help Desk</h3>

            <div className="space-y-4 text-sm font-mono">
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="text-white font-bold">Venue Address</p>
                  <p className="text-slate-400 text-xs mt-0.5">
                    Department of ECE, St. Joseph's Institute of Technology, OMR, Chennai - 600119, Tamil Nadu.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Mail className="w-5 h-5 text-cyan shrink-0 mt-0.5" />
                <div>
                  <p className="text-white font-bold">Official Email</p>
                  <p className="text-slate-400 text-xs mt-0.5">sparktron2026@college.edu</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Phone className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-white font-bold">Helpline Numbers</p>
                  <p className="text-slate-400 text-xs mt-0.5">
                    +91 98401 23456 (Convener) <br />
                    +91 98765 43210 (Student President)
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Clock className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-white font-bold">Desk Timings</p>
                  <p className="text-slate-400 text-xs mt-0.5">Mon - Sat: 08:30 AM to 05:00 PM</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Map Preview Box */}
          <div className="rounded-xl border border-primary/20 bg-card/60 p-4 text-xs font-mono text-slate-400 text-center space-y-2">
            <p className="text-white font-bold">College Campus Location Map</p>
            <p>Situated on the Old Mahabalipuram Road (OMR) IT Corridor, Chennai.</p>
          </div>
        </div>

        {/* Right: Message Form */}
        <Card className="p-6 sm:p-8 space-y-6">
          <h3 className="text-xl font-bold text-white font-mono">Send an Inquiry Message</h3>

          {sentSuccess ? (
            <div className="p-6 text-center space-y-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl">
              <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
              <h4 className="text-lg font-bold text-white">Thank You!</h4>
              <p className="text-xs text-slate-300">
                Your message has been logged into our database. Our student coordinators will contact you via email soon.
              </p>
              <Button size="sm" variant="outline" onClick={() => setSentSuccess(false)}>
                Send Another Message
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Input
                label="Your Name *"
                placeholder="Full Name"
                {...register("name")}
                error={errors.name?.message as string}
              />
              <Input
                label="Email Address *"
                type="email"
                placeholder="Email Address"
                {...register("email")}
                error={errors.email?.message as string}
              />
              <Input
                label="Subject *"
                placeholder="e.g. Accommodation query or Paper submission"
                {...register("subject")}
                error={errors.subject?.message as string}
              />

              <div className="space-y-1.5">
                <label className="block text-xs font-mono font-medium text-secondary-foreground tracking-wider uppercase">
                  Message Details *
                </label>
                <textarea
                  rows={4}
                  className="w-full rounded-lg bg-background border border-primary/20 px-3.5 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200"
                  placeholder="Type your question or query here..."
                  {...register("message")}
                />
                {errors.message && (
                  <p className="text-xs text-destructive font-mono">{errors.message.message as string}</p>
                )}
              </div>

              <Button
                type="submit"
                variant="primary"
                className="w-full"
                isLoading={submitting}
                rightIcon={<Send className="w-4 h-4" />}
              >
                Submit Message
              </Button>
            </form>
          )}
        </Card>
      </div>
    </div>
  );
}
