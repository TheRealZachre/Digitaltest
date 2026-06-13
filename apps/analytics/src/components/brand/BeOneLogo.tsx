const BEONE_LOGO = "/brand/beone-medicines-logo.png";

export function BeOneLogo() {
  return (
    <div className="rounded-lg bg-white px-3 py-2">
      <img
        src={BEONE_LOGO}
        alt="BeOne Medicines"
        width={160}
        height={40}
        className="mx-auto h-8 w-auto max-w-full"
      />
      <p className="mt-1.5 text-center text-[10px] font-semibold uppercase tracking-[0.25em] text-slate-500">
        DEMO
      </p>
    </div>
  );
}
