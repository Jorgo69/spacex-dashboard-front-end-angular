// src/app/models/spacex.model.ts

export interface Rocket {
  id: string;
  name: string;
  description: string;
  flickr_images: string[];
}

export interface Launchpad {
  id: string;
  name: string;
  full_name: string;
  locality: string;
}

export interface Payload {
  id: string;
  type: string;
  orbit: string;
}

export interface Launch {
  id: string;
  name: string;
  date_utc: string;
  success: boolean | null;
  details: string | null;
  links: {
    patch?: { small?: string; large?: string };
    reddit?: { campaign?: string; launch?: string };
    flickr?: { small?: string[]; original?: string[] };
    presskit?: string | null;
    webcast?: string | null; // ← lien YouTube
    article?: string | null; // ← article officiel
    wikipedia?: string | null;
  };
  rocket: string; // ID
  launchpad: string; // ID
  payloads: Payload[];
}

export interface YearStat {
  year: string;
  total: number;
  success_rate: number;
}

export interface DashboardData {
  kpi: {
    total_launches: number;
    success_rate: number;
    next_launch: {
      name: string;
      date_utc: string;
      days_until: number;
    } | null;
  };
  stats_by_year: YearStat[];
  launches: Launch[]; // ou paginé plus tard
}