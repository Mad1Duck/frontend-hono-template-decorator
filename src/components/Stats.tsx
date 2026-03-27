const STATS = [
  { value: "14k+",  label: "req / sec"   },
  { value: "3.2ms", label: "avg latency" },
  { value: "20+",   label: "decorators"  },
  { value: "MIT",   label: "license"     },
];

export default function Stats() {
  return (
    <section className="max-w-275 mx-auto px-6 pb-16">
      <div
        className="reveal grid grid-cols-2 md:grid-cols-4 border border-(--color-border)
                   rounded-[6px] overflow-hidden"
        style={{ gap: "1px", background: "var(--color-border)" }}
      >
        {STATS.map((s) => (
          <div
            key={s.label}
            className="bg-(--color-surface) px-6 py-8 text-center"
          >
            <span
              className="block font-mono text-[1.65rem] font-bold
                         text-(--color-accent)"
            >
              {s.value}
            </span>
            <span
              className="block font-mono text-[0.68rem]
                         text-(--color-muted) tracking-[0.06em] mt-1 uppercase"
            >
              {s.label}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
