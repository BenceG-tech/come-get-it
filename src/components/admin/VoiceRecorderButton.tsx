import { useEffect, useRef, useState } from "react";
import { Mic, MicOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

type Props = {
  onTranscript: (text: string) => void;
  onInterim?: (text: string) => void;
  className?: string;
};

// Uses the browser Web Speech API for instant Hungarian dictation.
// Works in Chrome/Edge/Safari. No edge function needed.
export default function VoiceRecorderButton({ onTranscript, onInterim, className }: Props) {
  const [recording, setRecording] = useState(false);
  const [supported, setSupported] = useState(true);
  const recRef = useRef<any>(null);
  const finalRef = useRef<string>("");
  const { toast } = useToast();

  useEffect(() => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) setSupported(false);
  }, []);

  const start = () => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) {
      toast({ title: "Nem támogatott", description: "Ez a böngésző nem támogatja a diktálást. Próbáld Chrome-ban.", variant: "destructive" });
      return;
    }
    const rec = new SR();
    rec.lang = "hu-HU";
    rec.continuous = true;
    rec.interimResults = true;
    finalRef.current = "";

    rec.onresult = (e: any) => {
      let interim = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const t = e.results[i][0].transcript;
        if (e.results[i].isFinal) finalRef.current += t;
        else interim += t;
      }
      onInterim?.(finalRef.current + interim);
    };
    rec.onerror = (e: any) => {
      if (e.error !== "aborted" && e.error !== "no-speech") {
        toast({ title: "Diktálási hiba", description: e.error, variant: "destructive" });
      }
    };
    rec.onend = () => {
      setRecording(false);
      if (finalRef.current.trim()) onTranscript(finalRef.current.trim());
    };
    try {
      rec.start();
      recRef.current = rec;
      setRecording(true);
    } catch (err: any) {
      toast({ title: "Nem indult el", description: String(err?.message ?? err), variant: "destructive" });
    }
  };

  const stop = () => {
    try { recRef.current?.stop(); } catch {}
  };

  if (!supported) return null;

  return (
    <button
      type="button"
      onClick={recording ? stop : start}
      title={recording ? "Diktálás vége" : "Diktálás"}
      className={cn(
        "rounded-full p-2 transition-colors",
        recording
          ? "bg-red-500/20 text-red-400 ring-2 ring-red-500/50 animate-pulse"
          : "bg-nf-surface-alt text-nf-text-muted hover:text-electric-300",
        className,
      )}
    >
      {recording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
    </button>
  );
}
