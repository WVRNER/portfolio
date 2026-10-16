"use client";

import { useState } from "react";

interface Node {
  id: string;
  label: string;
  layer: string;
  details: string;
}

interface ArchitectureDiagramProps {
  nodes: Node[];
  title?: string;
}

export function ArchitectureDiagram({ nodes, title }: ArchitectureDiagramProps) {
  const [activeNodeId, setActiveNodeId] = useState<string>(nodes[0]?.id || "");
  const activeNode = nodes.find((n) => n.id === activeNodeId) || nodes[0];

  return (
    <div className="w-full border border-[#E7E6E0] rounded-lg p-5 sm:p-7 bg-[#FFFFFF]/60 backdrop-blur-xs">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#E7E6E0]/80 gap-2">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#9E9D97] block">
            TOPOLOGY SPECIFICATION
          </span>
          <h4 className="text-[14px] sm:text-[15px] font-medium text-[#121211] tracking-tight">
            {title || "Declarative System Flow"}
          </h4>
        </div>
        <div className="text-[11px] font-mono text-[#686763]">
          Click nodes to inspect isolation layer
        </div>
      </div>

      {/* Nodes Flow: Horizontal scroll on small screens, flex on larger screens */}
      <div className="py-8 overflow-x-auto no-scrollbar">
        <div className="flex items-center justify-between min-w-[560px] gap-3">
          {nodes.map((node, i) => {
            const isSelected = activeNodeId === node.id;
            return (
              <div key={node.id} className="flex items-center flex-1">
                {/* Node Box */}
                <button
                  onClick={() => setActiveNodeId(node.id)}
                  className={`w-full text-left p-3.5 rounded-md border transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? "bg-[#121211] text-[#FBFBFA] border-[#121211] shadow-xs"
                      : "bg-[#FBFBFA] hover:bg-[#F4F3F0] text-[#121211] border-[#E7E6E0]"
                  }`}
                >
                  <div className={`text-[9.5px] font-mono uppercase tracking-wider mb-1 ${
                    isSelected ? "text-[#9E9D97]" : "text-[#686763]"
                  }`}>
                    {node.layer}
                  </div>
                  <div className="text-[12.5px] font-medium tracking-tight truncate">
                    {node.label}
                  </div>
                </button>

                {/* Thin Connector Arrow */}
                {i < nodes.length - 1 && (
                  <div className="flex items-center px-2 text-[#9E9D97] flex-shrink-0" aria-hidden="true">
                    <svg width="20" height="12" viewBox="0 0 20 12" fill="none" className="stroke-current">
                      <line x1="0" y1="6" x2="16" y2="6" strokeWidth="0.85" />
                      <polyline points="12,2 16,6 12,10" strokeWidth="0.85" />
                    </svg>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Active Node Detailed Inspection Bar */}
      {activeNode && (
        <div className="mt-4 pt-4 border-t border-[#E7E6E0]/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[12px] sm:text-[13px] bg-[#FBFBFA] p-3.5 rounded-md border border-[#E7E6E0]/60">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#121211]" />
            <span className="font-mono text-[#686763] uppercase text-[11px]">
              {activeNode.layer}:
            </span>
            <span className="font-medium text-[#121211]">
              {activeNode.label}
            </span>
          </div>
          <p className="text-[#686763] text-left sm:text-right font-normal">
            {activeNode.details}
          </p>
        </div>
      )}
    </div>
  );
}
