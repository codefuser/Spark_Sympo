"use client";

import React, { useState, useRef, useEffect, useImperativeHandle } from "react";
import { cn } from "@/lib/utils";
import { ChevronDown, Check } from "lucide-react";

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  placeholder?: string;
  options: { label: string; value: string }[];
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, options, id, value, defaultValue, onChange, disabled, placeholder, ...props }, ref) => {
    const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);
    
    // Internal state for selected value
    const [selectedVal, setSelectedVal] = useState<string>(
      (value as string) ?? (defaultValue as string) ?? (options[0]?.value || "")
    );
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const hiddenSelectRef = useRef<HTMLSelectElement>(null);

    // Sync forwarded ref with internal ref
    useImperativeHandle(ref, () => hiddenSelectRef.current as HTMLSelectElement);

    // Keep state updated if controlled prop changes
    useEffect(() => {
      if (value !== undefined && value !== null) {
        setSelectedVal(value as string);
      }
    }, [value]);

    // Handle clicks outside to close dropdown
    useEffect(() => {
      const handleClickOutside = (e: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
          setIsOpen(false);
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const selectedOption = options.find((opt) => opt.value === selectedVal) || options[0];

    const handleSelectOption = (optValue: string) => {
      setSelectedVal(optValue);
      setIsOpen(false);

      if (hiddenSelectRef.current) {
        // Dispatch native select value change for React Hook Form compatibility
        const nativeSetter = Object.getOwnPropertyDescriptor(
          window.HTMLSelectElement.prototype,
          "value"
        )?.set;

        if (nativeSetter) {
          nativeSetter.call(hiddenSelectRef.current, optValue);
        } else {
          hiddenSelectRef.current.value = optValue;
        }

        const ev = new Event("change", { bubbles: true });
        hiddenSelectRef.current.dispatchEvent(ev);
      }
    };

    return (
      <div className="w-full space-y-1.5 relative" ref={containerRef}>
        {label && (
          <label
            htmlFor={selectId}
            className="block text-xs font-mono font-medium text-slate-400 tracking-wider uppercase"
          >
            {label}
          </label>
        )}

        {/* Hidden Native Select for RHF & Form compatibility */}
        <select
          id={selectId}
          ref={hiddenSelectRef}
          value={selectedVal}
          onChange={(e) => {
            setSelectedVal(e.target.value);
            if (onChange) onChange(e);
          }}
          disabled={disabled}
          className="sr-only"
          tabIndex={-1}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        {/* Custom Styled Trigger Button */}
        <button
          type="button"
          disabled={disabled}
          onClick={() => setIsOpen((prev) => !prev)}
          className={cn(
            "w-full flex items-center justify-between rounded-xl bg-slate-900/80 border border-slate-700/80 px-3.5 py-2.5 text-sm text-slate-100 transition-all duration-200 hover:border-slate-600 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 disabled:opacity-50 text-left",
            isOpen && "border-cyan-400 ring-2 ring-cyan-400/20 bg-slate-900",
            error && "border-rose-500/80 focus:border-rose-500 focus:ring-rose-500/20",
            className
          )}
        >
          <span className="truncate pr-2 font-medium">
            {selectedOption ? selectedOption.label : (placeholder || "Select option")}
          </span>
          <ChevronDown
            className={cn(
              "w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200",
              isOpen && "rotate-180 text-cyan-400"
            )}
          />
        </button>

        {/* Custom Glassmorphism Dropdown Menu */}
        {isOpen && (
          <div className="absolute left-0 right-0 top-full mt-1.5 z-50 bg-[#0E1526]/95 backdrop-blur-xl border border-slate-700/80 shadow-2xl shadow-black/90 rounded-xl overflow-hidden animate-in fade-in-50 zoom-in-95 duration-150">
            <div className="max-h-60 overflow-y-auto p-1.5 space-y-0.5 scrollbar-thin">
              {options.map((opt) => {
                const isSelected = opt.value === selectedVal;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => handleSelectOption(opt.value)}
                    className={cn(
                      "w-full flex items-center justify-between px-3 py-2 text-xs rounded-lg transition-colors duration-150 text-left font-medium",
                      isSelected
                        ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shadow-sm"
                        : "text-slate-300 hover:bg-slate-800/80 hover:text-slate-100"
                    )}
                  >
                    <span className="truncate pr-2">{opt.label}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {error && <p className="text-xs text-rose-400 font-mono mt-1">{error}</p>}
      </div>
    );
  }
);

Select.displayName = "Select";
