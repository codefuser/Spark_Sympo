"use client";

import React, { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registrationSchema } from "@/lib/validations/schemas";
import { z } from "zod";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { Cpu, CheckCircle2, UserPlus, Trash2, ShieldCheck, Zap } from "lucide-react";
import { SymposiumEvent } from "@/types";

type RegistrationFormInputs = z.infer<typeof registrationSchema>;

interface RegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedEventId?: string;
  events: SymposiumEvent[];
}

export function RegistrationModal({
  isOpen,
  onClose,
  selectedEventId = "",
  events,
}: RegistrationModalProps) {
  const { showToast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [successData, setSuccessData] = useState<{
    registrationId: string;
    participantName: string;
    eventTitle: string;
  } | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    control,
    reset,
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
      eventId: selectedEventId || (events[0]?.id ?? ""),
      teamName: "",
      teamMembers: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "teamMembers",
  });

  useEffect(() => {
    if (selectedEventId) {
      setValue("eventId", selectedEventId);
    } else if (events.length > 0) {
      setValue("eventId", events[0].id);
    }
  }, [selectedEventId, events, setValue]);

  const activeEventId = watch("eventId");
  const activeEvent = events.find((e) => e.id === activeEventId);

  const onSubmit = async (data: RegistrationFormInputs) => {
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
        reset();
      } else {
        showToast("Registration Error", result.message || "Something went wrong", "error");
      }
    } catch (err) {
      showToast("Network Error", "Unable to connect to server", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleModalClose = () => {
    setSuccessData(null);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleModalClose}
      title="SPARKTRON 2K26 Event Registration"
      description="Fill out the registration details. Duplicate registrations for the same event are automatically prevented."
      maxWidth="xl"
    >
      {successData ? (
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
            <p><span className="text-slate-400">Event Track:</span> <span className="text-cyan font-bold">{successData.eventTitle}</span></p>
            <p><span className="text-slate-400">Venue:</span> <span className="text-white">ECE Campus Auditorium & Labs</span></p>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed">
            Please save your Registration ID for campus verification and entry on symposium day.
          </p>

          <Button variant="primary" className="w-full" onClick={handleModalClose}>
            Done
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-h-[75vh] overflow-y-auto pr-1">
          {/* Select Event Track */}
          <div className="space-y-2 pb-4 border-b border-primary/10">
            <Select
              label="Select Event Track *"
              options={events.map((e) => ({
                label: `${e.title} (${e.category} • ${e.teamSize})`,
                value: e.id,
              }))}
              {...register("eventId")}
              error={errors.eventId?.message}
            />
            {activeEvent && (
              <div className="p-2.5 rounded-lg bg-card/80 border border-primary/20 text-xs font-mono text-slate-300 flex flex-wrap justify-between gap-2">
                <span>Rounds: {activeEvent.rounds}</span>
                <span>Venue: {activeEvent.venue}</span>
                <span>Team Size: {activeEvent.teamSize}</span>
              </div>
            )}
          </div>

          {/* Participant Details */}
          <div className="space-y-3 pb-4 border-b border-primary/10">
            <h4 className="text-xs font-mono font-bold text-primary uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" /> Participant Details
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                label="Full Name *"
                placeholder="e.g. Rahul Sharma"
                {...register("name")}
                error={errors.name?.message}
              />
              <Input
                label="Email Address *"
                type="email"
                placeholder="rahul@student.edu"
                {...register("email")}
                error={errors.email?.message}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                label="Mobile Phone Number *"
                placeholder="9876543210"
                {...register("phone")}
                error={errors.phone?.message}
              />
              <Input
                label="College / Institution *"
                placeholder="e.g. SRM Institute"
                {...register("college")}
                error={errors.college?.message}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
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
                  { label: "Other", value: "Other" },
                ]}
                {...register("gender")}
              />
            </div>
          </div>

          {/* Team Members if applicable */}
          {activeEvent && activeEvent.teamSize !== "Individual" && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-mono font-bold text-cyan uppercase tracking-wider">
                  Team Members (Optional)
                </h4>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  leftIcon={<UserPlus className="w-3.5 h-3.5" />}
                  onClick={() => append({ name: "", email: "", phone: "" })}
                >
                  Add Member
                </Button>
              </div>

              <Input
                label="Team Name (Optional)"
                placeholder="e.g. Circuit Titans"
                {...register("teamName")}
              />

              {fields.map((field, index) => (
                <div key={field.id} className="p-3 rounded-lg bg-background border border-primary/20 space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono text-primary font-bold">
                    <span>Teammate #{index + 2}</span>
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="text-rose-400 hover:text-rose-300"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <Input
                      placeholder="Member Name"
                      {...register(`teamMembers.${index}.name` as const)}
                      error={errors.teamMembers?.[index]?.name?.message}
                    />
                    <Input
                      type="email"
                      placeholder="Member Email"
                      {...register(`teamMembers.${index}.email` as const)}
                      error={errors.teamMembers?.[index]?.email?.message}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          <Button type="submit" variant="primary" size="lg" className="w-full" isLoading={submitting}>
            Submit Registration →
          </Button>
        </form>
      )}
    </Modal>
  );
}
