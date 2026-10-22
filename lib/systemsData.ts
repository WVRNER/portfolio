export interface SystemCategory {
  number: string;
  category: string;
  description: string;
  tools: string[];
}

export interface SupportingCapability {
  area: string;
  items: string[];
  note?: string;
}

export const SYSTEMS_AND_TOOLS: SystemCategory[] = [
  {
    number: "01",
    category: "CLOUD",
    description: "Multi-AZ compute foundations, networking, and declarative state orchestration.",
    tools: ["AWS", "Terraform"],
  },
  {
    number: "02",
    category: "CONTAINERS",
    description: "Application packaging, multi-stage builds, and process isolation.",
    tools: ["Docker", "Docker Compose"],
  },
  {
    number: "03",
    category: "DELIVERY",
    description: "Automated continuous integration loops, security scanning, and pipeline workflows.",
    tools: ["GitHub Actions"],
  },
  {
    number: "04",
    category: "SYSTEMS",
    description: "Enterprise directory structures, identity management, and resolution hierarchy.",
    tools: ["Windows Server", "Active Directory", "DNS", "DHCP"],
  },
  {
    number: "05",
    category: "NETWORKING",
    description: "Hardware configuration, switch & router topologies, routing policies, and perimeter boundary defense.",
    tools: ["MikroTik", "Cisco", "Routing", "Firewalls"],
  },
  {
    number: "06",
    category: "OPERATIONS",
    description: "Health telemetry ingestion, diagnostic retention, state resilience, and automated orchestration.",
    tools: ["Monitoring", "Logging", "Backup & Recovery"],
  },
];

export const SUPPORTING_CAPABILITIES: SupportingCapability[] = [
  {
    area: "Scripting & Tooling",
    items: ["Python"],
    note: "Task automation, infrastructure scripts, and utility tooling.",
  },
  {
    area: "Network Hardware",
    items: ["Cisco", "MikroTik"],
    note: "Switchgear configuration, routing policies, and VLAN boundaries.",
  },
  {
    area: "Resilience & Continuity",
    items: ["Backup & Recovery"],
    note: "State preservation, volume backups, and recovery procedures.",
  },
];
