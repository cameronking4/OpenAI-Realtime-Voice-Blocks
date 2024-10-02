"use client";

import { cn } from "@/lib/utils";
import { useState, useRef } from "react";
import { Button } from "./ui/button";
import { CheckIcon, CopyIcon, TableIcon } from "@radix-ui/react-icons";

export default function CodeBlockWrapper({
  children,
  size,
}: {
  children: React.ReactNode;
  size: "full" | "wrapper";
}) {
  const [open, setOpen] = useState(false);
  const codeRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  // maybe not the best way to handle this, but it works
  const handleCopy = () => {
    if (codeRef.current) {
      const codeText = codeRef.current.innerText;

      const cleanedCode = codeText
        .replace(/#copy-code-button/g, "")
        .replace(/#show-more-button/g, "")
        .trim();

      navigator.clipboard
        .writeText(cleanedCode)
        .then(() => {
          setCopied(true);
          setTimeout(() => {
            setCopied(false);
          }, 1000);
        })
        .catch((error) => {
          console.error("Error copying text:", error);
        });
    }
  };

  if (size === "full") {
    return (
      <div
        className="overflow-hidden border rounded-[1rem] bg-card relative"
        ref={codeRef}
      >
        {children}
        <Button
          className="absolute top-2 right-2"
          size="icon"
          variant="outline"
          id="copy-code-button"
          onClick={handleCopy}
        >
          {copied ? <CheckIcon /> : <CopyIcon />}
        </Button>
      </div>
    );
  }

  if (size === "wrapper") {
    return (
      <div
        className={cn(
          "relative grid place-items-center overflow-hidden border rounded-[1rem] bg-card",
          open ? "h-auto" : "h-[400px]"
        )}
      >
        <div ref={codeRef}>{children}</div>
        <div
          className={cn(
            "absolute inset-0 flex items-center justify-center bg-gradient-to-t from-[#0D0D0C] to-transparent z-0",
            open ? "hidden" : "block"
          )}
        ></div>
        <Button
          size="sm"
          variant="outline"
          className="z-10 absolute bottom-5"
          onClick={() => setOpen(!open)}
          id="show-more-button"
        >
          {open ? "Hide" : "Show More"}
        </Button>
        <Button
          className="absolute top-2 right-2"
          size="icon"
          variant="outline"
          id="copy-code-button"
          onClick={handleCopy}
        >
          {copied ? <CheckIcon /> : <CopyIcon />}
        </Button>
      </div>
    );
  }
}
