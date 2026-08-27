export type DiseaseType = 
  | 'Cancer'
  | "Alzheimer's Disease"
  | "Parkinson's Disease"
  | 'Type 2 Diabetes'
  | 'Inflammatory Disease'
  | 'Custom Disease';

export type TargetType = 'EGFR' | 'BRAF' | 'HER2' | 'CDK4/6' | 'KRAS G12D' | 'BACE1' | 'APP' | 'GSK3B' | 'DRD2' | 'MAO-B' | 'LRRK2' | 'DPP-4' | 'GLP-1R' | 'HDAC1' | 'JAK2' | 'Custom Target' | string;

export interface TargetInfo {
  id: string;
  name: string;
  fullName: string;
  targetType: string; // e.g. "Receptor Tyrosine Kinase", "GPCR", "Aspartyl Protease", "Enzyme"
  associatedDisease: DiseaseType | string;
  researchStatus: string; // e.g. "Extensively Validated Target (Research Reference)"
  description: string;
  pdbId?: string;
  uniprotId?: string;
  biologicalFunction?: string;
  mechanismOfAction?: string;
  diseaseAssociation?: string;
  keyBindingMotif?: string;
}

export type SolubilityLevel = 'Low' | 'Medium' | 'High';
export type ToxicityPreference = 'Low' | 'Very Low';
export type CandidateCount = 10 | 25 | 50 | 100;

export type ActivityLevel = 'High' | 'Moderate' | 'Low';
export type SolubilityRating = 'Good' | 'Moderate' | 'Poor';
export type ToxicityRiskRating = 'Predicted Low Risk' | 'Moderate Risk' | 'High Risk';
export type RankingBadge = 'Excellent' | 'Good' | 'Moderate' | 'Needs Review';

export interface MolecularDescriptors {
  molecularWeight: number; // g/mol
  logP: number; // Partition coefficient
  tpsa: number; // Topological Polar Surface Area in Å²
  hbd: number; // Hydrogen Bond Donors
  hba: number; // Hydrogen Bond Acceptors
  rotatableBonds: number;
  ringCount: number;
  aromaticRingCount?: number;
  heavyAtomCount?: number;
  formalCharge?: number;
  fractionCsp3?: number;
}

export interface AIPredictions {
  predictedActivity: ActivityLevel;
  activityScore: number; // 0 to 100
  targetAffinityKd?: string; // e.g. "2.8 nM"
  predictedSolubility: SolubilityRating;
  solubilityLogS?: number;
  predictedToxicityRisk: ToxicityRiskRating;
  toxicityConfidence?: number;
  qedScore: number; // Quantitative Estimate of Drug-likeness (0-1)
  syntheticAccessibilityScore: number; // 1-10 (lower is easier)
}

export interface ModelExplanation {
  primaryFactor: string;
  points: string[];
  quantumAdvantageNote?: string;
}

export interface SelectionCriterion {
  factor: string;
  satisfied: boolean;
  detail: string;
}

export interface MoleculeCandidate {
  id: string; // e.g. "QMD-001"
  name: string;
  smiles: string;
  canonicalSmiles: string;
  iupacName?: string;
  formula: string;
  disease: DiseaseType | string;
  target: TargetType | string;
  targetActivityLabel?: string; // e.g. "Predicted EGFR Activity"
  generationMethod?: string; // "De Novo Molecular Generation"
  resultStatus?: string; // "Prototype / Demo Prediction"
  overallScore: number; // 0 - 100 (Prototype Ranking Score)
  rankingBadge: RankingBadge;
  descriptors: MolecularDescriptors;
  predictions: AIPredictions;
  explanation: ModelExplanation;
  whySelected?: SelectionCriterion[];
  isValid: boolean;
  lipinskiPassed: boolean;
  createdAt: string;
  isSaved?: boolean;
  tags?: string[];
}

export interface RankingWeights {
  activityWeight: number; // Default 40
  solubilityWeight: number; // Default 20
  toxicityWeight: number; // Default 20
  propertyFitWeight: number; // Default 20
}

export interface DesignParameters {
  disease: DiseaseType;
  customDiseaseName?: string;
  target: TargetType | string;
  customTargetName?: string;
  mwMin: number;
  mwMax: number;
  logPMin: number;
  logPMax: number;
  tpsaMin: number;
  tpsaMax: number;
  maxHbd: number;
  maxHba: number;
  maxRotatableBonds: number;
  desiredSolubility: SolubilityLevel;
  toxicityPreference: ToxicityPreference;
  candidateCount: CandidateCount;
  generationSeed?: number;
  optimizationObjective?: 'balanced' | 'potency' | 'solubility' | 'novelty';
  rankingWeights?: RankingWeights;
}

export interface GenerationRequest {
  disease: string;
  target: string;
  customDiseaseName?: string;
  customTargetName?: string;
  molecularWeightRange: [number, number];
  logPRange: [number, number];
  tpsaRange: [number, number];
  maxHBD: number;
  maxHBA: number;
  maxRotatableBonds: number;
  desiredSolubility: SolubilityLevel;
  toxicityPreference: ToxicityPreference;
  numberOfCandidates: number;
  rankingWeights?: RankingWeights;
}

export interface MolecularDatasetRecord {
  smiles: string;
  target: string;
  disease: string;
  activity: string;
  activityValue: number;
  activityType: 'IC50' | 'Ki' | 'Kd' | 'EC50';
  molecularWeight: number;
  logP: number;
  tpsa: number;
  hbd: number;
  hba: number;
}

export interface Experiment {
  id: string; // e.g. "EXP-2026-084"
  name: string;
  disease: DiseaseType | string;
  target: TargetType | string;
  date: string;
  candidateCount: number;
  validCandidateCount: number;
  modelVersion: string;
  bestCandidateId: string;
  bestCandidateName: string;
  bestScore: number;
  status: 'Completed' | 'Running' | 'Queued' | 'Failed';
  parameters: DesignParameters;
  candidates: MoleculeCandidate[];
  notes?: string;
}

export interface AnalysisResult {
  smiles: string;
  canonicalSmiles: string;
  formula: string;
  isValid: boolean;
  errorMessage?: string;
  descriptors: MolecularDescriptors;
  predictions: AIPredictions;
  lipinskiRuleViolations: string[];
  isLipinskiCompliant: boolean;
  similarityToKnownDrugs?: { name: string; similarity: number; target: string }[];
}

export interface GenerationProgressStep {
  step: number;
  totalSteps: number;
  label: string;
  description: string;
  progressPercent: number;
}

export type PageView = 
  | 'landing'
  | 'dashboard'
  | 'design'
  | 'analysis'
  | 'candidates'
  | 'details'
  | 'compare'
  | 'experiments'
  | 'quantum'
  | 'research'
  | 'settings';
