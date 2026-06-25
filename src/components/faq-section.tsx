interface FaqItem {
  q: string;
  a: string;
  link?: { text: string; href: string };
}

const FAQ_ITEMS: FaqItem[] = [
  {
    q: "How many hot nights does the UK actually get?",
    a: "It depends where you live. Southern England might see 20 to 40 nights above 16°C in a warm year. Northern England and Scotland typically see fewer than 10. The trend is upward, and 2022 and 2025 were notably bad across much of the country.",
  },
  {
    q: "What temperature is too hot to sleep?",
    a: "The NHS recommends keeping your bedroom between 16 and 18°C. Above 24°C most people struggle significantly. The default 16°C threshold here marks the bottom of that range. If outside air doesn't drop below 16°C overnight, your bedroom won't cool down either.",
  },
  {
    q: "What does aircon give me that a fan doesn't?",
    a: "A fan doesn't cool your room. It moves warm air around. You feel cooler because moving air helps sweat evaporate from your skin, but the actual room temperature stays the same. Air conditioning removes heat from the room, lowering the temperature. On a genuinely hot night, that's a real difference.",
  },
  {
    q: "I'm not buying aircon. How do I keep cool?",
    a: "Close curtains and windows on the sunny side of the house during the day. Open windows on opposite sides of the house in the evening to create a through-draught. Use a fan with a bowl of ice in front of it. Sleep with a damp sheet or use a cooling pillow. Avoid cooking with the oven. Keep hydrated. If your bedroom faces south or west, consider sleeping in a cooler room.",
    link: {
      text: "More tips from the NHS",
      href: "https://www.nhs.uk/live-well/seasonal-health/heatwave-how-to-cope-in-hot-weather/",
    },
  },
  {
    q: "Is a portable aircon unit worth it?",
    a: "If you get 5 to 15 warm nights a year, a portable unit (£250 to £600) can be a reasonable investment. They're noisy and use more electricity than split systems, but there's no installation needed and you can move them between rooms.",
  },
  {
    q: "How much does aircon cost to run?",
    a: "A portable unit uses about 1kW and costs roughly £2 per night to run for 8 hours at current UK electricity rates. A split system is more efficient at around 80p per night. Your actual costs depend on the unit and how long you run it.",
  },
];

export function FaqSection() {
  return (
    <section className="space-y-6">
      <h2 className="text-lg font-heading font-semibold">
        Common questions
      </h2>

      <dl className="space-y-6">
        {FAQ_ITEMS.map((item) => (
          <div key={item.q} className="space-y-1.5">
            <dt className="font-heading font-medium text-sm">{item.q}</dt>
            <dd className="text-sm text-muted-foreground leading-relaxed">
              {item.a}
              {item.link && (
                <>
                  {" "}
                  <a
                    href={item.link.href}
                    className="underline decoration-border hover:text-foreground hover:decoration-foreground transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {item.link.text} →
                  </a>
                </>
              )}
            </dd>
          </div>
        ))}
      </dl>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: FAQ_ITEMS.map((item) => ({
              "@type": "Question",
              name: item.q,
              acceptedAnswer: {
                "@type": "Answer",
                text: item.a,
              },
            })),
          }),
        }}
      />
    </section>
  );
}
