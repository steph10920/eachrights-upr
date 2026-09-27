// Mirrors the enums and views defined in the Supabase schema
// (upr_dashboard_schema.sql, phase3, phase5).

export type ImplementationStatus =
  | 'implemented'
  | 'partially_implemented'
  | 'not_implemented'
  | 'pending'
  | 'insufficient_information';

export type EvidenceType =
  | 'government_report'
  | 'policy'
  | 'legislation'
  | 'gazette_notice'
  | 'parliamentary_record'
  | 'budget_document'
  | 'court_decision'
  | 'un_document'
  | 'research_report'
  | 'civil_society_report'
  | 'community_evidence'
  | 'other';

export type ActionType =
  | 'legislative_reform'
  | 'policy_change'
  | 'institutional_reform'
  | 'budgetary_measure'
  | 'programme'
  | 'administrative_action'
  | 'other';

export interface RecommendationOverview {
  id: string;
  recommendation_number: string;
  recommendation_text: string;
  recommending_state: string;
  government_response: string | null;
  official_status: ImplementationStatus | null;
  eachrights_assessment: ImplementationStatus | null;
  theme_name: string | null;
  responsible_institution_name: string | null;
  cycle_number: number;
  cycle_year: number;
  country_name: string | null;
  latest_status: ImplementationStatus | null;
  latest_update_date: string | null;
  created_at: string;
  updated_at: string;
}

export interface DashboardTotals {
  total_recommendations: number;
  supported_recommendations: number;
  noted_recommendations: number;
  other_response_recommendations: number;
}

export interface StatusBreakdownRow {
  status: ImplementationStatus;
  total: number;
}

export interface RecentUpdate {
  update_id: string;
  recommendation_id: string;
  recommendation_number: string;
  recommendation_text: string;
  theme_name: string | null;
  status: ImplementationStatus;
  assessment_source: string;
  notes: string | null;
  update_date: string;
}

export interface KeyAreaRow {
  recommendation_id: string;
  recommendation_number: string;
  recommendation_text: string;
  recommending_state: string;
  government_response: string | null;
  current_status: ImplementationStatus;
  theme_name: string | null;
  responsible_institution_name: string | null;
  latest_update_date: string | null;
}

export interface GroupBreakdownRow {
  total_recommendations: number;
  implemented_count: number;
  partially_implemented_count: number;
  not_implemented_count: number;
  pending_count: number;
  insufficient_information_count: number;
}

export interface ThemeBreakdownRow extends GroupBreakdownRow {
  theme_id: string;
  theme_name: string;
}

export interface InstitutionBreakdownRow extends GroupBreakdownRow {
  institution_id: string;
  institution_name: string;
}

export interface TrendRow {
  year: number;
  status: ImplementationStatus;
  total: number;
}

export interface TimelineEntry {
  update_id: string;
  status: ImplementationStatus;
  assessment_source: string;
  notes: string | null;
  update_date: string;
}

export interface EvidenceEntry {
  evidence_id: string;
  title: string;
  evidence_type: EvidenceType;
  url: string | null;
  verification_status: string;
  publication_date: string | null;
}

export interface ActionEntry {
  action_id: string;
  action_type: ActionType;
  title: string;
  description: string | null;
  date_taken: string | null;
}

export interface LookupOption {
  id: string;
  name: string;
}

export interface RecommendationFilters {
  countryId?: string;
  uprCycleId?: string;
  themeId?: string;
  institutionId?: string;
  recommendingState?: string;
  humanRight?: string;
  status?: ImplementationStatus;
  year?: number;
  search?: string;
}

// Display metadata for each status — one place to change labels/colors.
// Colors are deliberately muted institutional tones, not stock traffic-light
// red/amber/green, to match the rest of the dashboard's palette.
export const STATUS_META: Record<
  ImplementationStatus,
  { label: string; text: string; bg: string; border: string }
> = {
  implemented: { label: 'Implemented', text: '#1F5C4C', bg: '#E4EFEA', border: '#B9D6C9' },
  partially_implemented: {
    label: 'Partially implemented',
    text: '#8A5A1E',
    bg: '#F3E8D6',
    border: '#E0C79A',
  },
  not_implemented: { label: 'Not implemented', text: '#8C2E24', bg: '#F3E0DC', border: '#E2B6AC' },
  pending: { label: 'Pending', text: '#4B5563', bg: '#E7E9EC', border: '#CBD1D8' },
  insufficient_information: {
    label: 'Insufficient information',
    text: '#5B5468',
    bg: '#E9E6ED',
    border: '#CFC8D8',
  },
};

export const STATUS_ORDER: ImplementationStatus[] = [
  'implemented',
  'partially_implemented',
  'not_implemented',
  'pending',
  'insufficient_information',
];
