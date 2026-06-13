import { BeOneLogo } from "@analytics/components/brand/BeOneLogo";
import { PlatformBrandLogo } from "@analytics/components/brand/PlatformBrandLogo";

export function ClientBrandStack() {
  return (
    <div className="flex flex-col gap-4">
      <BeOneLogo />
      <div className="border-t border-brand-border pt-4">
        <PlatformBrandLogo showTagline />
      </div>
    </div>
  );
}
