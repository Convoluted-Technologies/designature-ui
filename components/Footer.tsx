import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-velvet/10 py-12 bg-cream">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="flex flex-col items-center md:items-start">
          <span className="text-2xl font-bold tracking-widest text-velvet">DESIGNATURE</span>
          <p className="text-sm text-velvet/60 mt-2">Fashion at its best</p>
        </div>

        <div className="text-sm text-velvet/50">
          © {new Date().getFullYear()} DESIGNATURE. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
