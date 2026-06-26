export function MethodologySection() {
  return (
    <section className="space-y-3">
      <h2 className="text-lg font-heading font-semibold">
        How this works
      </h2>

      <div className="text-sm text-muted-foreground space-y-2">
        <p>
          We look up your postcode to find your location, then pull
          hourly temperature data for the past ten years from Open-Meteo,
          a free weather archive.
        </p>
        <p>
          <strong>Overnight</strong>{" "}checks the outside temperature
          between 6pm and 6am. If it never drops below the threshold
          (default 16°C), that counts as a warm night. Opening windows
          alone won&apos;t cool your bedroom into the NHS recommended 16
          to 18°C sleep range.
        </p>
        <p>
          <strong>Daytime</strong> checks the peak temperature between
          6am and 6pm. Days that reach the threshold (default 25°C, the
          Met Office definition of a hot day) count as hot days.
        </p>
        <p>
          <strong>Both</strong> combines the two: any date that had a
          hot day, a warm night, or both.
        </p>
        <p>
          The verdict is based on how many of these days your area
          averages per year, and whether the trend is going up or down.
          Cost estimates assume typical unit specs and current UK
          electricity rates.
        </p>
        <p>
          This is a rough guide, not a definitive answer. Your actual
          experience depends on your home&apos;s insulation, which floor
          you&apos;re on, which direction your bedroom faces, and how
          much heat bothers you personally.
        </p>
      </div>
    </section>
  );
}
