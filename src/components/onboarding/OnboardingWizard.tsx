"use client";

import { useState, useCallback } from "react";
import { createPortal } from "react-dom";
import { userStorage } from "@/lib/user-storage";
import { SKILL_CATEGORIES } from "@/lib/skills-catalog";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const US_STATES = [
  "AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA",
  "KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ",
  "NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT",
  "VA","WA","WV","WI","WY",
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

const PROPERTY_COUNT_OPTIONS = ["1-3", "4-10", "11-25", "25+"];
const BUSINESS_TYPE_OPTIONS = ["Retail", "Restaurant", "Office", "Warehouse", "Other"];

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
// Skills Checklist Sub-component
// ---------------------------------------------------------------------------

function SkillsChecklist({
  selectedSkills,
  onToggleSkill,
  otherText,
  onOtherTextChange,
}: {
  selectedSkills: string[];
  onToggleSkill: (key: string) => void;
  otherText: string;
  onOtherTextChange: (v: string) => void;
}) {
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  return (
    <div className="space-y-1">
      <label className="block text-xs font-medium text-zinc-600">
        Select your skills <span className="text-red-400">*</span>
        <span className="ml-1 font-normal text-zinc-400">(min 3)</span>
      </label>
      {selectedSkills.length > 0 && (
        <p className="text-xs text-[#00a9e0] font-medium">
          {selectedSkills.length} skill{selectedSkills.length !== 1 ? "s" : ""} selected
        </p>
      )}
      <div className="mt-1 max-h-[280px] overflow-y-auto rounded-lg border border-zinc-200">
        {SKILL_CATEGORIES.map((cat) => {
          const isOther = cat.key === "other";
          const isExpanded = expandedCategory === cat.key;
          const selectedInCat = isOther
            ? (otherText.trim() ? 1 : 0)
            : cat.skills.filter((s) => selectedSkills.includes(s.key)).length;

          return (
            <div key={cat.key} className="border-b border-zinc-100 last:border-b-0">
              {/* Category header */}
              <button
                type="button"
                onClick={() => setExpandedCategory(isExpanded ? null : cat.key)}
                className="flex w-full items-center justify-between px-3 py-2.5 text-left text-sm transition-colors hover:bg-zinc-50"
              >
                <span className="font-medium text-zinc-800">{cat.label}</span>
                <span className="flex items-center gap-2">
                  {selectedInCat > 0 && (
                    <span className="rounded-full bg-[#00a9e0]/10 px-2 py-0.5 text-xs font-semibold text-[#00a9e0]">
                      {selectedInCat}
                    </span>
                  )}
                  <svg
                    className={`h-4 w-4 text-zinc-400 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </span>
              </button>

              {/* Expanded skills */}
              {isExpanded && (
                <div className="bg-zinc-50/50 px-3 pb-2.5">
                  {isOther ? (
                    <input
                      type="text"
                      value={otherText}
                      onChange={(e) => onOtherTextChange(e.target.value)}
                      placeholder="Describe your other skills..."
                      className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-[#00a9e0] focus:outline-none focus:ring-1 focus:ring-[#00a9e0]"
                    />
                  ) : (
                    <div className="space-y-1">
                      {cat.skills.map((skill) => {
                        const checked = selectedSkills.includes(skill.key);
                        return (
                          <button
                            key={skill.key}
                            type="button"
                            onClick={() => onToggleSkill(skill.key)}
                            className={`flex w-full items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-left text-sm transition-colors ${
                              checked
                                ? "bg-[#00a9e0]/5 text-[#00a9e0]"
                                : "text-zinc-700 hover:bg-zinc-100"
                            }`}
                          >
                            <div
                              className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-colors ${
                                checked
                                  ? "border-[#00a9e0] bg-[#00a9e0]"
                                  : "border-zinc-300 bg-white"
                              }`}
                            >
                              {checked && (
                                <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                              )}
                            </div>
                            {skill.label}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------

export default function OnboardingWizard({ role }: OnboardingWizardProps) {
  const [visible, setVisible] = useState(() => {
    if (typeof window === "undefined") return false;
    return !userStorage.get<boolean>("onboarding-complete");
  });
  const [step, setStep] = useState(0);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [data, setData] = useState<Record<string, any>>({});

  // Client subtype (read from localStorage)
  const [clientSubtype] = useState<string | null>(() => {
    if (typeof window === "undefined" || role !== "client") return null;
    const email = localStorage.getItem("sherpa-test-email") || "anonymous";
    const raw = localStorage.getItem(`sherpa:${email}:subtype`);
    if (!raw) return null;
    try { return JSON.parse(raw); } catch { return raw; }
  });

  const totalSteps = role === "pro" ? 4 : role === "pm" ? 3 : (() => {
    // Client: 2 base steps + 1 if subtype is residential_pro or commercial
    if (clientSubtype === "residential_pro" || clientSubtype === "commercial") return 3;
    return 2;
  })();

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

  // Toggle a skill in the selected skills array
  const toggleSkill = useCallback((key: string) => {
    setData((prev) => {
      const current: string[] = prev.selectedSkills || [];
      const next = current.includes(key)
        ? current.filter((k: string) => k !== key)
        : [...current, key];
      return { ...prev, selectedSkills: next };
    });
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

  // ---- Validation ----

  const canProceed = (() => {
    if (role === "pro" && step === 1) {
      // Must have at least 3 skills selected
      const skills: string[] = data.selectedSkills || [];
      return skills.length >= 3;
    }
    return true;
  })();

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
    // Step 0: Personal info
    if (step === 0) return (
      <div className="space-y-3">
        <Input label="Full Name" value={data.fullName || ""} onChange={(v) => set("fullName", v)} placeholder="Marcus Rivera" required />
        <Input label="Business Name" value={data.businessName || ""} onChange={(v) => set("businessName", v)} placeholder="Rivera Plumbing (optional)" />
        <Input label="Email" value={data.email || ""} onChange={(v) => set("email", v)} placeholder="marcus@email.com" type="email" required />
        <Input label="Phone" value={data.phone || ""} onChange={(v) => set("phone", v)} placeholder="(603) 555-0000" type="tel" />
      </div>
    );

    // Step 1: Skills checklist + experience + location
    if (step === 1) return (
      <div className="space-y-3">
        <SkillsChecklist
          selectedSkills={data.selectedSkills || []}
          onToggleSkill={toggleSkill}
          otherText={data.otherSkills || ""}
          onOtherTextChange={(v) => set("otherSkills", v)}
        />
        <Select label="Years of Experience" value={data.experience || ""} onChange={(v) => set("experience", v)} options={["1-3","4-7","8-15","15+"]} />
        <Input label="City" value={data.city || ""} onChange={(v) => set("city", v)} placeholder="Portsmouth" />
        <Select label="State" value={data.state || ""} onChange={(v) => set("state", v)} options={US_STATES} />
      </div>
    );

    // Step 2: Verification — photos + references
    if (step === 2) return (
      <div className="space-y-4">
        {/* Photos */}
        <div className="space-y-2">
          <label className="block text-xs font-medium text-zinc-600">
            Upload 3-5 photos of your past work
          </label>
          <p className="text-xs text-zinc-400">
            Describe or paste URLs for your work photos. File upload coming soon.
          </p>
          {[0, 1, 2, 3, 4].map((i) => {
            const photos: string[] = data.workPhotos || [];
            // Only show first 3 always, then 4th/5th if previous is filled
            if (i > 2 && !photos[i - 1]) return null;
            return (
              <input
                key={i}
                type="text"
                value={photos[i] || ""}
                onChange={(e) => {
                  const updated = [...(data.workPhotos || [])];
                  updated[i] = e.target.value;
                  set("workPhotos", updated);
                }}
                placeholder={`Photo ${i + 1} — URL or description`}
                className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-[#00a9e0] focus:outline-none focus:ring-1 focus:ring-[#00a9e0]"
              />
            );
          })}
        </div>

        {/* References */}
        <div className="space-y-2">
          <label className="block text-xs font-medium text-zinc-600">
            Add 2 references
          </label>
          {[0, 1].map((i) => {
            const refs: { name: string; phone: string; relationship: string }[] = data.references || [{}, {}];
            const ref = refs[i] || {};
            const updateRef = (field: string, val: string) => {
              const updated = [...(data.references || [{}, {}])];
              updated[i] = { ...(updated[i] || {}), [field]: val };
              set("references", updated);
            };
            return (
              <div key={i} className="rounded-lg border border-zinc-200 bg-zinc-50/50 p-3 space-y-2">
                <p className="text-xs font-medium text-zinc-500">Reference {i + 1}</p>
                <input
                  type="text"
                  value={ref.name || ""}
                  onChange={(e) => updateRef("name", e.target.value)}
                  placeholder="Name"
                  className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-[#00a9e0] focus:outline-none focus:ring-1 focus:ring-[#00a9e0]"
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="tel"
                    value={ref.phone || ""}
                    onChange={(e) => updateRef("phone", e.target.value)}
                    placeholder="Phone"
                    className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-[#00a9e0] focus:outline-none focus:ring-1 focus:ring-[#00a9e0]"
                  />
                  <input
                    type="text"
                    value={ref.relationship || ""}
                    onChange={(e) => updateRef("relationship", e.target.value)}
                    placeholder="Relationship"
                    className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-[#00a9e0] focus:outline-none focus:ring-1 focus:ring-[#00a9e0]"
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Status message */}
        <div className="rounded-lg bg-[#00a9e0]/5 border border-[#00a9e0]/20 px-4 py-3">
          <p className="text-sm text-[#00a9e0] font-medium">
            Your profile will be reviewed within 24 hours
          </p>
          <p className="mt-0.5 text-xs text-zinc-500">
            We verify all pros to ensure quality for our clients.
          </p>
        </div>
      </div>
    );

    // Step 3: Service radius + availability (was step 2)
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
    const hasSubtypeStep = clientSubtype === "residential_pro" || clientSubtype === "commercial";

    if (step === 0) return (
      <div className="space-y-3">
        <Input label="Full Name" value={data.fullName || ""} onChange={(v) => set("fullName", v)} placeholder="Jamie Davis" required />
        <Input label="Email" value={data.email || ""} onChange={(v) => set("email", v)} placeholder="jamie@email.com" type="email" required />
        <Input label="Phone" value={data.phone || ""} onChange={(v) => set("phone", v)} placeholder="(603) 555-0000" type="tel" />
        <Input label="City" value={data.city || ""} onChange={(v) => set("city", v)} placeholder="Nashua" />
        <Select label="State" value={data.state || ""} onChange={(v) => set("state", v)} options={US_STATES} />
      </div>
    );

    // Subtype-specific step (step 1 when applicable)
    if (hasSubtypeStep && step === 1) {
      if (clientSubtype === "residential_pro") {
        return (
          <div className="space-y-4">
            <RadioGroup
              label="How many properties do you own?"
              options={PROPERTY_COUNT_OPTIONS}
              value={data.propertyOwned || ""}
              onChange={(v) => set("propertyOwned", v)}
            />
          </div>
        );
      }
      // commercial
      return (
        <div className="space-y-4">
          <RadioGroup
            label="Type of business?"
            options={BUSINESS_TYPE_OPTIONS}
            value={data.businessType || ""}
            onChange={(v) => set("businessType", v)}
          />
        </div>
      );
    }

    // Final client step (property type + reason)
    return (
      <div className="space-y-4">
        <RadioGroup label="Property Type" options={CLIENT_PROPERTY_TYPES} value={data.propertyType || ""} onChange={(v) => set("propertyType", v)} />
        <RadioGroup label="What brings you here?" options={CLIENT_REASONS} value={data.reason || ""} onChange={(v) => set("reason", v)} />
      </div>
    );
  };

  const stepTitles: Record<Role, string[]> = {
    pm: ["Let's set up your account", "Tell us about your portfolio", "Almost done!"],
    pro: ["Welcome, Pro!", "Your skills", "Verify your work", "Service details"],
    client: clientSubtype === "residential_pro"
      ? ["Let's get you started", "Your properties", "What do you need?"]
      : clientSubtype === "commercial"
        ? ["Let's get you started", "Your business", "What do you need?"]
        : ["Let's get you started", "What do you need?"],
  };

  const ctaLabel = (() => {
    if (step < totalSteps - 1) return "Continue";
    if (role === "pm") return "Get Started";
    if (role === "pro") return "Start Finding Jobs";
    return "Find Pros";
  })();

  const renderStep = role === "pm" ? renderPMStep : role === "pro" ? renderProStep : renderClientStep;

  return createPortal(
    <div className="fixed inset-0 z-[9998] flex items-center justify-center p-4" aria-modal="true" role="dialog">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Card */}
      <div className="relative z-10 flex w-full max-w-md max-h-[90vh] flex-col rounded-2xl bg-white shadow-2xl">
        {/* Skip button */}
        <button
          type="button"
          onClick={skip}
          className="absolute right-4 top-4 z-10 text-xs text-zinc-400 hover:text-zinc-600 transition-colors"
        >
          {"I'll do this later"}
        </button>

        <div className="flex-1 overflow-y-auto p-6">
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

        {/* Footer — always visible at bottom */}
        <div className="flex shrink-0 items-center justify-between border-t border-zinc-100 px-6 py-4">
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
            disabled={!canProceed}
            onClick={() => {
              if (step < totalSteps - 1) setStep((s) => s + 1);
              else finish();
            }}
            className={`rounded-lg px-5 py-2 text-sm font-semibold text-white transition-colors ${
              canProceed
                ? "bg-[#00a9e0] hover:bg-[#0090c0]"
                : "bg-zinc-300 cursor-not-allowed"
            }`}
          >
            {ctaLabel}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
