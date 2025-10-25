import React from "react";

export const Card = ({ title, children }: { title?: string; children: React.ReactNode }) => (
  <div className="bg-cyan/90 backdrop-blur-md border border-white/20 rounded-xl p-4 shadow-lg text-white">
    {title && <h2 className="text-lg font-semibold mb-3">{title}</h2>}
    {children}
  </div>
);
