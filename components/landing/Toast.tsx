"use client";
import { useEffect } from "react";

interface Props {
  message: string;
  onDismiss: () => void;
}

const FONT = "var(--font-manrope, 'Manrope', 'Inter', system-ui, sans-serif)";

export default function Toast({ message, onDismiss }: Props) {
  useEffect(() => {
    const id = setTimeout(onDismiss, 3000);
    return () => clearTimeout(id);
  }, [onDismiss]);

  return (
    <div
      style={{
        position: "fixed",
        top: 20,
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 10000,
        backgroundColor: "#1E1B18",
        color: "#fff",
        fontFamily: FONT,
        fontSize: 15,
        fontWeight: 600,
        padding: "12px 20px",
        borderRadius: 12,
        boxShadow: "0 8px 24px rgba(0,0,0,0.25)",
        display: "flex",
        alignItems: "center",
        gap: 10,
        whiteSpace: "nowrap",
        maxWidth: "90vw",
        animation: "toast-in 0.25s ease",
      }}
    >
      {message}
    </div>
  );
}
