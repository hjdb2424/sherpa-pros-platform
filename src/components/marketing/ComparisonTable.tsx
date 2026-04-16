import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/solid';

interface Row {
  feature: string;
  others: string;
  sherpa: string;
  othersNegative: boolean;
}

const rows: Row[] = [
  {
    feature: 'Lead sharing',
    others: 'Sold to 5-8 contractors',
    sherpa: 'Exclusive matches',
    othersNegative: true,
  },
  {
    feature: 'Verification',
    others: 'Pay to be listed',
    sherpa: 'Vetted: license + insurance + background',
    othersNegative: true,
  },
  {
    feature: 'Pricing',
    others: 'You guess',
    sherpa: 'AI validates every budget and bid',
    othersNegative: true,
  },
  {
    feature: 'Payment',
    others: 'You figure it out',
    sherpa: 'Escrow protection for both sides',
    othersNegative: true,
  },
  {
    feature: 'Support',
    others: 'Email a form',
    sherpa: 'Regional office + AI concierge',
    othersNegative: true,
  },
];

export default function ComparisonTable() {
  return (
    <section className="bg-slate-50 px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <h2 className="text-center text-3xl font-bold text-zinc-900 sm:text-4xl">
          The Sherpa Pros Difference
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-center text-lg text-zinc-600">
          Not all marketplaces are created equal. See how we compare.
        </p>

        {/* Desktop table */}
        <div className="mt-12 hidden overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm sm:block">
          <table className="w-full" role="table">
            <thead>
              <tr className="border-b border-zinc-200 bg-zinc-50">
                <th className="px-6 py-4 text-left text-sm font-semibold text-zinc-900">
                  Feature
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-zinc-500">
                  Other Platforms
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#00a9e0]">
                  Sherpa Pros
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr
                  key={row.feature}
                  className={`transition-colors hover:bg-zinc-50 ${
                    i < rows.length - 1 ? 'border-b border-zinc-100' : ''
                  }`}
                >
                  <td className="px-6 py-4 text-sm font-medium text-zinc-900">
                    {row.feature}
                  </td>
                  <td className="px-6 py-4 text-sm text-zinc-500">
                    <span className="flex items-center gap-2">
                      <XCircleIcon
                        className="h-5 w-5 shrink-0 text-red-400"
                        aria-hidden="true"
                      />
                      {row.others}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-zinc-900">
                    <span className="flex items-center gap-2">
                      <CheckCircleIcon
                        className="h-5 w-5 shrink-0 text-emerald-500"
                        aria-hidden="true"
                      />
                      {row.sherpa}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile cards */}
        <div className="mt-12 space-y-4 sm:hidden">
          {rows.map((row) => (
            <div
              key={row.feature}
              className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm"
            >
              <div className="text-sm font-semibold text-zinc-900">
                {row.feature}
              </div>
              <div className="mt-3 flex items-start gap-2 text-sm text-zinc-500">
                <XCircleIcon
                  className="mt-0.5 h-4 w-4 shrink-0 text-red-400"
                  aria-hidden="true"
                />
                <span>
                  <span className="font-medium text-zinc-400">Others: </span>
                  {row.others}
                </span>
              </div>
              <div className="mt-2 flex items-start gap-2 text-sm text-zinc-900">
                <CheckCircleIcon
                  className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500"
                  aria-hidden="true"
                />
                <span>
                  <span className="font-medium text-[#00a9e0]">
                    Sherpa Pros:{' '}
                  </span>
                  {row.sherpa}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
