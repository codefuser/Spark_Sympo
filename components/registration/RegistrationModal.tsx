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
import {
  CheckCircle2,
  UserPlus,
  Trash2,
  ShieldCheck,
  MapPin,
  Users,
  Award,
  ArrowRight,
  Sparkles,
  Utensils,
  Layers,
} from "lucide-react";
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
    technicalEventTitle: string;
    nonTechnicalEventTitle: string;
    participantCount: number;
  } | null>(null);

  // Filter Technical & Non-Technical events
  const technicalEvents = events.filter(
    (e) => e.category === "TECHNICAL" || (e as any).minMembers !== undefined
  );
  const nonTechnicalEvents = events.filter((e) => e.category === "NON_TECHNICAL");

  const defaultTechId =
    technicalEvents.find((e) => e.id === selectedEventId)?.id ||
    technicalEvents[0]?.id ||
    "";
  const defaultNonTechId =
    nonTechnicalEvents.find((e) => e.id === selectedEventId)?.id ||
    nonTechnicalEvents[0]?.id ||
    "";

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
      technicalEventId: defaultTechId,
      nonTechnicalEventId: defaultNonTechId,
      teamName: "",
      registrationType: "online",
      participants: [
        {
          fullName: "",
          email: "",
          phone: "",
          college: "",
          foodPreference: "Veg",
          isTeamLeader: true,
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "participants",
  });

  const activeTechId = watch("technicalEventId");
  const activeNonTechId = watch("nonTechnicalEventId");

  const activeTechEvent = events.find((e) => e.id === activeTechId);
  const activeNonTechEvent = events.find((e) => e.id === activeNonTechId);

  // Determine dynamic max team member count based on selected event configs
  const maxTechMembers = (activeTechEvent as any)?.maxMembers || 2;
  const maxNonTechMembers = (activeNonTechEvent as any)?.maxMembers || 4;
  const maxAllowedMembers = Math.max(maxTechMembers, maxNonTechMembers);

  useEffect(() => {
    if (selectedEventId) {
      const matchTech = technicalEvents.find((e) => e.id === selectedEventId);
      const matchNonTech = nonTechnicalEvents.find((e) => e.id === selectedEventId);
      if (matchTech) setValue("technicalEventId", matchTech.id);
      if (matchNonTech) setValue("nonTechnicalEventId", matchNonTech.id);
    }
  }, [selectedEventId, events, setValue]);

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
          technicalEventTitle: result.technicalEventTitle,
          nonTechnicalEventTitle: result.nonTechnicalEventTitle,
          participantCount: result.participantCount,
        });
        showToast("Registration Confirmed!", `Pass: ${result.registrationId}`, "success");
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
      title="SPARKTRON 2K26 Online Registration"
      description="Select 1 Technical + 1 Non-Technical track and enter participant details."
      maxWidth="xl"
    >
      {successData ? (
        <div className="text-center space-y-5 py-4 animate-in fade-in zoom-in-95">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto shadow-md">
            <CheckCircle2 className="w-9 h-9" />
          </div>

          <div className="space-y-1.5">
            <p className="text-xs font-medium text-slate-400 uppercase tracking-widest">
              Official Symposium Registration Pass
            </p>
            <h3 className="text-3xl font-black font-mono text-cyan-400 tracking-widest bg-cyan-950/30 py-2 px-5 rounded-2xl border border-cyan-500/30 inline-block shadow-lg">
              {successData.registrationId}
            </h3>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 text-xs space-y-2.5 text-left">
            <div className="flex justify-between border-b border-slate-800 pb-2">
              <span className="text-slate-400">Primary Participant:</span>
              <span className="text-slate-100 font-semibold">{successData.participantName}</span>
            </div>
            <div className="flex justify-between border-b border-slate-800 pb-2">
              <span className="text-slate-400">Technical Track:</span>
              <span className="text-cyan-400 font-semibold">{successData.technicalEventTitle}</span>
            </div>
            <div className="flex justify-between border-b border-slate-800 pb-2">
              <span className="text-slate-400">Non-Technical Track:</span>
              <span className="text-cyan-300 font-semibold">{successData.nonTechnicalEventTitle}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Registered Team Members:</span>
              <span className="text-emerald-400 font-bold">{successData.participantCount} Member(s)</span>
            </div>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed px-2">
            Save this Registration Pass code for campus entry and desk verification on September 16, 2026.
          </p>

          <Button variant="primary" className="w-full py-3" onClick={handleModalClose}>
            Done
          </Button>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-5 max-h-[68vh] overflow-y-auto pr-2"
        >
          {/* SECTION 1: EVENT SELECTION */}
          <div className="space-y-3 pb-4 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <span className="p-1 rounded-md bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                <Layers className="w-3.5 h-3.5" />
              </span>
              <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
                Section 1: Event Selection (1 Tech + 1 Non-Tech Required)
              </h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <Select
                label="TECHNICAL EVENT *"
                options={technicalEvents.map((e) => ({
                  label: `${e.title} (Max ${ (e as any).maxMembers || 2 } members)`,
                  value: e.id,
                }))}
                {...register("technicalEventId")}
                error={errors.technicalEventId?.message}
              />

              <Select
                label="NON-TECHNICAL EVENT *"
                options={nonTechnicalEvents.map((e) => ({
                  label: `${e.title} (Max ${ (e as any).maxMembers || 4 } members)`,
                  value: e.id,
                }))}
                {...register("nonTechnicalEventId")}
                error={errors.nonTechnicalEventId?.message}
              />
            </div>

            {/* Selected Events Information Summary */}
            <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-slate-300 grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div className="space-y-1">
                <p className="text-cyan-400 font-bold flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5" /> {activeTechEvent?.title || "Technical Track"}
                </p>
                <p className="text-slate-400 truncate">Venue: {activeTechEvent?.venue || "ECE Lab"}</p>
              </div>
              <div className="space-y-1">
                <p className="text-cyan-300 font-bold flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5" /> {activeNonTechEvent?.title || "Non-Technical Track"}
                </p>
                <p className="text-slate-400 truncate">Venue: {activeNonTechEvent?.venue || "Campus Arena"}</p>
              </div>
            </div>
          </div>

          {/* SECTION 2: TEAM / PARTICIPANTS */}
          <div className="space-y-4 pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="p-1 rounded-md bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  <Users className="w-3.5 h-3.5" />
                </span>
                <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
                  Section 2: Team / Participant Details
                </h4>
              </div>

              {fields.length < maxAllowedMembers && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  leftIcon={<UserPlus className="w-3.5 h-3.5" />}
                  onClick={() =>
                    append({
                      fullName: "",
                      email: "",
                      phone: "",
                      college: "",
                      foodPreference: "Veg",
                      isTeamLeader: false,
                    })
                  }
                >
                  Add Team Member
                </Button>
              )}
            </div>

            <Input
              label="Team Name (Optional)"
              placeholder="e.g. Circuit Titans"
              {...register("teamName")}
            />

            {/* Dynamic Participants list */}
            <div className="space-y-4">
              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3 relative"
                >
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-200 border-b border-slate-800/80 pb-2">
                    <span className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                      Participant {index + 1} {index === 0 ? "(Team Leader *)" : ""}
                    </span>

                    {index > 0 && (
                      <button
                        type="button"
                        onClick={() => remove(index)}
                        className="text-slate-400 hover:text-rose-400 transition-colors p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Input
                      label="Full Name *"
                      placeholder="e.g. Rahul Sharma"
                      {...register(`participants.${index}.fullName` as const)}
                      error={errors.participants?.[index]?.fullName?.message}
                    />
                    <Input
                      label="Email Address *"
                      type="email"
                      placeholder="rahul@student.edu"
                      {...register(`participants.${index}.email` as const)}
                      error={errors.participants?.[index]?.email?.message}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <Input
                      label="Mobile Phone *"
                      placeholder="9876543210"
                      {...register(`participants.${index}.phone` as const)}
                      error={errors.participants?.[index]?.phone?.message}
                    />
                    <Input
                      label="College / Institution *"
                      placeholder="e.g. SRM Institute"
                      {...register(`participants.${index}.college` as const)}
                      error={errors.participants?.[index]?.college?.message}
                    />
                    <Select
                      label="Food Preference *"
                      options={[
                        { label: "Veg 🥗", value: "Veg" },
                        { label: "Non-Veg 🍗", value: "Non-Veg" },
                      ]}
                      {...register(`participants.${index}.foodPreference` as const)}
                      error={errors.participants?.[index]?.foodPreference?.message}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full text-sm font-semibold tracking-wide py-3 shadow-lg shadow-cyan-950/40"
              isLoading={submitting}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Submit Registration Pass
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
}
