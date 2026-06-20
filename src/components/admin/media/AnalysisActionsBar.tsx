import { Button } from "@/components/ui/button";
import { Copy, MessageSquare, FilePlus, ExternalLink, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { analysisToMarkdown, analysisToChatContext, type ImageAnalysis, type DocLike } from "@/lib/format-analysis";
import { useAIAssistant } from "@/contexts/AIAssistantContext";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

interface Props {
  doc: DocLike;
  analysis: ImageAnalysis;
  imageUrl?: string | null;
}

export default function AnalysisActionsBar({ doc, analysis, imageUrl }: Props) {
  const { toast } = useToast();
  const { attachAndOpen } = useAIAssistant();
  const nav = useNavigate();
  const [generating, setGenerating] = useState(false);

  const copyMd = async () => {
    await navigator.clipboard.writeText(analysisToMarkdown(doc, analysis, imageUrl));
    toast({ title: "Strukturált markdown a vágólapon" });
  };

  const sendToFloating = () => {
    attachAndOpen(
      { id: doc.id, title: doc.title ?? "Kép", kind: "image-analysis" },
      analysisToChatContext(doc, analysis),
    );
  };

  const openInDocChat = () => {
    nav(`/admin/ai?ids=${doc.id}&attachAnalysis=1`);
  };

  const generateDoc = async () => {
    setGenerating(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const res = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/image-analysis-to-doc`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${session?.access_token}` },
        body: JSON.stringify({ docId: doc.id }),
      });
      const j = await res.json();
      if (!res.ok) throw new Error(j.error || `HTTP ${res.status}`);
      toast({ title: "Új doksi létrehozva", description: "AI elemzések mappában" });
      nav(`/admin/documents/${j.id}`);
    } catch (e: any) {
      toast({ title: "Hiba", description: e?.message ?? String(e), variant: "destructive" });
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-nf-border">
      <Button variant="outline" size="sm" onClick={copyMd} className="justify-start">
        <Copy className="h-3.5 w-3.5" /> Vágólapra
      </Button>
      <Button variant="outline" size="sm" onClick={sendToFloating} className="justify-start">
        <MessageSquare className="h-3.5 w-3.5" /> Floating chat
      </Button>
      <Button variant="outline" size="sm" onClick={openInDocChat} className="justify-start">
        <ExternalLink className="h-3.5 w-3.5" /> Doksi-chat
      </Button>
      <Button variant="neon" size="sm" onClick={generateDoc} disabled={generating} className="justify-start">
        {generating ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <FilePlus className="h-3.5 w-3.5" />} Új doksi
      </Button>
    </div>
  );
}
