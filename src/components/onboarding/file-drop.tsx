"use client";

import { useEffect, useRef, useState } from "react";
import { AlertCircle, FileText, Loader2, RotateCw, Upload, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ALLOWED_MIME, MAX_FILE_BYTES, MAX_FILES } from "@/lib/onboarding/schema";
import type { UploadedFile, UploadSlot } from "@/lib/onboarding/types";
import { cn } from "@/lib/utils";

const ACCEPT = Object.keys(ALLOWED_MIME)
  .map((e) => `.${e}`)
  .join(",");

type Pending = { key: string; file: File; progress: number; error?: string };

type Props = {
  slot: UploadSlot;
  submissionId: string;
  files: UploadedFile[];
  /** Files across all slots, for the MAX_FILES cap. */
  totalFiles: number;
  onUploaded: (f: UploadedFile) => void;
  onRemove: (path: string) => void;
  /** Reports whether this slot has uploads in flight (blocks Continue). */
  onBusyChange: (slot: string, busy: boolean) => void;
};

const size = (b: number) => (b > 1e6 ? `${(b / 1e6).toFixed(1)} MB` : `${Math.ceil(b / 1e3)} KB`);

/** Requests a signed URL, then PUTs the file straight to Supabase Storage with progress. */
async function upload(
  file: File,
  slot: string,
  submissionId: string,
  onProgress: (p: number) => void,
) {
  const mimeType = ALLOWED_MIME[file.name.split(".").pop()?.toLowerCase() ?? ""];
  const res = await fetch("/api/upload-url", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ submissionId, slot, fileName: file.name, size: file.size, mimeType }),
  });
  const json = (await res.json().catch(() => ({}))) as {
    signedUrl?: string;
    path?: string;
    error?: string;
  };
  if (!res.ok || !json.signedUrl || !json.path) throw new Error(json.error ?? "Upload failed.");

  // Same request shape as supabase-js uploadToSignedUrl, but via XHR for progress events.
  const body = new FormData();
  body.append("cacheControl", "3600");
  body.append("", new Blob([file], { type: mimeType }), file.name);
  await new Promise<void>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("PUT", json.signedUrl!);
    xhr.setRequestHeader("x-upsert", "false");
    xhr.upload.onprogress = (e) => e.lengthComputable && onProgress(e.loaded / e.total);
    xhr.onload = () => (xhr.status < 300 ? resolve() : reject(new Error("Upload failed.")));
    xhr.onerror = () => reject(new Error("Network error — check your connection."));
    xhr.send(body);
  });
  return {
    slot,
    path: json.path,
    fileName: file.name,
    mimeType,
    size: file.size,
  } satisfies UploadedFile;
}

export function FileDrop({
  slot,
  submissionId,
  files,
  totalFiles,
  onUploaded,
  onRemove,
  onBusyChange,
}: Props) {
  const [pending, setPending] = useState<Pending[]>([]);
  const [dragging, setDragging] = useState(false);
  const [notice, setNotice] = useState<string>();
  const inputRef = useRef<HTMLInputElement>(null);
  const busy = pending.some((p) => !p.error);

  useEffect(() => onBusyChange(slot.slot, busy), [busy, slot.slot, onBusyChange]);

  const start = (p: Pending) => {
    setPending((list) => [
      ...list.filter((x) => x.key !== p.key),
      { ...p, progress: 0, error: undefined },
    ]);
    upload(p.file, slot.slot, submissionId, (progress) =>
      setPending((list) => list.map((x) => (x.key === p.key ? { ...x, progress } : x))),
    )
      .then((done) => {
        setPending((list) => list.filter((x) => x.key !== p.key));
        onUploaded(done);
      })
      .catch((e: Error) =>
        setPending((list) => list.map((x) => (x.key === p.key ? { ...x, error: e.message } : x))),
      );
  };

  const add = (list: FileList | null) => {
    setNotice(undefined);
    let room = MAX_FILES - totalFiles - pending.length;
    for (const file of Array.from(list ?? [])) {
      const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
      if (!ALLOWED_MIME[ext]) {
        setNotice(
          `“${file.name}” isn't a supported type. Use PDF, PNG, JPG, SVG, WEBP, AI, EPS, ZIP or DOCX.`,
        );
      } else if (file.size > MAX_FILE_BYTES) {
        setNotice(`“${file.name}” is larger than 25 MB.`);
      } else if (room <= 0) {
        setNotice(`You can upload up to ${MAX_FILES} files in total.`);
      } else {
        room--;
        start({ key: crypto.randomUUID(), file, progress: 0 });
      }
    }
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="space-y-3">
      <div>
        <p className="font-medium">{slot.label}</p>
        {slot.help && <p className="text-muted-foreground text-sm">{slot.help}</p>}
      </div>

      <label
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          add(e.dataTransfer.files);
        }}
        className={cn(
          "has-focus-visible:ring-ring/40 flex cursor-pointer flex-col items-center gap-2 rounded-xl border border-dashed px-4 py-6 text-center text-sm transition-colors has-focus-visible:ring-3",
          dragging ? "border-brand bg-brand/5" : "hover:border-white/30",
        )}
      >
        <Upload className="text-brand size-5" aria-hidden />
        <span>
          <span className="text-brand font-semibold">Choose files</span> or drag them here
        </span>
        <span className="text-muted-foreground text-xs">
          PDF, images, AI/EPS, ZIP or DOCX · up to 25 MB each
        </span>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept={ACCEPT}
          className="sr-only"
          aria-label={`Upload ${slot.label}`}
          onChange={(e) => add(e.target.files)}
        />
      </label>

      {notice && (
        <p role="alert" className="text-destructive flex items-center gap-1.5 text-sm">
          <AlertCircle className="size-4 shrink-0" aria-hidden /> {notice}
        </p>
      )}

      <ul className="space-y-2" aria-live="polite">
        {files.map((f) => (
          <li
            key={f.path}
            className="bg-background/60 flex items-center gap-3 rounded-lg border px-3 py-2 text-sm"
          >
            <FileText className="text-brand size-4 shrink-0" aria-hidden />
            <span className="min-w-0 flex-1 truncate">{f.fileName}</span>
            <span className="text-muted-foreground text-xs">{size(f.size)}</span>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              aria-label={`Remove ${f.fileName}`}
              // shortcut: removes the reference only; the stored object is orphaned until a cleanup job exists (Phase 7).
              onClick={() => onRemove(f.path)}
            >
              <X />
            </Button>
          </li>
        ))}
        {pending.map((p) => (
          <li key={p.key} className="bg-background/60 rounded-lg border px-3 py-2 text-sm">
            <div className="flex items-center gap-3">
              {p.error ? (
                <AlertCircle className="text-destructive size-4 shrink-0" aria-hidden />
              ) : (
                <Loader2 className="text-brand size-4 shrink-0 animate-spin" aria-hidden />
              )}
              <span className="min-w-0 flex-1 truncate">{p.file.name}</span>
              {p.error ? (
                <>
                  <Button type="button" variant="ghost" size="sm" onClick={() => start(p)}>
                    <RotateCw /> Retry
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    aria-label={`Dismiss ${p.file.name}`}
                    onClick={() => setPending((list) => list.filter((x) => x.key !== p.key))}
                  >
                    <X />
                  </Button>
                </>
              ) : (
                <span className="text-muted-foreground text-xs tabular-nums">
                  {Math.round(p.progress * 100)}%
                </span>
              )}
            </div>
            {p.error ? (
              <p className="text-destructive mt-1 text-xs">{p.error}</p>
            ) : (
              <div className="mt-2 h-1 overflow-hidden rounded-full bg-white/10">
                <div
                  className="bg-brand h-full transition-[width]"
                  style={{ width: `${p.progress * 100}%` }}
                />
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
