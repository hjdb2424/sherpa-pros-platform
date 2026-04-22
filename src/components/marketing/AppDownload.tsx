'use client';

import ScrollReveal from './ScrollReveal';

export default function AppDownload() {
  return (
    <ScrollReveal delay={100}>
      <section
        id="download-app"
        className="relative overflow-hidden bg-zinc-900 px-4 py-20 sm:px-6 sm:py-28 lg:px-8"
      >
        {/* Decorative glow */}
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <div className="absolute -left-32 top-1/2 h-[400px] w-[400px] -translate-y-1/2 rounded-full bg-[#00a9e0]/8 blur-3xl" />
          <div className="absolute -right-32 bottom-0 h-[300px] w-[300px] rounded-full bg-[#ff4500]/6 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            {/* Left — text + buttons */}
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-sky-500/30 bg-sky-500/10 px-4 py-1.5">
                <span className="text-xs font-medium text-sky-400 sm:text-sm">
                  Now Available
                </span>
              </div>

              <h2 className="mt-6 text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
                The Sherpa Pros App
              </h2>

              <p className="mt-4 max-w-lg text-lg leading-relaxed text-zinc-400">
                Everything you need, right in your pocket. Post jobs, find pros,
                track deliveries — all from your phone.
              </p>

              {/* App store buttons */}
              <div className="mt-8 flex flex-wrap gap-4">
                {/* Apple App Store */}
                <a
                  href="https://apps.apple.com/app/sherpa-pros/id0000000000"
                  className="inline-flex items-center gap-3 rounded-xl border border-zinc-700 bg-black px-5 py-3 shadow-lg transition-all hover:border-zinc-500 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00a9e0] focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-900"
                  aria-label="Download on the App Store"
                >
                  <svg
                    className="h-7 w-7 text-white"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                  </svg>
                  <div>
                    <div className="text-[10px] leading-tight text-zinc-400">
                      Download on the
                    </div>
                    <div className="text-base font-semibold leading-tight text-white">
                      App Store
                    </div>
                  </div>
                </a>

                {/* Google Play */}
                <a
                  href="https://play.google.com/store/apps/details?id=com.sherpapros.app"
                  className="inline-flex items-center gap-3 rounded-xl border border-zinc-700 bg-black px-5 py-3 shadow-lg transition-all hover:border-zinc-500 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00a9e0] focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-900"
                  aria-label="Get it on Google Play"
                >
                  <svg
                    className="h-7 w-7 text-white"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M3.18 23.72c.37.2.82.24 1.23.03l11.51-6.55-2.84-2.84L3.18 23.72zm-.55-1.21V1.49c0-.35.14-.66.38-.87L13.04 12 3.01 23.38a1.04 1.04 0 01-.38-.87zm17.24-7.65l-3.22-1.83-3.03 3.03 3.03 3.03 3.22-1.83c.9-.51.9-1.89 0-2.4zM4.41.06L15.92 6.6l-2.84 2.84L4.41.06z" />
                  </svg>
                  <div>
                    <div className="text-[10px] leading-tight text-zinc-400">
                      Get it on
                    </div>
                    <div className="text-base font-semibold leading-tight text-white">
                      Google Play
                    </div>
                  </div>
                </a>
              </div>

              <p className="mt-4 text-sm text-zinc-500">
                Available on iOS and Android
              </p>
            </div>

            {/* Right — phone mockup */}
            <div className="flex justify-center lg:justify-end">
              <div className="relative">
                {/* Phone frame */}
                <div className="relative h-[560px] w-[280px] overflow-hidden rounded-[40px] border-[6px] border-zinc-700 bg-zinc-800 shadow-2xl shadow-black/40">
                  {/* Notch */}
                  <div className="absolute left-1/2 top-2 z-10 h-6 w-24 -translate-x-1/2 rounded-full bg-zinc-900" />

                  {/* Screen content */}
                  <div className="flex h-full flex-col bg-zinc-950">
                    {/* Status bar */}
                    <div className="flex items-center justify-between px-6 pb-1 pt-10">
                      <span className="text-[10px] font-medium text-zinc-400">
                        9:41
                      </span>
                      <div className="flex items-center gap-1">
                        <div className="h-2 w-2 rounded-full bg-emerald-400" />
                        <div className="h-2 w-4 rounded-sm border border-zinc-500">
                          <div className="h-full w-3/4 rounded-sm bg-emerald-400" />
                        </div>
                      </div>
                    </div>

                    {/* App header */}
                    <div className="flex items-center justify-between px-4 py-2">
                      <div>
                        <p className="text-sm font-bold text-white">
                          Sherpa<span className="text-[#ff4500]">Pros</span>
                        </p>
                        <p className="text-[10px] text-zinc-500">
                          3 pros nearby
                        </p>
                      </div>
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#00a9e0]">
                        <svg
                          className="h-3.5 w-3.5 text-white"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          aria-hidden="true"
                        >
                          <path
                            fillRule="evenodd"
                            d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    </div>

                    {/* Map area */}
                    <div className="relative flex-1 bg-zinc-900">
                      {/* Map grid lines */}
                      <div className="absolute inset-0 opacity-10" aria-hidden="true">
                        {[...Array(6)].map((_, i) => (
                          <div
                            key={`h-${i}`}
                            className="absolute h-px w-full bg-zinc-400"
                            style={{ top: `${(i + 1) * 14}%` }}
                          />
                        ))}
                        {[...Array(4)].map((_, i) => (
                          <div
                            key={`v-${i}`}
                            className="absolute top-0 h-full w-px bg-zinc-400"
                            style={{ left: `${(i + 1) * 20}%` }}
                          />
                        ))}
                      </div>

                      {/* Road lines */}
                      <div className="absolute inset-0" aria-hidden="true">
                        <div className="absolute left-[15%] top-0 h-full w-[2px] bg-zinc-700" />
                        <div className="absolute left-0 top-[40%] h-[2px] w-full bg-zinc-700" />
                        <div className="absolute left-[55%] top-0 h-full w-[2px] bg-zinc-700 rotate-[15deg] origin-top" />
                        <div className="absolute left-0 top-[65%] h-[2px] w-[70%] bg-zinc-700" />
                      </div>

                      {/* Pro pins */}
                      <div
                        className="absolute left-[25%] top-[22%] flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-[#00a9e0] shadow-lg shadow-[#00a9e0]/30"
                        aria-label="Pro marker"
                      >
                        <svg
                          className="h-4 w-4 text-white"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          aria-hidden="true"
                        >
                          <path d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.381z" />
                        </svg>
                      </div>
                      <div
                        className="absolute left-[60%] top-[35%] flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-emerald-500 shadow-lg shadow-emerald-500/30"
                        aria-label="Pro marker"
                      >
                        <svg
                          className="h-4 w-4 text-white"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          aria-hidden="true"
                        >
                          <path d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.381z" />
                        </svg>
                      </div>
                      <div
                        className="absolute left-[40%] top-[52%] flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-[#ff4500] shadow-lg shadow-[#ff4500]/30"
                        aria-label="Pro marker"
                      >
                        <svg
                          className="h-4 w-4 text-white"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          aria-hidden="true"
                        >
                          <path d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.381z" />
                        </svg>
                      </div>

                      {/* User location pulse */}
                      <div className="absolute left-[45%] top-[40%]" aria-label="Your location">
                        <div className="h-3 w-3 rounded-full border-2 border-white bg-[#00a9e0] shadow-md" />
                        <div className="absolute -inset-2 animate-ping rounded-full bg-[#00a9e0]/30" />
                      </div>

                      {/* Bottom sheet peek */}
                      <div className="absolute inset-x-0 bottom-0 rounded-t-2xl border-t border-zinc-700 bg-zinc-900/95 px-4 pb-4 pt-3 backdrop-blur-sm">
                        <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-zinc-600" />
                        <p className="text-xs font-semibold text-white">
                          Nearby Pros
                        </p>
                        <div className="mt-2 space-y-2">
                          {[
                            {
                              name: 'Mike R.',
                              trade: 'Electrician',
                              rating: '4.9',
                              color: 'bg-[#00a9e0]',
                            },
                            {
                              name: 'Sarah K.',
                              trade: 'Plumber',
                              rating: '4.8',
                              color: 'bg-emerald-500',
                            },
                          ].map((pro) => (
                            <div
                              key={pro.name}
                              className="flex items-center gap-2 rounded-lg bg-zinc-800 px-3 py-2"
                            >
                              <div
                                className={`flex h-6 w-6 items-center justify-center rounded-full ${pro.color} text-[10px] font-bold text-white`}
                              >
                                {pro.name[0]}
                              </div>
                              <div className="flex-1">
                                <p className="text-[11px] font-medium text-white">
                                  {pro.name}
                                </p>
                                <p className="text-[9px] text-zinc-500">
                                  {pro.trade}
                                </p>
                              </div>
                              <div className="flex items-center gap-0.5">
                                <svg
                                  className="h-2.5 w-2.5 text-amber-400"
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                  aria-hidden="true"
                                >
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                                <span className="text-[10px] font-medium text-zinc-400">
                                  {pro.rating}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Reflection glow */}
                <div
                  className="absolute -inset-4 -z-10 rounded-[48px] bg-[#00a9e0]/5 blur-2xl"
                  aria-hidden="true"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </ScrollReveal>
  );
}
