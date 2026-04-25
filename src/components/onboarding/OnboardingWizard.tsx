"use client";

import { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { userStorage } from "@/lib/user-storage";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const US_STATES = [
  "AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA",
  "KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ",
  "NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT",
  "VA","WA","WV","WI","WY",
];

const TRADES = [
  "Plumber","Electrician","HVAC","General Contractor","Painter","Roofer",
  "Landscaper","Carpenter","Handyman","Appliance Repair","Other",
];

const PROPERTY_TYPES_PM = [
  "Residential","Commercial","Mixed-use","Student Housing","Senior Living","Vacation/Short-term",
];

const PM_PRIORITIES = [
  "Financial reporting","Maintenance efficiency","Vendor management","Tenant satisfaction","Compliance",
];

const CLIENT_PROPERTY_TYPES = ["House","Condo/Apartment","Rental Property","Commercial"];
const CLIENT_REASONS = [
  "Specific repair needed","Home renovation","Regular maintenance","Emergency","Just browsing",
];

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type Role = "pm" | "pro" | "client";

interface OnboardingWizardProps {
  role: Role;
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function Input({
  label, value, onChange, placeholder, type = "text", required = false,
}: {
  label: string; value: string; onChange: (v: string) => void;
  placeholder?: string; type?: string; required?: boolean;
}) {
  return (
    <div className="space-y-1">
      <label className="block text-xs font-medium text-zinc-600">{label}{required && <span className="text-red-400"> *</span>}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-[#00a9e0] focus:outline-none focus:ring-1 focus:ring-[#00a9e0]"
      />
    </div>
  );
}

function Select({
  label, value, onChange, options, placeholder = "Select...", required = false,
}: {
  label: string; value: string; onChange: (v: string) => void;
  options: string[]; placeholder?: string; required?: boolean;
}) {
  return (
    <div className="space-y-1">
      <label className="block text-xs font-medium text-zinc-600">{label}{required && <span className="text-red-400"> *</span>}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-[#00a9e0] focus:outline-none focus:ring-1 focus:ring-[#00a9e0]"
      >
        <option value="">{placeholder}</option>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}

function MultiCheck({
  label, options, selected, onChange,
}: {
  label: string; options: string[]; selected: string[]; onChange: (v: string[]) => void;
}) {
  const toggle = (opt: string) => {
    onChange(selected.includes(opt) ? selected.filter((s) => s !== opt) : [...selected, opt]);
  };
  return (
    <div className="space-y-2">
      <label className="block text-xs font-medium text-zinc-600">{label}</label>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => (
          <button
            key={o}
            type="button"
            onClick={() => toggle(o)}
            className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
              selected.includes(o)
                ? "border-[#00a9e0] bg-[#00a9e0]/10 text-[#00a9e0]"
                : "border-zinc-200 text-zinc-600 hover:border-zinc-300"
            }`}
          >
            {o}
          </button>
        ))}
      </div>
    </div>
  );
}

function RadioGroup({
  label, options, value, onChange,
}: {
  label: string; options: string[]; value: string; onChange: (v: string) => void;
}) {
  return (
    <div className="space-y-2">
      <label className="block text-xs font-medium text-zinc-600">{label}</label>
      <div className="space-y-1.5">
        {options.map((o) => (
          <button
            key={o}
            type="button"
            onClick={() => onChange(o)}
            className={`flex w-full items-center gap-2 rounded-lg border px-3 py-2 text-left text-sm transition-colors ${
              value === o
                ? "border-[#00a9e0] bg-[#00a9e0]/5 text-[#00a9e0]"
                : "border-zinc-200 text-zinc-700 hover:border-zinc-300"
            }`}
          >
            <div className={`h-3.5 w-3.5 shrink-0 rounded-full border-2 ${
              value === o ? "border-[#00a9e0] bg-[#00a9e0]" : "border-zinc-300"
            }`} />
            {o}
          </button>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------

export default function OnboardingWizard({ role }: OnboardingWizardProps) {
  const [visible, setVisible] = useState(false);
  const [step, setStep] = useState(0);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [data, setData] = useState<Record<string, any>>({});

  const totalSteps = role === "client" ? 2 : 3;

  useEffect(() => {
    const done = userStorage.get<boolean>("onboarding-complete");
    if (!done) setVisible(true);
  }, []);

  const set = useCallback((key: string, val: unknown) => {
    setData((prev) => ({ ...prev, [key]: val }));
  }, []);

  const finish = useCallback(() => {
    userStorage.set("user-profile", { ...data, role });
    userStorage.set("onboarding-complete", true);
    // Update display name for sidebar/header
    const name = data.fullName || data.name || "";
    if (name) localStorage.setItem("sherpa-test-name", name);
    setVisible(false);
  }, [data, role]);

  const skip = useCallback(() => {
    userStorage.set("onboarding-skipped", true);
    userStorage.set("onboarding-complete", true);
    setVisible(false);
  }, []);

  if (!visible) return null;

  // Try to pre-fill email from existing auth data
  if (!data._emailPrefilled) {
    const existing = localStorage.getItem("sherpa-test-email");
    if (existing) {
      setData((prev) => ({ ...prev, email: existing, _emailPrefilled: true }));
    } else {
      setData((prev) => ({ ...prev, _emailPrefilled: true }));
    }
  }

  // ---- Step renderers ----

  const renderPMStep = () => {
    if (step === 0) return (
      <div className="space-y-3">
        <Input label="Company Name" value={data.companyName || ""} onChange={(v) => set("companyName", v)} placeholder="Sunrise Properties" required />
        <Input label="Your Name" value={data.name || ""} onChange={(v) => set("name", v)} placeholder="Lisa Park" required />
        <Input label="Email" value={data.email || ""} onChange={(v) => set("email", v)} placeholder="lisa@sunrise.com" type="email" required />
        <Input label="Phone" value={data.phone || ""} onChange={(v) => set("phone", v)} placeholder="(603) 555-0000" type="tel" />
      </div>
    );
    if (step === 1) return (
      <div className="space-y-3">
        <Select label="Number of Properties" value={data.propertyCount || ""} onChange={(v) => set("propertyCount", v)} options={["1-5","6-20","21-50","50+"]} />
        <Select label="Total Units Managed" value={data.unitCount || ""} onChange={(v) => set("unitCount", v)} options={["1-25","26-100","101-500","500+"]} />
        <Input label="Primary City" value={data.city || ""} onChange={(v) => set("city", v)} placeholder="Manchester" />
        <Select label="State" value={data.state || ""} onChange={(v) => set("state", v)} options={US_STATES} />
      </div>
    );
    return (
      <div className="space-y-4">
        <MultiCheck label="Property Types Managed" options={PROPERTY_TYPES_PM} selected={data.propertyTypes || []} onChange={(v) => set("propertyTypes", v)} />
        <RadioGroup label="What's most important to you?" options={PM_PRIORITIES} value={data.priority || ""} onChange={(v) => set("priority", v)} />
      </div>
    );
  };

  const renderProStep = () => {
    if (step === 0) return (
      <div className="space-y-3">
        <Input label="Full Name" value={data.fullName || ""} onChange={(v) => set("fullName", v)} placeholder="Marcus Rivera" required />
        <Input label="Business Name" value={data.businessName || ""} onChange={(v) => set("businessName", v)} placeholder="Rivera Plumbing (optional)" />
        <Input label="Email" value={data.email || ""} onChange={(v) => set("email", v)} placeholder="marcus@email.com" type="email" required />
        <Input label="Phone" value={data.phone || ""} onChange={(v) => set("phone", v)} placeholder="(603) 555-0000" type="tel" />
      </div>
    );
    if (step === 1) return (
      <div className="space-y-3">
        <Select label="Primary Trade" value={data.trade || ""} onChange={(v) => set("trade", v)} options={TRADES} required />
        <Select label="Years of Experience" value={data.experience || ""} onChange={(v) => set("experience", v)} options={["1-3","4-7","8-15","15+"]} />
        <Input label="License Number" value={data.licenseNumber || ""} onChange={(v) => set("licenseNumber", v)} placeholder="Optional" />
        <Input label="City" value={data.city || ""} onChange={(v) => set("city", v)} placeholder="Portsmouth" />
        <Select label="State" value={data.state || ""} onChange={(v) => set("state", v)} options={US_STATES} />
      </div>
    );
    return (
      <div className="space-y-3">
        <Select label="Service Radius" value={data.serviceRadius || ""} onChange={(v) => set("serviceRadius", v)} options={["10mi","25mi","50mi","100mi","Nationwide"]} />
        <Select label="Availability" value={data.availability || ""} onChange={(v) => set("availability", v)} options={["Full-time","Part-time","Weekends only","Emergency only"]} />
        <div className="space-y-1">
          <label className="block text-xs font-medium text-zinc-600">Hourly Rate Range ($)</label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={data.rateMin || ""}
              onChange={(e) => set("rateMin", e.target.value)}
              placeholder="Min"
              className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-[#00a9e0] focus:outline-none focus:ring-1 focus:ring-[#00a9e0]"
            />
            <span className="text-zinc-400">-</span>
            <input
              type="number"
              value={data.rateMax || ""}
              onChange={(e) => set("rateMax", e.target.value)}
              placeholder="Max"
              className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-[#00a9e0] focus:outline-none focus:ring-1 focus:ring-[#00a9e0]"
            />
          </div>
        </div>
      </div>
    );
  };

  const renderClientStep = () => {
    if (step === 0) return (
      <div className="space-y-3">
        <Input label="Full Name" value={data.fullName || ""} onChange={(v) => set("fullName", v)} placeholder="Jamie Davis" required />
        <Input label="Email" value={data.email || ""} onChange={(v) => set("email", v)} placeholder="jamie@email.com" type="email" required />
        <Input label="Phone" value={data.phone || ""} onChange={(v) => set("phone", v)} placeholder="(603) 555-0000" type="tel" />
        <Input label="City" value={data.city || ""} onChange={(v) => set("city", v)} placeholder="Nashua" />
        <Select label="State" value={data.state || ""} onChange={(v) => set("state", v)} options={US_STATES} />
      </div>
    );
    return (
      <div className="space-y-4">
        <RadioGroup label="Property Type" options={CLIENT_PROPERTY_TYPES} value={data.propertyType || ""} onChange={(v) => set("propertyType", v)} />
        <RadioGroup label="What brings you here?" options={CLIENT_REASONS} value={data.reason || ""} onChange={(v) => set("reason", v)} />
      </div>
    );
  };

  const stepTitles: Record<Role, string[]> = {
    pm: ["Let's set up your account", "Tell us about your portfolio", "Almost done!"],
    pro: ["Welcome, Pro!", "Your trade", "Service details"],
    client: ["Let's get you started", "What do you need?"],
  };

  const ctaLabel = (() => {
    if (step < totalSteps - 1) return "Continue";
    if (role === "pm") return "Get Started";
    if (role === "pro") return "Start Finding Jobs";
    return "Find Pros";
  })();

  const renderStep = role === "pm" ? renderPMStep : role === "pro" ? renderProStep : renderClientStep;

  return createPortal(
    <div className="fixed inset-0 z-[9998] flex items-center justify-center" aria-modal="true" role="dialog">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Card */}
      <div className="relative z-10 mx-4 w-full max-w-md rounded-2xl bg-white shadow-2xl">
        {/* Skip button */}
        <button
          type="button"
          onClick={skip}
          className="absolute right-4 top-4 text-xs text-zinc-400 hover:text-zinc-600 transition-colors"
        >
          I'll do this later
        </button>

        <div className="p-6">
          {/* Progress dots */}
          <div className="mb-4 flex items-center gap-1.5">
            {Array.from({ length: totalSteps }).map((_, i) => (
              <div
                key={i}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === step ? "w-6 bg-[#00a9e0]" : i < step ? "w-1.5 bg-[#00a9e0]/40" : "w-1.5 bg-zinc-200"
                }`}
              />
            ))}
          </div>

          {/* Title */}
          <h2 className="text-lg font-semibold text-zinc-900">
            {stepTitles[role][step]}
          </h2>
          <p className="mt-1 mb-5 text-sm text-zinc-500">
            Step {step + 1} of {totalSteps}
          </p>

          {/* Step content */}
          {renderStep()}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-zinc-100 px-6 py-4">
          {step > 0 ? (
            <button
              type="button"
              onClick={() => setStep((s) => s - 1)}
              className="rounded-lg px-3 py-1.5 text-sm font-medium text-zinc-600 hover:bg-zinc-100 transition-colors"
            >
              Back
            </button>
          ) : (
            <div />
          )}
          <button
            type="button"
            onClick={() => {
              if (step < totalSteps - 1) setStep((s) => s + 1);
              else finish();
            }}
            className="rounded-lg bg-[#00a9e0] px-5 py-2 text-sm font-semibold text-white hover:bg-[#0090c0] transition-colors"
          >
            {ctaLabel}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
