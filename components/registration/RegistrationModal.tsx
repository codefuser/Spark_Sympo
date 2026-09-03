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
import { CheckCircle2, UserPlus, Trash2, ShieldCheck, MapPin, Users, Award, Ticket, ArrowRight, Sparkles } from "lucide-react";
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
      title="SPARKTRON 2K26 Registration"
      description="Fill out your participant details to complete your event registration."
      maxWidth="xl"
    >
      {successData ? (
        <div className="text-center space-y-5 py-4">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto shadow-md">
            <CheckCircle2 className="w-9 h-9" />
          </div>

          <div className="space-y-1.5">
            <p className="text-xs font-medium text-slate-400 uppercase tracking-widest">Unique Registration Pass</p>
            <h3 className="text-3xl font-black font-mono text-cyan-400 tracking-widest bg-cyan-950/30 py-2 px-4 rounded-xl border border-cyan-500/20 inline-block">
              {successData.registrationId}
            </h3>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-xs space-y-2 text-left">
            <div className="flex justify-between border-b border-slate-800 pb-2">
              <span className="text-slate-400">Participant:</span>
              <span className="text-slate-100 font-semibold">{successData.participantName}</span>
            </div>
            <div className="flex justify-between border-b border-slate-800 pb-2">
              <span className="text-slate-400">Event Track:</span>
              <span className="text-cyan-400 font-semibold">{successData.eventTitle}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Venue:</span>
              <span className="text-slate-200">ECE Campus Auditorium & Labs</span>
            </div>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed px-2">
            Show this Registration ID at the venue desk during event check-in on symposium day.
          </p>

          <Button variant="primary" className="w-full py-3" onClick={handleModalClose}>
            Done
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 max-h-[68vh] overflow-y-auto pr-2">
          {/* Select Event Track */}
          <div className="space-y-3 pb-4 border-b border-slate-800">
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
              <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800/90 text-xs text-slate-300 grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <div className="flex items-center gap-2 text-slate-300">
                  <Award className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>Rounds: <strong className="text-slate-100">{activeEvent.rounds}</strong></span>
                </div>
                <div className="flex items-center gap-2 text-slate-300">
                  <MapPin className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span className="truncate" title={activeEvent.venue}>Venue: <strong className="text-slate-100">{activeEvent.venue}</strong></span>
                </div>
                <div className="flex items-center gap-2 text-slate-300">
                  <Users className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>Team: <strong className="text-slate-100">{activeEvent.teamSize}</strong></span>
                </div>
              </div>
            )}
          </div>

          {/* Participant Details */}
          <div className="space-y-3 pb-4 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <span className="p-1 rounded-md bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                <ShieldCheck className="w-3.5 h-3.5" />
              </span>
              <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
                Participant Details
              </h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
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

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
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
            <div className="space-y-3.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="p-1 rounded-md bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                    <Users className="w-3.5 h-3.5" />
                  </span>
                  <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
                    Team Details (Optional)
                  </h4>
                </div>
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
                <div key={field.id} className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2.5">
                  <div className="flex items-center justify-between text-xs font-medium text-slate-300">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                      Teammate #{index + 2}
                    </span>
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="text-slate-400 hover:text-rose-400 transition-colors p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
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

          <div className="pt-2">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full text-sm font-semibold tracking-wide py-3 shadow-lg shadow-cyan-950/40"
              isLoading={submitting}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Submit Registration
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
}
