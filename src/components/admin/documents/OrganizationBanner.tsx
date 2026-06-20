import { Sparkles, X } from "lucide-react";
import { useEffect, useState } from "react";

interface Props {
  unfiledCount: number;
  onOpen: () => void;
}

const DISMISS_KEY = "org_banner_dismissed_at";

export default function OrganizationBanner({ unfiledCount, onOpen }: Props) {
  const [hidden, setHidden] = useState(true);

  useEffect(() => {
    if (unfiledCount < 5) { setHidden(true); return; }
    const last = Number(localStorage.getItem(DISMISS_KEY) || 0);
    const days = (Date.now() - last) / (1000 * 60 * 60 * 24);
    setHidden(days < 7);
  }, [unfiledCount]);

  if (hidden) return null;

  const dismiss = () => {
    localStorage.setItem(DISMISS_KEY, String(Date.now()));
    setHidden(true);
  };

  return (
    <div className="flex items-center gap-3 p-3 rounded-xl border border-electric-300/40 bg-gradient-to-r from-electric-300/10 to-transparent">
      <Sparkles className="h-5 w-5 text-electric-300 shrink-0" />
      <div className="text-sm flex-1 min-w-0">
        <span className="text-white font-medium">{unfiledCount} mappázatlan elem </span>
        <span className="text-nf-text-muted">— kérj AI javaslatot a rendezésre.</span>
      </div>
      <button onClick={onOpen} className="text-xs px-3 py-1.5 rounded-full bg-electric-300 text-black font-medium hover:bg-electric-400 transition-colors shrink-0">
        Megnézem
      </button>
      <button onClick={dismiss} className="text-nf-text-muted hover:text-white shrink-0" aria-label="Elrejt">
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
