"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { adminLoginSchema } from "@/lib/validations/schemas";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { ShieldCheck, Lock, Cpu, KeyRound } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(adminLoginSchema),
    defaultValues: {
      email: "admin@sparktron.ece",
      password: "",
    },
  });

  const onSubmit = async (data: any) => {
    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();
      if (res.ok && result.success) {
        showToast("Admin Authenticated", "Welcome to Admin Dashboard", "success");
        router.push("/admin");
        router.refresh();
      } else {
        showToast("Access Denied", result.message || "Invalid credentials", "error");
      }
    } catch (err) {
      showToast("Network Error", "Unable to connect to auth server", "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4 circuit-bg">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/40 text-primary flex items-center justify-center mx-auto shadow-glow">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-extrabold font-mono text-white tracking-widest uppercase">
            SPARK<span className="text-primary">TRON</span> ADMIN
          </h1>
          <p className="text-xs font-mono text-slate-400">
            Authorized Personnel Portal Access
          </p>
        </div>

        <Card className="p-6 sm:p-8 space-y-6 border-primary/30">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Admin Email *"
              type="email"
              placeholder="admin@sparktron.ece"
              leftIcon={<Lock className="w-4 h-4" />}
              {...register("email")}
              error={errors.email?.message}
            />

            <Input
              label="Password *"
              type="password"
              placeholder="••••••••"
              leftIcon={<KeyRound className="w-4 h-4" />}
              {...register("password")}
              error={errors.password?.message}
            />

            <Button
              type="submit"
              variant="primary"
              className="w-full mt-2"
              isLoading={submitting}
            >
              Sign In to Admin Console →
            </Button>
          </form>

          <div className="p-3 rounded-lg bg-card/80 border border-primary/20 text-[11px] font-mono text-slate-400 space-y-1">
            <p className="text-primary font-bold">Default Demo Credentials:</p>
            <p>Email: <span className="text-white">admin@sparktron.ece</span></p>
            <p>Password: <span className="text-white">sparktron2k26#admin</span></p>
          </div>
        </Card>
      </div>
    </div>
  );
}
