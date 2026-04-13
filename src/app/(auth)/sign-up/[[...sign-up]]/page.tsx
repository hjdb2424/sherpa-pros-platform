import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1a1a2e] px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white tracking-tight">
            Sherpa Pros
          </h1>
          <p className="mt-2 text-sm text-gray-400">
            Create your account
          </p>
        </div>
        <SignUp
          appearance={{
            elements: {
              rootBox: "mx-auto w-full",
              card: "bg-white/5 border border-white/10 shadow-2xl backdrop-blur-sm",
              headerTitle: "text-white",
              headerSubtitle: "text-gray-400",
              formButtonPrimary:
                "bg-amber-500 hover:bg-amber-600 text-[#1a1a2e] font-semibold",
              formFieldInput:
                "bg-white/10 border-white/20 text-white placeholder:text-gray-500",
              formFieldLabel: "text-gray-300",
              footerActionLink: "text-amber-500 hover:text-amber-400",
              identityPreviewEditButton: "text-amber-500",
              socialButtonsBlockButton:
                "border-white/20 text-white hover:bg-white/10",
              socialButtonsBlockButtonText: "text-white",
              dividerLine: "bg-white/20",
              dividerText: "text-gray-500",
            },
          }}
        />
      </div>
    </div>
  );
}
