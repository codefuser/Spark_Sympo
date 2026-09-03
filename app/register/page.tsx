"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registrationSchema } from "@/lib/validations/schemas";
import { z } from "zod";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Card, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { useToast } from "@/components/ui/Toast";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { Cpu, CheckCircle2, UserPlus, Trash2, ShieldCheck, AlertCircle } from "lucide-react";
import { SymposiumEvent } from "@/types";

export const dynamic = "force-dynamic";

type RegistrationFormInputs = z.infer<typeof registrationSchema>;

export default function RegistrationPage() {
  return (
    <Suspense fallback={<LoadingSpinner label="Loading Registration Form..." />}>
      <RegistrationFormContent />
    </Suspense>
  );
}

function RegistrationFormContent() {
  const searchParams = useSearchParams();
  const initialEventId = searchParams.get("eventId") || "";

  const [events, setEvents] = useState<SymposiumEvent[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [successData, setSuccessData] = useState<{
    registrationId: string;
    participantName: string;
    eventTitle: string;
  } | null>(null);

  const { showToast } = useToast();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    control,
    formState: { errors },
  } = useForm<RegistrationFormInputs>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      college: "",
      department: "ECE",
      year: "3rd Year",
      gender: "Male",
      eventId: initialEventId,
      teamName: "",
      teamMembers: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "teamMembers",
  });

  const selectedEventId = watch("eventId");
  const selectedEvent = events.find((e) => e.id === selectedEventId);

  useEffect(() => {
    async function fetchEvents() {
      try {
        const res = await fetch("/api/events?status=OPEN");
        const data = await res.json();
        if (data.success) {
          setEvents(data.events);
          if (!initialEventId && data.events.length > 0) {
            setValue("eventId", data.events[0].id);
          }
        }
      } catch (err) {
        showToast("Failed to load events list", undefined, "error");
      } finally {
        setLoadingEvents(false);
      }
    }
    fetchEvents();
  }, [initialEventId, setValue, showToast]);

  const onSubmit = async (data: any) => {
    setSubmitting(true);
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (res.ok && result.success) {
        setSuccessData({
          registrationId: result.registrationId,
          participantName: result.participantName,
          eventTitle: result.eventTitle,
        });
        showToast("Registration Confirmed!", `ID: ${result.registrationId}`, "success");
      } else {
        showToast("Registration Error", result.message || "Something went wrong", "error");
      }
    } catch (err) {
      showToast("Network Error", "Unable to connect to server", "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 py-12 space-y-12 max-w-4xl">
      <SectionHeading
        badge="ONLINE REGISTRATION"
        title="SPARKTRON 2K26 Registration Portal"
        description="Fill out the registration form below. Duplicate entries for the same event are automatically detected."
      />

      <Card className="p-6 sm:p-10">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* 1. Select Event */}
          <div className="space-y-3 pb-6 border-b border-primary/10">
            <h3 className="text-lg font-bold text-white flex items-center gap-2 font-mono">
              <Cpu className="w-5 h-5 text-primary" /> 1. Select Event Track
            </h3>
            {loadingEvents ? (
              <p className="text-xs font-mono text-slate-400">Loading open events...</p>
            ) : (
              <Select
                label="Event Name"
                options={events.map((e) => ({
                  label: `${e.title} (${e.category} • ${e.teamSize})`,
                  value: e.id,
                }))}
                {...register("eventId")}
                error={errors.eventId?.message}
              />
            )}
            {selectedEvent && (
              <div className="p-3 rounded-lg bg-card/80 border border-primary/20 text-xs font-mono text-slate-300 flex flex-wrap justify-between gap-2">
                <span>Rounds: {selectedEvent.rounds}</span>
                <span>Venue: {selectedEvent.venue}</span>
                <span>Team Size: {selectedEvent.teamSize}</span>
              </div>
            )}
          </div>

          {/* 2. Primary Participant Details */}
          <div className="space-y-4 pb-6 border-b border-primary/10">
            <h3 className="text-lg font-bold text-white flex items-center gap-2 font-mono">
              <ShieldCheck className="w-5 h-5 text-cyan" /> 2. Participant Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Full Name *"
                placeholder="e.g. Rahul Sharma"
                {...register("name")}
                error={errors.name?.message}
              />
              <Input
                label="Email Address *"
                type="email"
                placeholder="e.g. rahul@student.edu"
                {...register("email")}
                error={errors.email?.message}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Mobile Phone Number *"
                placeholder="e.g. 9876543210"
                {...register("phone")}
                error={errors.phone?.message}
              />
              <Input
                label="College / Institution *"
                placeholder="e.g. SRM Institute of Technology"
                {...register("college")}
                error={errors.college?.message}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Select
                label="Department"
                options={[
                  { label: "ECE", value: "ECE" },
                  { label: "EEE", value: "EEE" },
                  { label: "EIE", value: "EIE" },
                  { label: "CSE", value: "CSE" },
                  { label: "IT", value: "IT" },
                  { label: "Mechanical", value: "Mechanical" },
                  { label: "Other", value: "Other" },
                ]}
                {...register("department")}
              />
              <Select
                label="Year of Study"
                options={[
                  { label: "1st Year", value: "1st Year" },
                  { label: "2nd Year", value: "2nd Year" },
                  { label: "3rd Year", value: "3rd Year" },
                  { label: "4th Year / Final", value: "4th Year" },
                  { label: "PG / Diploma", value: "PG/Diploma" },
                ]}
                {...register("year")}
              />
              <Select
                label="Gender"
                options={[
                  { label: "Male", value: "Male" },
                  { label: "Female", value: "Female" },
                  { label: "Prefer not to say", value: "Other" },
                ]}
                {...register("gender")}
              />
            </div>
          </div>

          {/* 3. Team Details (If team size permits) */}
          {selectedEvent && selectedEvent.teamSize !== "Individual" && (
            <div className="space-y-4 pb-6 border-b border-primary/10">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-white font-mono">
                  3. Team Information & Additional Members
                </h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  leftIcon={<UserPlus className="w-4 h-4" />}
                  onClick={() => append({ name: "", email: "", phone: "" })}
                >
                  Add Member
                </Button>
              </div>

              <Input
                label="Team Name (Optional)"
                placeholder="e.g. CyberCircuits Alpha"
                {...register("teamName")}
              />

              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="p-4 rounded-xl bg-card border border-primary/20 space-y-3 relative"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-primary font-bold">
                      Teammate #{index + 2}
                    </span>
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="text-rose-400 hover:text-rose-300 p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Input
                      label="Member Name"
                      placeholder="Full Name"
                      {...register(`teamMembers.${index}.name` as const)}
                      error={errors.teamMembers?.[index]?.name?.message}
                    />
                    <Input
                      label="Member Email"
                      type="email"
                      placeholder="Email Address"
                      {...register(`teamMembers.${index}.email` as const)}
                      error={errors.teamMembers?.[index]?.email?.message}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          <Button type="submit" variant="primary" size="lg" className="w-full" isLoading={submitting}>
            Confirm Event Registration →
          </Button>
        </form>
      </Card>

      {/* Success Modal */}
      {successData && (
        <Modal
          isOpen={!!successData}
          onClose={() => setSuccessData(null)}
          title="Registration Successful!"
        >
          <div className="text-center space-y-4 py-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto shadow-glow">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-1">
              <p className="text-xs font-mono text-secondary-foreground uppercase">Unique Registration ID</p>
              <h3 className="text-3xl font-extrabold font-mono text-primary tracking-wider">
                {successData.registrationId}
              </h3>
            </div>

            <div className="p-4 rounded-xl bg-card border border-primary/20 text-xs font-mono space-y-1.5 text-left">
              <p><span className="text-slate-400">Participant:</span> <span className="text-white font-bold">{successData.participantName}</span></p>
              <p><span className="text-slate-400">Event:</span> <span className="text-cyan font-bold">{successData.eventTitle}</span></p>
              <p><span className="text-slate-400">Venue:</span> <span className="text-white">ECE Department Campus</span></p>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Please save your Registration ID for campus verification and entry on symposium day.
            </p>

            <Button
              variant="primary"
              className="w-full"
              onClick={() => setSuccessData(null)}
            >
              Done & Register Another
            </Button>
          </div>
        </Modal>
      )}
    </div>
  );
}
