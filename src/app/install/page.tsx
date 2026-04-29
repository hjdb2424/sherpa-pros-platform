import type { Metadata } from "next";
import Link from "next/link";

// Public TestFlight invite link from App Store Connect → TestFlight → External Testing.
// Override via NEXT_PUBLIC_TESTFLIGHT_URL env var if you need to swap (e.g. private testing).
const TESTFLIGHT_URL =
  process.env.NEXT_PUBLIC_TESTFLIGHT_URL || "https://testflight.apple.com/join/92511Beu";

export const metadata: Metadata = {
  title: "Install Sherpa Pros — Beta",
  description:
    "Get the Sherpa Pros app on your phone. Step-by-step install instructions for iOS (TestFlight), Android (PWA), and web.",
};

const PRO_FEATURES = [
  { icon: "🚫", title: "No lead fees", body: "We never charge to bid. You only pay a small service fee when the job is completed and the client pays." },
  { icon: "📍", title: "Sherpa Marketplace", body: "Vetted jobs from real clients. On-demand dispatch routes you to nearby work in real time." },
  { icon: "💬", title: "In-App Messaging", body: "Chat with clients in the app. Synced to SMS via Twilio so you never miss a message." },
  { icon: "🛡️", title: "Sherpa Score & Rewards", body: "Your 12-metric quality score grows with every job. Earn points redeemable for tools, gear, and gift cards." },
  { icon: "💰", title: "Finance Hub", body: "Track expenses, mileage, and quarterly estimates. 1099-ready when tax time hits." },
  { icon: "🌟", title: "Sherpa Flex (optional)", body: "Side-hustle pros welcome. No LLC required. Per-project insurance included. 18% fee covers everything." },
];

const CLIENT_FEATURES = [
  { icon: "📝", title: "Post the job in plain words", body: "Describe what you need + a few photos. Free, no card required." },
  { icon: "✅", title: "Code-Verified Quotes", body: "Every bid is validated against local building codes and market pricing before it reaches you. Right scope, right number, the first time." },
  { icon: "🛡️", title: "Marketplace Payment Protection", body: "Your payment is held until the work passes inspection. The pro gets paid when the job is done right. Your money stays protected." },
  { icon: "📦", title: "Materials Dispatch", body: "Materials ordered and delivered to the job site. No more supply runs." },
  { icon: "🤝", title: "Sherpa Success Manager", body: "A real human (not a chatbot) manages your project, handles vendor coordination, and makes sure the job finishes on time and on budget." },
  { icon: "🔧", title: "37 Service Categories", body: "251+ services from smart home to landscaping to finish carpentry. One platform for everything." },
];

const PM_FEATURES = [
  { icon: "🏢", title: "Combined Maintenance", body: "Kanban boards, schedules, and drill-down views across every unit and property." },
  { icon: "🔁", title: "Multi-Trade Coordination", body: "One job, multiple trades. We coordinate the handoffs so you don't have to." },
  { icon: "💵", title: "Finance Hub", body: "Track every dollar across every unit. 1099-ready exports for accounting." },
  { icon: "📸", title: "Smart Scan OCR", body: "Snap a receipt, scan a document. AI-powered document processing built in." },
  { icon: "🛡️", title: "Marketplace Payment Protection", body: "Milestone-based payments held until work is verified. No more chasing pros for fixes." },
  { icon: "🤝", title: "Sherpa Success Manager", body: "Dedicated account manager. Project oversight + dispute resolution baked in." },
];

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-700">
      {children}
    </span>
  );
}

function Step({ n, title, body }: { n: number; title: string; body: React.ReactNode }) {
  return (
    <li className="flex gap-4">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-zinc-900 text-sm font-semibold text-white">
        {n}
      </div>
      <div>
        <div className="text-base font-semibold text-zinc-900">{title}</div>
        <div className="mt-1 text-sm text-zinc-600">{body}</div>
      </div>
    </li>
  );
}

function FeatureRow({ icon, title, body }: { icon: string; title: string; body: string }) {
  return (
    <div className="flex gap-3">
      <div className="text-2xl leading-none">{icon}</div>
      <div>
        <div className="text-sm font-semibold text-zinc-900">{title}</div>
        <div className="text-sm text-zinc-600">{body}</div>
      </div>
    </div>
  );
}

export default function InstallPage() {
  const tfReady = !!TESTFLIGHT_URL;

  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="border-b border-zinc-200 bg-zinc-50 px-6 py-14">
        <div className="mx-auto max-w-3xl">
          <Badge>Beta · Invite only</Badge>
          <h1 className="mt-4 text-4xl font-bold tracking-tight text-zinc-900 sm:text-5xl">
            Install Sherpa Pros
          </h1>
          <p className="mt-2 text-base font-medium text-[#00a9e0]">
            Trade work, done right. One place for the hire, the work, and the money.
          </p>
          <p className="mt-4 text-lg leading-relaxed text-zinc-600">
            You've been invited to test our beta. Pick your phone below and follow the steps.
            iOS testers use <strong>TestFlight</strong> (Apple's official beta app).
            Android testers use the <strong>web app</strong> for now — a native Android build is coming.
          </p>
        </div>
      </section>

      {/* iOS / TestFlight */}
      <section className="border-b border-zinc-200 px-6 py-14">
        <div className="mx-auto max-w-3xl">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold text-zinc-900">iPhone &amp; iPad</h2>
            <Badge>via TestFlight</Badge>
          </div>

          <div className="mt-4 rounded-xl border border-zinc-200 bg-zinc-50 p-5">
            <div className="text-sm font-semibold text-zinc-900">What is TestFlight?</div>
            <p className="mt-2 text-sm text-zinc-600">
              TestFlight is Apple's free beta-testing app. It lets you install pre-release apps that
              aren't on the App Store yet. Apple reviews every TestFlight build, and you can share
              feedback or screenshots straight from the app.
            </p>
          </div>

          <ol className="mt-6 space-y-5">
            <Step
              n={1}
              title="Install the TestFlight app"
              body={
                <>
                  Tap{" "}
                  <a
                    href="https://apps.apple.com/us/app/testflight/id899247664"
                    className="font-medium text-[#00a9e0] hover:underline"
                  >
                    here to install TestFlight from the App Store
                  </a>{" "}
                  (free). It's made by Apple.
                </>
              }
            />
            <Step
              n={2}
              title="Open the Sherpa Pros invite link"
              body={
                tfReady ? (
                  <>
                    Tap this link on your iPhone:{" "}
                    <a
                      href={TESTFLIGHT_URL}
                      className="font-medium break-all text-[#00a9e0] hover:underline"
                    >
                      {TESTFLIGHT_URL}
                    </a>
                  </>
                ) : (
                  <span className="text-amber-700">
                    The TestFlight invite link will appear here once we publish the build.
                    For now, reply to your invite email and we'll send you the link directly.
                  </span>
                )
              }
            />
            <Step
              n={3}
              title="Tap &quot;Accept&quot;, then &quot;Install&quot;"
              body="TestFlight will download Sherpa Pros to your home screen. The icon shows an orange dot until the next update."
            />
            <Step
              n={4}
              title="Open Sherpa Pros"
              body={
                <>
                  Sign in with the same email you got your invite to (also lets you continue with Google).
                  Pick your role on first launch — <strong>Pro</strong>, <strong>Client</strong>, or
                  <strong> Property Manager</strong>.
                </>
              }
            />
          </ol>

          <div className="mt-6 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
            <strong>Heads up:</strong> TestFlight builds expire after 90 days. We'll push fresh builds
            every couple of weeks during beta — just open TestFlight and tap Update.
          </div>

          {/* What to expect */}
          <div className="mt-8 rounded-xl border border-zinc-200 bg-white p-6">
            <h3 className="text-base font-semibold text-zinc-900">What to expect (heads-up before you start)</h3>
            <ul className="mt-3 space-y-3 text-sm text-zinc-700">
              <li>
                <strong>If you don't already have TestFlight,</strong> tapping our invite link the first
                time will land on an Apple page that says "this beta isn't available yet." Don't panic —
                that's Apple telling you to install the TestFlight app first. Tap{" "}
                <em>View in App Store</em> on that page → install TestFlight (free, ~10 sec) → then{" "}
                <strong>come back to your invite email and tap our link again</strong>. The second tap
                opens TestFlight directly with the Sherpa Pros invite. This re-tap step trips most
                people up — totally normal.
              </li>
              <li>
                <strong>On a non-iPhone device</strong> (laptop, Android), the invite link won't do
                anything useful. Email or text it to yourself and open it on your iPhone, or use the
                web app at{" "}
                <a href="https://thesherpapros.com/sign-in" className="font-medium text-[#00a9e0] hover:underline">
                  thesherpapros.com/sign-in
                </a>{" "}
                instead.
              </li>
              <li>
                <strong>First launch of the app</strong> asks you to pick a role (Pro / Client /
                Property Manager). Pick whichever matches how you'll use the app — you can switch later
                if you wear multiple hats.
              </li>
              <li>
                <strong>The app icon shows a small orange dot</strong> for the first day or two
                after install. That's TestFlight's way of marking it as a beta build. Normal, ignore.
              </li>
              <li>
                <strong>If you see &quot;this build has expired&quot;</strong> down the road, open
                TestFlight, find Sherpa Pros, tap Update. Apple expires beta builds every 90 days;
                we push fresh ones every couple of weeks.
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Android / PWA */}
      <section className="border-b border-zinc-200 bg-zinc-50 px-6 py-14">
        <div className="mx-auto max-w-3xl">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold text-zinc-900">Android</h2>
            <Badge>via web app (PWA)</Badge>
          </div>

          <p className="mt-4 text-zinc-600">
            A native Android app is coming via Google Play internal testing. While we wait, you'll
            install the web app to your home screen — it works like a real app: full-screen, app icon,
            push notifications.
          </p>

          <ol className="mt-6 space-y-5">
            <Step
              n={1}
              title="Open the site in Chrome on your Android phone"
              body={
                <>
                  Visit{" "}
                  <a
                    href="https://thesherpapros.com"
                    className="font-medium text-[#00a9e0] hover:underline"
                  >
                    thesherpapros.com
                  </a>{" "}
                  in Chrome.
                </>
              }
            />
            <Step
              n={2}
              title="Tap the menu (⋮) → &quot;Install app&quot;"
              body="Chrome offers an Install option once the page loads. Some phones say &quot;Add to Home Screen&quot; instead — same thing."
            />
            <Step
              n={3}
              title="Open it from your home screen"
              body="Sherpa Pros now lives next to your other apps. Sign in with the email you were invited to."
            />
          </ol>

          <div className="mt-6 rounded-lg border border-zinc-200 bg-white p-4 text-sm text-zinc-600">
            iPhone users can also install the PWA — Safari → Share → Add to Home Screen — but
            <strong> TestFlight is the recommended path on iOS</strong> because it gets push
            notifications and works better with iOS-specific features.
          </div>
        </div>
      </section>

      {/* What you'll see */}
      <section className="border-b border-zinc-200 px-6 py-14">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-2xl font-bold text-zinc-900">What you'll see in the app</h2>
          <p className="mt-2 text-zinc-600">
            The app adapts to your role. Pick the section that matches you.
          </p>

          <div className="mt-8 grid gap-10 lg:grid-cols-3">
            <div>
              <div className="mb-3 text-sm font-semibold uppercase tracking-wider text-[#00a9e0]">
                If you're a Pro
              </div>
              <div className="space-y-4">
                {PRO_FEATURES.map((f) => (
                  <FeatureRow key={f.title} {...f} />
                ))}
              </div>
            </div>
            <div>
              <div className="mb-3 text-sm font-semibold uppercase tracking-wider text-emerald-600">
                If you're a Homeowner / Client
              </div>
              <div className="space-y-4">
                {CLIENT_FEATURES.map((f) => (
                  <FeatureRow key={f.title} {...f} />
                ))}
              </div>
            </div>
            <div>
              <div className="mb-3 text-sm font-semibold uppercase tracking-wider text-amber-600">
                If you're a Property Manager
              </div>
              <div className="space-y-4">
                {PM_FEATURES.map((f) => (
                  <FeatureRow key={f.title} {...f} />
                ))}
              </div>
            </div>
          </div>

          <div className="mt-10 rounded-xl border border-zinc-200 bg-zinc-50 p-5 text-sm text-zinc-700">
            <strong>The Sherpa Ecosystem:</strong> Marketplace (live), Hub (coming soon — physical
            pickup + tool rental), Home (coming soon — homeowner subscription), and Sherpa Success
            Manager (live — your dedicated human account manager).
          </div>
        </div>
      </section>

      {/* Web fallback */}
      <section className="border-b border-zinc-200 bg-zinc-50 px-6 py-14">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-2xl font-bold text-zinc-900">Or just use the web</h2>
          <p className="mt-3 text-zinc-600">
            The full platform is also available in any browser at{" "}
            <a href="https://thesherpapros.com/sign-in" className="font-medium text-[#00a9e0] hover:underline">
              thesherpapros.com/sign-in
            </a>
            . Same data, same features. Use this if you don't want to install anything yet — you can
            always switch to the app later.
          </p>
        </div>
      </section>

      {/* Help */}
      <section className="px-6 py-14">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-2xl font-bold text-zinc-900">Stuck?</h2>
          <p className="mt-3 text-zinc-600">
            Reply to your invite email or write to{" "}
            <a href="mailto:info@thesherpapros.com" className="font-medium text-[#00a9e0] hover:underline">
              info@thesherpapros.com
            </a>
            . We're a small team; you'll usually hear back the same day.
          </p>
          <p className="mt-6 text-sm text-zinc-500">
            <Link href="/" className="hover:underline">
              ← Back to thesherpapros.com
            </Link>
          </p>
        </div>
      </section>
    </div>
  );
}
