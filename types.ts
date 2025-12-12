
export enum Difficulty {
  Novice = 'Novice',
  Intermediate = 'Intermediate',
  Advanced = 'Advanced',
}

export enum MessageSender {
  User = 'user',
  System = 'system', 
  Patient = 'model',
  AutoPilot = 'autopilot', 
  Mentor = 'mentor' // For reflection coach
}

export type MessageType = 'chat' | 'lab_result' | 'interpretation' | 'reflection';

export interface Message {
  id: string;
  text: string;
  sender: MessageSender;
  timestamp: Date;
  type?: MessageType; 
  imageUrl?: string; 
}

export interface Vitals {
  bp: string;
  hr: number;
  rr: number;
  temp: number;
  o2: number;
}

export type CaseCategory = 
  | 'Cardiology' 
  | 'Respiratory' 
  | 'Gastroenterology' 
  | 'Neurology' 
  | 'Trauma' 
  | 'Pediatrics'
  | 'Endocrinology'
  | 'Psychiatry'
  | 'Infectious Disease'
  | 'Dermatology'
  | 'Rheumatology';

export type Role = 'Doctor' | 'Nurse' | 'Paramedic';

export interface DiagnosticAsset {
  id: string;
  name: string;
  type: 'Image' | 'Document' | 'Lab';
  url: string; // Base64 or URL
  description: string; // The text result (e.g., "Fracture of 5th metatarsal")
  mimeType: string;
}

export interface ClinicalCase {
  id: string;
  authorId?: string; // New: Who created it
  institutionId?: string; // New: Which org it belongs to
  visibility?: 'public' | 'institution' | 'private'; // New
  patientName: string;
  age: number;
  gender: string;
  chiefComplaint: string;
  difficulty: Difficulty;
  category: CaseCategory;
  role: Role; 
  description: string;
  avatarUrl: string;
  initialVitals: Vitals;
  systemInstruction: string; 
  diagnosis: string; 
  tags: string[];
  uploadedLabs?: string[]; // Deprecated, use assets
  assets?: DiagnosticAsset[]; // New: Structured assets
  voiceSampleUrl?: string; // New: Audio clip for patient
}

export type PathStepType = 'thought' | 'question' | 'patient_answer' | 'order_test' | 'test_result' | 'diagnosis';

export interface OptimalPathStep {
  stepId: number;
  type: PathStepType;
  content: string; 
  reasoning?: string; 
}

export interface TimelineEvent {
  turnIndex: number;
  type: 'good' | 'bad' | 'neutral' | 'critical';
  comment: string;
  originalMessage: string;
}

export interface CostItem {
  item: string;
  cost: number;
  isNecessary: boolean;
  notes: string;
}

export interface NoteAnalysis {
  structuredNote: string; 
  feedback: string;
  missingInfo: string[];
}

export interface SimulationScore {
  totalScore: number; 
  diagnosisCorrect: boolean;
  userDiagnosis: string;
  actualDiagnosis: string;
  accuracyScore: number;
  efficiencyScore: number;
  communicationScore: number;
  empathyFeedback: string;
  handoverScore: number;
  handoverFeedback: string;
  totalBill: number;
  billBreakdown: CostItem[];
  feedbackSummary: string;
  keyTakeaway: string;
  missedCriticalSteps: string[];
  timelineAnalysis: TimelineEvent[]; // New: For Replay
  nextRecommendedSteps: string[]; // New: Adaptive learning
}

// --- NETWORK & JOBS TYPES ---

export interface Institution {
  id: string;
  name: string;
  logo: string;
  type: 'University' | 'Hospital' | 'Organization';
  memberCount: number;
}

export interface JobListing {
  id: string;
  title: string;
  institution: Institution;
  location: string;
  salaryRange: string;
  description: string; // Added description
  requirements: {
    minTotalScore?: number;
    requiredCategoryBadges?: CaseCategory[];
    minCasesSolved?: number;
  };
  postedDate: Date;
}

export interface Experience {
  id: string;
  title: string;
  institution: string;
  startYear: string;
  endYear: string | 'Present';
  description: string;
}

export interface Education {
  school: string;
  degree: string;
  year: string;
}

export interface UserProfile {
  id: string;
  name: string;
  headline?: string; // New: e.g. "Internal Medicine Resident @ UCSF"
  location?: string;
  about?: string;
  avatar: string;
  role: Role;
  institutionId?: string;
  totalScore: number;
  casesCompleted: number;
  connections: string[]; // IDs of friends
  badges: string[];
  experience?: Experience[];
  education?: Education[];
  skills?: string[];
  isConnectable?: boolean; // UI state
  communities?: string[]; // IDs of communities they belong to
}

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  text: string;
  timestamp: Date;
}

export interface SocialPost {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  userRole: Role;
  caseId?: string; 
  caseTitle?: string;
  caseDescription?: string; // For rich cards
  caseDifficulty?: Difficulty;
  caseCategory?: CaseCategory;
  institutionId?: string; // New: If posted to institution feed
  visibility: 'network' | 'community';
  targetCommunity?: string; // Name of community
  topic: string; 
  content: string;
  likes: number;
  comments: Comment[];
  timestamp: Date;
  isLiked?: boolean;
  type: 'update' | 'case' | 'reflection' | 'article';
}

export interface LeaderboardEntry {
  rank: number;
  user: UserProfile;
}

export interface BadgeDef {
    id: string;
    name: string;
    icon: string;
    description: string;
    condition: string;
    category: 'skill' | 'achievement' | 'specialty';
}

export interface Community {
  id: string;
  name: string;
  type: 'Hospital' | 'Specialty Group' | 'Alumni' | 'University Group' | 'Organization';
  memberCount: number;
  image: string;
  access: 'open' | 'approval';
  isJoined?: boolean;
}