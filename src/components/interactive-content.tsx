"use client";

import { Suspense, useState } from "react";
import { HeroSection } from "./hero-section";
import { AirconOptions } from "./aircon-options";

function Content() {
  const [postcode, setPostcode] = useState<string | null>(null);

  return (
    <>
      <HeroSection onPostcode={setPostcode} />
      <div className="border-t" />
      <AirconOptions postcode={postcode} />
    </>
  );
}

export function InteractiveContent() {
  return (
    <Suspense>
      <Content />
    </Suspense>
  );
}
