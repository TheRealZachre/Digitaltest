import { BRAND_ASSETS } from "@/lib/brand";
import { PLATFORM_TAGLINE } from "@/lib/company";

export function PlatformBrandLogo({ showTagline = true }: { showTagline?: boolean }) {
  return (
    <div className="min-w-0">
      <img
        src={BRAND_ASSETS.wordmarkWhite}
        alt="Vibe. Code. Flow."
        width={220}
        height={36}
        className="h-7 w-auto max-w-[11.5rem]"
      />
      {showTagline && (
        <p className="mt-1.5 text-[11px] font-medium tracking-wide text-brand-muted">
          {PLATFORM_TAGLINE}
        </p>
      )}
    </div>
  );
}
