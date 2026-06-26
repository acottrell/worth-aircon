import { Fan, Snowflake, Check, X, Volume2, VolumeX, Shield } from "lucide-react";

function PortableUnitSvg() {
  return (
    <svg viewBox="0 0 120 160" className="w-24 h-32" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Body */}
      <rect x="25" y="10" width="70" height="120" rx="8" className="fill-muted stroke-muted-foreground/30" strokeWidth="1.5" />
      {/* Top vents */}
      <rect x="38" y="20" width="44" height="8" rx="4" className="fill-background" />
      {/* Control panel */}
      <rect x="42" y="38" width="36" height="4" rx="2" className="fill-muted-foreground/20" />
      <circle cx="48" cy="50" r="2.5" className="fill-primary/40" />
      <circle cx="58" cy="50" r="2.5" className="fill-muted-foreground/15" />
      <circle cx="68" cy="50" r="2.5" className="fill-muted-foreground/15" />
      {/* Front vent */}
      <rect x="35" y="62" width="50" height="55" rx="4" className="fill-background" />
      {/* Vent lines */}
      {[0, 1, 2, 3, 4, 5, 6].map((i) => (
        <line key={i} x1="40" y1={68 + i * 7} x2="75" y2={68 + i * 7} className="stroke-muted-foreground/15" strokeWidth="1" />
      ))}
      {/* Wheels */}
      <circle cx="42" cy="138" r="6" className="fill-muted-foreground/20 stroke-muted-foreground/30" strokeWidth="1" />
      <circle cx="78" cy="138" r="6" className="fill-muted-foreground/20 stroke-muted-foreground/30" strokeWidth="1" />
      {/* Hose coming out the back */}
      <path d="M 95 70 C 105 70, 110 65, 112 55 C 114 45, 118 40, 118 30" className="stroke-muted-foreground/40" strokeWidth="6" strokeLinecap="round" fill="none" />
    </svg>
  );
}

function SplitUnitSvg() {
  return (
    <svg viewBox="0 0 160 120" className="w-32 h-24" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Wall line */}
      <line x1="10" y1="20" x2="150" y2="20" className="stroke-muted-foreground/15" strokeWidth="1" strokeDasharray="4 3" />
      {/* Main body */}
      <rect x="20" y="25" width="120" height="40" rx="6" className="fill-muted stroke-muted-foreground/30" strokeWidth="1.5" />
      {/* Top edge detail */}
      <rect x="20" y="25" width="120" height="6" rx="3" className="fill-muted-foreground/10" />
      {/* Display */}
      <rect x="62" y="35" width="18" height="6" rx="2" className="fill-primary/30" />
      {/* Bottom vent */}
      <path d="M 25 60 Q 80 72, 135 60" className="stroke-muted-foreground/20" strokeWidth="1" fill="none" />
      <path d="M 28 57 Q 80 68, 132 57" className="stroke-muted-foreground/15" strokeWidth="1" fill="none" />
      {/* Air flow lines */}
      <path d="M 50 70 C 50 82, 45 90, 40 100" className="stroke-primary/25" strokeWidth="1.5" strokeDasharray="3 3" fill="none" />
      <path d="M 80 72 C 80 84, 78 92, 75 102" className="stroke-primary/25" strokeWidth="1.5" strokeDasharray="3 3" fill="none" />
      <path d="M 110 70 C 110 82, 112 90, 115 100" className="stroke-primary/25" strokeWidth="1.5" strokeDasharray="3 3" fill="none" />
    </svg>
  );
}

function formatPostcodeForUrl(postcode: string): string {
  return postcode.toLowerCase().replace(/\s+/g, "");
}

interface AirconOptionsProps {
  postcode?: string | null;
}

export function AirconOptions({ postcode }: AirconOptionsProps) {
  const trustedTradersUrl = postcode
    ? `https://trustedtraders.which.co.uk/air-conditioning-in-${formatPostcodeForUrl(postcode)}/?sort_type=distance`
    : "https://trustedtraders.which.co.uk/";
  return (
    <section className="space-y-6">
      <h2 className="text-lg font-heading font-semibold">
        Your options
      </h2>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-lg border bg-card overflow-hidden">
          <div className="bg-muted/60 p-6 flex items-center justify-center">
            <PortableUnitSvg />
          </div>
          <div className="p-5 space-y-4">
            <div className="flex items-center gap-2">
              <Fan className="h-5 w-5 text-blue-500" />
              <h3 className="font-heading font-semibold">Portable unit</h3>
            </div>

            <p className="text-sm text-muted-foreground">
              A freestanding box on wheels. Plug it in, run the hose out
              a window or door, and go.
            </p>

            <ul className="text-sm space-y-2">
              <li className="flex gap-2">
                <Check className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                <span className="text-muted-foreground">No installation, just unbox and use</span>
              </li>
              <li className="flex gap-2">
                <Check className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                <span className="text-muted-foreground">£250 to £600</span>
              </li>
              <li className="flex gap-2">
                <Check className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                <span className="text-muted-foreground">Move it between rooms</span>
              </li>
              <li className="flex gap-2">
                <X className="h-4 w-4 text-orange-500 shrink-0 mt-0.5" />
                <span className="text-muted-foreground">
                  Might need a window/door kit for the exhaust hose (~£15 to £30)
                </span>
              </li>
            </ul>

            <div className="rounded-md bg-muted/50 p-3 space-y-1.5">
              <div className="flex items-center gap-1.5">
                <Volume2 className="h-3.5 w-3.5 text-orange-500" />
                <span className="text-xs font-medium">Noise: 50 to 65 dB</span>
              </div>
              <p className="text-xs text-muted-foreground">
                About as loud as a conversation or a desk fan on high.
                You will hear it at night.
              </p>
              <a
                href="https://youtu.be/fZh1mvWNNUo?t=267"
                className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:text-primary/80 transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Volume2 className="h-3 w-3" />
                Hear what one sounds like →
              </a>
            </div>

            <div className="pt-2 border-t space-y-1.5">
              <p className="text-xs font-medium">Compare prices:</p>
              <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs">
                <a
                  href="https://www.which.co.uk/reviews/air-conditioners"
                  className="text-muted-foreground underline decoration-border hover:text-foreground hover:decoration-foreground transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Which?
                </a>
                <a
                  href="https://www.amazon.co.uk/portable-air-conditioner/s?k=portable+air+conditioner"
                  className="text-muted-foreground underline decoration-border hover:text-foreground hover:decoration-foreground transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Amazon
                </a>
                <a
                  href="https://www.argos.co.uk/browse/appliances/fans-heaters-and-dehumidifiers/air-conditioning/c:29440/"
                  className="text-muted-foreground underline decoration-border hover:text-foreground hover:decoration-foreground transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Argos
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-lg border bg-card overflow-hidden">
          <div className="bg-muted/60 p-6 flex items-center justify-center">
            <SplitUnitSvg />
          </div>
          <div className="p-5 space-y-4">
            <div className="flex items-center gap-2">
              <Snowflake className="h-5 w-5 text-cyan-500" />
              <h3 className="font-heading font-semibold">Split system (installed)</h3>
            </div>

            <p className="text-sm text-muted-foreground">
              A slim unit on your wall, connected to a compressor outside.
              Professionally fitted.
            </p>

            <ul className="text-sm space-y-2">
              <li className="flex gap-2">
                <Check className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                <span className="text-muted-foreground">Most double as heaters in winter</span>
              </li>
              <li className="flex gap-2">
                <Check className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                <span className="text-muted-foreground">Much more efficient to run</span>
              </li>
              <li className="flex gap-2">
                <X className="h-4 w-4 text-orange-500 shrink-0 mt-0.5" />
                <span className="text-muted-foreground">£1,500 to £3,000+ installed</span>
              </li>
              <li className="flex gap-2">
                <X className="h-4 w-4 text-orange-500 shrink-0 mt-0.5" />
                <span className="text-muted-foreground">Needs a professional installer</span>
              </li>
            </ul>

            <div className="rounded-md bg-muted/50 p-3 space-y-1.5">
              <div className="flex items-center gap-1.5">
                <VolumeX className="h-3.5 w-3.5 text-emerald-500" />
                <span className="text-xs font-medium">Noise: 19 to 35 dB</span>
              </div>
              <p className="text-xs text-muted-foreground">
                About as loud as a fridge or a quiet library.
                Most people sleep through it.
              </p>
              <a
                href="https://youtu.be/FMQHSLjlt9s?t=10"
                className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:text-primary/80 transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Volume2 className="h-3 w-3" />
                Hear what one sounds like →
              </a>
            </div>

            <div className="pt-2 border-t space-y-1.5">
              <p className="text-xs font-medium">Find an installer:</p>
              <a
                href={trustedTradersUrl}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:text-primary/80 transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Shield className="h-3 w-3" />
                Which? Trusted Traders{postcode ? ` near ${postcode}` : ""} →
              </a>
              <p className="text-xs font-medium pt-2">Find out more:</p>
              <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs">
                <a
                  href="https://www.checkatrade.com/blog/cost-guides/air-conditioner-installation-cost/"
                  className="text-muted-foreground underline decoration-border hover:text-foreground hover:decoration-foreground transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Checkatrade
                </a>
                <a
                  href="https://energysavingtrust.org.uk/advice/air-to-air-heat-pumps/"
                  className="text-muted-foreground underline decoration-border hover:text-foreground hover:decoration-foreground transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Energy Saving Trust
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
