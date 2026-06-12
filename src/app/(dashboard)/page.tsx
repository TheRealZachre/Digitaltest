import Link from "next/link";
import {
  ArrowLeftRight,
  ArrowRight,
  Clapperboard,
  Crown,
  ExternalLink,
  FileBarChart,
  Globe,
  LineChart,
  Mic2,
  Radar,
  ShieldAlert,
  Video,
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { BrandSignalAnimated } from "@/components/brand/BrandSignalAnimated";
import { PLATFORM_NAME, PLATFORM_TAGLINE } from "@/lib/company";

const analyticsUrl =
  process.env.NEXT_PUBLIC_ANALYTICS_URL ?? "http://localhost:3001";

const modules = [
  {
    href: analyticsUrl,
    external: true,
    title: "Analytics",
    description:
      "Weekly, monthly, and quarterly reports with channel breakdowns, creative previews, and scoring methodology.",
    icon: FileBarChart,
    color: "border-brand-indigo/20 bg-brand-indigo/5",
    iconColor: "text-brand-indigo",
  },
  {
    href: "/youtube",
    title: "YouTube SEO Optimizer",
    description: "Channel analysis, video SEO scoring, and optimization packages.",
    icon: Video,
    color: "border-red-200 bg-red-50",
    iconColor: "text-red-600",
  },
  {
    href: "/website-seo",
    title: "Website SEO Audit",
    description: "Technical audits, search coverage, and remediation output.",
    icon: Globe,
    color: "border-sky-200 bg-sky-50",
    iconColor: "text-sky-600",
  },
  {
    href: "/reputation",
    title: "Reputation Early Warning",
    description: "Sentiment drift monitoring and Slack alerts.",
    icon: ShieldAlert,
    color: "border-amber-200 bg-amber-50",
    iconColor: "text-amber-600",
  },
  {
    href: "/cross-channel",
    title: "Cross-Channel Orchestration",
    description: "Amplification recommendations across LinkedIn, Instagram, X, and YouTube.",
    icon: ArrowLeftRight,
    color: "border-violet-200 bg-violet-50",
    iconColor: "text-violet-600",
  },
  {
    href: "/predictive",
    title: "Predictive Performance",
    description: "Draft posts and compare predicted engagement variants.",
    icon: LineChart,
    color: "border-emerald-200 bg-emerald-50",
    iconColor: "text-emerald-600",
  },
  {
    href: "/media-monitor",
    title: "Media Monitor",
    description: "News and social mention search across subjects and executives.",
    icon: Radar,
    color: "border-orange-200 bg-orange-50",
    iconColor: "text-orange-600",
  },
  {
    href: "/csuite",
    title: "C-Suite Content Engine",
    description: "Executive thought leadership drafts calibrated to voice profiles.",
    icon: Crown,
    color: "border-yellow-200 bg-yellow-50",
    iconColor: "text-yellow-700",
  },
  {
    href: "/voice-training",
    title: "Voice Profile Training",
    description: "Train and draft in an executive's authentic voice.",
    icon: Mic2,
    color: "border-pink-200 bg-pink-50",
    iconColor: "text-pink-600",
  },
  {
    href: "/video-production",
    title: "AI Video Production",
    description: "Studio workflows, distribution plans, and capability specs.",
    icon: Clapperboard,
    color: "border-slate-200 bg-slate-50",
    iconColor: "text-slate-700",
  },
];

export default function HomePage() {
  return (
    <>
      <Header
        title={PLATFORM_TAGLINE}
        subtitle={`${PLATFORM_NAME} · Operations hub`}
      />

      <div className="space-y-8 p-8">
        <section className="overflow-hidden rounded-xl border border-brand-ink/10 bg-brand-stage p-6 shadow-sm">
          <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
            <div className="max-w-3xl">
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-brand-muted">
                {PLATFORM_NAME}
              </p>
              <h2 className="mt-2 text-xl font-semibold text-brand-off-white">
                Welcome back
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-brand-muted">
                Analytics now lives in a dedicated app. Use the modules below
                for SEO, reputation, orchestration, and executive content tools.
              </p>
            </div>
            <BrandSignalAnimated className="mx-auto h-28 w-28 lg:mx-0" />
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {modules.map((module) => {
            const Icon = module.icon;
            const className = `group block rounded-xl border p-5 shadow-sm transition hover:shadow-md ${module.color}`;

            const content = (
              <>
                <div className="flex items-start justify-between gap-3">
                  <div
                    className={`rounded-lg bg-white/80 p-2.5 ${module.iconColor}`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  {module.external ? (
                    <ExternalLink className="h-4 w-4 text-slate-400" />
                  ) : (
                    <ArrowRight className="h-4 w-4 text-slate-400 transition group-hover:translate-x-0.5" />
                  )}
                </div>
                <h3 className="mt-4 text-lg font-semibold text-slate-900">
                  {module.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  {module.description}
                </p>
              </>
            );

            return module.external ? (
              <a
                key={module.title}
                href={module.href}
                target="_blank"
                rel="noopener noreferrer"
                className={className}
              >
                {content}
              </a>
            ) : (
              <Link key={module.title} href={module.href} className={className}>
                {content}
              </Link>
            );
          })}
        </section>
      </div>
    </>
  );
}
