import { useEffect, useState } from "react";
import { Sparkles, Mic, Square, Type, Loader2, Plus, X } from "lucide-react";
import { useAIAssistant } from "@/contexts/AIAssistantContext";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import FloatingAIAssistant from "./FloatingAIAssistant";
import { VoiceCaptureFAB } from "./VoiceCaptureFAB";
import { cn } from "@/lib/utils";

/**
 * Egyesített FAB-cluster a jobb alsó sarokban.
 * - Elsődleges: AI asszisztens (Sparkles)
 * - Másodlagos (toggle alatt): Hangjegyzet (Mic) + Szöveges jegyzet (Type)
 * - Mobilon a bottom nav fölé pozícionálva (semmi nem takarja).
 */
export default function AdminFabCluster() {
  const { isAdmin } = useIsAdmin();
  const { isOpen: aiOpen, open: openAI, attachments } = useAIAssistant();
  const [expanded, setExpanded] = useState(false);

  // Csukd be a klasztert, ha az AI panel kinyílt (mobilon fullscreen)
  useEffect(() => { if (aiOpen) setExpanded(false); }, [aiOpen]);

  if (!isAdmin) return null;

  return (
    <>
      {/* AI panel + voice dialog logika (panel/dialog renderelés) */}
      <FloatingAIAssistant hideLauncher />
      <VoiceCaptureFAB
        renderTrigger={({ recording, processing, toggleRecording, openText }) => {
          // Felvétel közben automatikusan kibontva
          const showSecondary = expanded || recording || processing;
          return (
            <div
              className={cn(
                "fixed z-50 right-4 md:right-5 flex flex-col items-end gap-2",
                // Mobil: bottom nav (kb. 56px) + safe area fölé. Desktop: sarok.
                "bottom-[calc(env(safe-area-inset-bottom,0px)+72px)] md:bottom-5",
                aiOpen && "md:flex hidden"
              )}
            >
              {/* Másodlagos: Szöveges jegyzet */}
              {showSecondary && (
                <button
                  onClick={openText}
                  className="bg-nf-surface border border-nf-border text-nf-text-muted hover:text-white h-10 w-10 rounded-full flex items-center justify-center shadow-lg animate-in fade-in slide-in-from-bottom-1 duration-150"
                  title="Szöveges jegyzet"
                  aria-label="Szöveges jegyzet"
                >
                  <Type className="h-4 w-4" />
                </button>
              )}

              {/* Másodlagos: Hangjegyzet */}
              {showSecondary && (
                <button
                  onClick={toggleRecording}
                  disabled={processing}
                  className={cn(
                    "h-12 w-12 rounded-full flex items-center justify-center shadow-xl transition-all animate-in fade-in slide-in-from-bottom-1 duration-150",
                    recording ? "bg-red-500 animate-pulse" : "bg-nf-surface border border-nf-border text-electric-300 hover:text-white"
                  )}
                  title={recording ? "Felvétel leállítása" : "Hangjegyzet rögzítése"}
                  aria-label="Hangjegyzet"
                >
                  {processing ? <Loader2 className="h-5 w-5 animate-spin" /> :
                   recording ? <Square className="h-4 w-4 text-white" /> :
                   <Mic className="h-5 w-5" />}
                </button>
              )}

              {/* Toggle (csak ha nincs aktív felvétel) */}
              {!recording && !processing && (
                <button
                  onClick={() => setExpanded((v) => !v)}
                  className="h-9 w-9 rounded-full bg-nf-surface border border-nf-border text-nf-text-muted hover:text-white flex items-center justify-center shadow-md"
                  aria-label={expanded ? "Eszközök bezárása" : "Eszközök megnyitása"}
                  title={expanded ? "Bezár" : "Több eszköz"}
                >
                  {expanded ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                </button>
              )}

              {/* Elsődleges: AI asszisztens */}
              {!aiOpen && (
                <button
                  onClick={openAI}
                  aria-label="AI asszisztens megnyitása"
                  className="relative rounded-full bg-electric-300 text-black p-4 shadow-[0_0_24px_rgba(0,212,255,0.6)] hover:scale-105 transition-transform"
                >
                  <Sparkles className="h-5 w-5" />
                  {attachments.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] rounded-full min-w-5 h-5 flex items-center justify-center px-1">
                      {attachments.length}
                    </span>
                  )}
                </button>
              )}
            </div>
          );
        }}
      />
    </>
  );
}
