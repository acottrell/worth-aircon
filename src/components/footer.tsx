export function Footer() {
  return (
    <footer className="border-t px-5 py-4 text-center text-xs text-muted-foreground space-y-1">
      <p>
        <a
          href="https://acottrell.com"
          target="_blank"
          rel="noopener noreferrer"
          className="underline decoration-border hover:text-foreground hover:decoration-foreground transition-colors"
        >
          Built by Aaron Cottrell
        </a>
        {" · "}
        Weather data from{" "}
        <a
          href="https://open-meteo.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="underline decoration-border hover:text-foreground hover:decoration-foreground transition-colors"
        >
          Open-Meteo
        </a>
      </p>
    </footer>
  );
}
