"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  X,
  Printer,
  Cloud,
  Boxes,
  GitBranch,
  Server,
  ShieldCheck,
  Terminal,
  Copy,
  Check,
  ArrowUpRight,
} from "lucide-react";

interface CVDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CVDrawer({ isOpen, onClose }: CVDrawerProps) {
  const [copied, setCopied] = useState(false);
  const email = "wvrner@outlook.com";

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const competencies = [
    {
      title: "Cloud & Infrastructure as Code",
      items: "AWS, Terraform, Multi-AZ VPC, IAM",
      Icon: Cloud,
    },
    {
      title: "Containers & Packaging",
      items: "Docker, Minimal Images, Multi-Stage",
      Icon: Boxes,
    },
    {
      title: "Automated CI/CD Delivery",
      items: "GitHub Actions, Keyless OIDC, Workflows",
      Icon: GitBranch,
    },
    {
      title: "Systems Administration",
      items: "Linux, Active Directory, DNS, DHCP",
      Icon: Server,
    },
    {
      title: "Networking & Security",
      items: "MikroTik, Cisco, Routing, Firewalls",
      Icon: ShieldCheck,
    },
    {
      title: "Automation & Tooling",
      items: "Python, Bash, Telemetry, Recovery",
      Icon: Terminal,
    },
  ];

  const highlights = [
    {
      title: "Declarative Cloud Architecture",
      desc: "Architecting and validating multi-AZ VPC topologies with private compute isolation, automated state locking, and reproducible Terraform workspaces.",
    },
    {
      title: "Keyless CI/CD Automation",
      desc: "Implementing cryptographic OIDC authentication between GitHub Actions and cloud providers, eliminating static long-lived credentials.",
    },
    {
      title: "Hardened Container Delivery",
      desc: "Engineering multi-stage, scratch-based container packaging pipelines with automated vulnerability scanning and reproducible builds.",
    },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 md:p-8">
          {/* Apple-grade Liquid Blur Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/45 backdrop-blur-md"
          />

          {/* Apple Squircle Window Container */}
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-[840px] max-h-[90vh] overflow-y-auto bg-[#FCFCFB] sm:bg-white/95 rounded-[28px] sm:rounded-[36px] border border-black/[0.08] shadow-[0_32px_80px_rgba(0,0,0,0.22),0_1px_1px_rgba(0,0,0,0.04)] p-6 sm:p-10 z-10 space-y-8 select-text"
          >
            {/* Top Specular Sheen */}
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/80 to-transparent pointer-events-none" />

            {/* Apple Header Toolbar */}
            <div className="flex items-start justify-between gap-4 pb-6 border-b border-black/[0.07]">
              <div className="space-y-1.5">
                <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-black/[0.04] text-[10.5px] font-medium tracking-wider uppercase text-[#6E6E73]">
                  <span>CURRICULUM VITAE</span>
                </div>
                <h2 className="font-display text-[26px] sm:text-[32px] font-semibold text-[#1D1D1F] tracking-tight">
                  Nima Hosseini
                </h2>
                <div className="flex items-center gap-2 text-[13.5px] text-[#6E6E73]">
                  <span className="font-medium text-[#1D1D1F]">Cloud &amp; DevOps Engineer</span>
                  <span>&middot;</span>
                  <span>Systems Architecture</span>
                </div>
              </div>

              {/* Apple Action Toolbar Pills */}
              <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#161617] text-white hover:bg-[#2C2C2E] active:scale-95 text-[12.5px] font-medium transition-all duration-200 cursor-pointer shadow-sm"
                  title="Print or Save PDF"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Print / Save PDF</span>
                </button>

                <button
                  type="button"
                  onClick={onClose}
                  className="w-9 h-9 rounded-full bg-black/[0.05] hover:bg-black/[0.1] active:scale-90 transition-all duration-200 flex items-center justify-center text-[#1D1D1F] cursor-pointer"
                  aria-label="Close CV"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Profile Summary */}
            <div className="space-y-2.5">
              <span className="text-[11px] font-medium uppercase tracking-wider text-[#86868B] block">
                ENGINEERING SUMMARY
              </span>
              <p className="text-[15px] sm:text-[16px] text-[#424245] leading-relaxed font-normal">
                Cloud and DevOps engineer focused on declarative infrastructure provisioning, container isolation, and deterministic deployment pipelines. Engineering reliable architectures on AWS using Terraform, Kubernetes primitives, and GitHub Actions.
              </p>
            </div>

            {/* Core Competencies Bento Grid */}
            <div className="space-y-3.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-medium uppercase tracking-wider text-[#86868B]">
                  CORE COMPETENCIES
                </span>
                <span className="text-[11.5px] text-[#86868B]">AWS &bull; IAC &bull; CI/CD</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {competencies.map((comp) => {
                  const Icon = comp.Icon;
                  return (
                    <div
                      key={comp.title}
                      className="p-4 rounded-2xl bg-[#F5F5F7] hover:bg-[#EFEFEF] border border-black/[0.04] transition-colors space-y-2 group"
                    >
                      <div className="w-8 h-8 rounded-xl bg-white shadow-xs flex items-center justify-center text-[#1D1D1F]">
                        <Icon className="w-4 h-4 text-[#1D1D1F]" />
                      </div>
                      <div>
                        <div className="text-[13px] font-semibold text-[#1D1D1F] leading-snug">
                          {comp.title}
                        </div>
                        <div className="text-[12px] text-[#6E6E73] pt-0.5 font-normal">
                          {comp.items}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Practice & Key Engineering Decisions */}
            <div className="space-y-3.5 pt-2 border-t border-black/[0.07]">
              <span className="text-[11px] font-medium uppercase tracking-wider text-[#86868B] block">
                TECHNICAL DISCIPLINES &bull; PRODUCTION PRACTICE
              </span>

              <div className="space-y-3">
                {highlights.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-4 sm:p-5 rounded-2xl bg-[#F5F5F7] border border-black/[0.04] space-y-1"
                  >
                    <div className="text-[14px] font-semibold text-[#1D1D1F]">
                      {item.title}
                    </div>
                    <p className="text-[13.5px] text-[#6E6E73] leading-relaxed font-normal">
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Apple Card Footer / Direct Channels */}
            <div className="pt-4 border-t border-black/[0.07] flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-[12.5px] text-[#6E6E73]">
              <div className="flex items-center gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#161617] shrink-0" />
                <span className="text-[#1D1D1F] font-medium">Available for Infrastructure Engagements</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopyEmail}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/[0.04] hover:bg-black/[0.08] text-[#1D1D1F] transition-colors cursor-pointer text-[12px] font-medium"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-[#161617]" />
                      <span>Copied email</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-[#86868B]" />
                      <span>{email}</span>
                    </>
                  )}
                </button>

                <a
                  href={`mailto:${email}`}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#161617] text-white hover:bg-[#2C2C2E] transition-colors text-[12px] font-medium"
                >
                  <span>Connect</span>
                  <ArrowUpRight className="w-3 h-3" />
                </a>
              </div>
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
