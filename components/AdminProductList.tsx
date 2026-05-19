"use client";

import { useState } from "react";

const PAGE_SIZE = 20;

interface Props {
  products: { product: string; count: number }[];
}

export default function AdminProductList({ products }: Props) {
  const [page, setPage] = useState(0);
  const totalPages = Math.ceil(products.length / PAGE_SIZE);
  const slice = products.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  return (
    <div style={{ padding: "14px 24px 24px" }}>
      {products.length === 0 && <p style={{ color: "#888", fontSize: 14 }}>Nessun ordine</p>}
      {slice.map((p) => (
        <div key={p.product} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: "1px solid #f0f0f0" }}>
          <span style={{ fontSize: 15, fontWeight: 500 }}>{p.product}</span>
          <span style={{ fontSize: 20, fontWeight: 700, fontFamily: "'Poppins', sans-serif", color: "#1B5E6B" }}>{p.count}</span>
        </div>
      ))}
      {totalPages > 1 && (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 12, marginTop: 16 }}>
          <button
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            style={{ padding: "6px 14px", borderRadius: 8, border: "1px solid #d1d5db", background: page === 0 ? "#f3f4f6" : "#fff", cursor: page === 0 ? "default" : "pointer", fontSize: 14, fontWeight: 600, color: page === 0 ? "#aaa" : "#333" }}
          >
            &larr; Prec
          </button>
          <span style={{ fontSize: 14, color: "#555" }}>{page + 1} / {totalPages}</span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={page === totalPages - 1}
            style={{ padding: "6px 14px", borderRadius: 8, border: "1px solid #d1d5db", background: page === totalPages - 1 ? "#f3f4f6" : "#fff", cursor: page === totalPages - 1 ? "default" : "pointer", fontSize: 14, fontWeight: 600, color: page === totalPages - 1 ? "#aaa" : "#333" }}
          >
            Succ &rarr;
          </button>
        </div>
      )}
    </div>
  );
}
