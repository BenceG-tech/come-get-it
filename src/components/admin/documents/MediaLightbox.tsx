import { Dialog, DialogContent } from "@/components/ui/dialog";
import { X, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  open: boolean;
  onClose: () => void;
  url: string | null;
  title: string;
  isVideo: boolean;
}

export default function MediaLightbox({ open, onClose, url, title, isVideo }: Props) {
  if (!url) return null;
  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-5xl w-[95vw] p-0 bg-black border-nf-border overflow-hidden">
        <div className="relative">
          <div className="absolute top-2 right-2 z-10 flex gap-2">
            <Button size="icon" variant="outline" asChild aria-label="Letöltés">
              <a href={url} download={title} target="_blank" rel="noopener noreferrer"><Download className="h-4 w-4" /></a>
            </Button>
            <Button size="icon" variant="outline" onClick={onClose} aria-label="Bezárás"><X className="h-4 w-4" /></Button>
          </div>
          {isVideo ? (
            <video src={url} controls autoPlay className="w-full max-h-[85vh] bg-black" />
          ) : (
            <img src={url} alt={title} className="w-full max-h-[85vh] object-contain bg-black" style={{ touchAction: "pinch-zoom" }} />
          )}
          <div className="px-4 py-2 bg-nf-surface text-xs text-white/70 truncate">{title}</div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
