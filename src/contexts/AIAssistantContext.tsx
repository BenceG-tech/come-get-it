import { createContext, ReactNode, useCallback, useContext, useState } from "react";

type Attachment = { id: string; title: string; kind: "doc" | "media" | "image-analysis" };

type Ctx = {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
  attachments: Attachment[];
  setAttachments: (a: Attachment[]) => void;
  addAttachments: (a: Attachment[]) => void;
  removeAttachment: (id: string) => void;
  clearAttachments: () => void;
  pendingPrompt: string | null;
  setPendingPrompt: (s: string | null) => void;
  attachAndOpen: (att: Attachment, prefill?: string) => void;
};

const AIAssistantCtx = createContext<Ctx | null>(null);

export function AIAssistantProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [pendingPrompt, setPendingPrompt] = useState<string | null>(null);

  const addAttachments = useCallback((a: Attachment[]) => {
    setAttachments((prev) => {
      const map = new Map(prev.map((x) => [x.id, x]));
      a.forEach((x) => map.set(x.id, x));
      return Array.from(map.values());
    });
  }, []);

  const removeAttachment = useCallback((id: string) => {
    setAttachments((prev) => prev.filter((x) => x.id !== id));
  }, []);

  const attachAndOpen = useCallback((att: Attachment, prefill?: string) => {
    setAttachments((prev) => {
      const map = new Map(prev.map((x) => [x.id, x]));
      map.set(att.id, att);
      return Array.from(map.values());
    });
    if (prefill) setPendingPrompt(prefill);
    setIsOpen(true);
  }, []);

  return (
    <AIAssistantCtx.Provider
      value={{
        isOpen,
        open: () => setIsOpen(true),
        close: () => setIsOpen(false),
        toggle: () => setIsOpen((v) => !v),
        attachments,
        setAttachments,
        addAttachments,
        removeAttachment,
        clearAttachments: () => setAttachments([]),
        pendingPrompt,
        setPendingPrompt,
        attachAndOpen,
      }}
    >
      {children}
    </AIAssistantCtx.Provider>
  );
}

export function useAIAssistant() {
  const ctx = useContext(AIAssistantCtx);
  if (!ctx) throw new Error("useAIAssistant must be used within AIAssistantProvider");
  return ctx;
}
