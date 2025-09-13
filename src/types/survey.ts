export interface Answer {
  text: string;
  category: string;
}

export interface Question {
  quiz_name: string;
  question: string;
  answers: {
    A: Answer;
    B: Answer;
    C: Answer;
    D: Answer;
  };
  type: "secure" | "insecure";
  order: number;
}

export interface QuestionnaireResponse {
  success: boolean;
  message: string;
  data: Question[];
}

export interface SurveyAnswer {
  questionIndex: number;
  questionOrder: number;
  selectedOption: "A" | "B" | "C" | "D";
  category: string;
  quizName: string;
}

export interface SurveySubmission {
  type: "secure" | "insecure";
  answers: SurveyAnswer[];
  completedAt: string;
}

export interface SurveyResultArchetype {
  primary: string;
  name: string;
}

export interface SurveyResultSummary {
  "Kompas Nilai": string;
  "Peralatan Andalan": string;
  "Medan Ideal": string;
}

export interface SurveyResultMissionChallenge {
  title: string;
  mission_1: string;
  mission_2: string;
}

// Secure Survey Result (Navigator)
export interface SecureSurveyResultData {
  archetype: {
    primary: string;
    secondary: string;
    name: string;
  };
  summary: {
    "Kompas Nilai": string;
    "Peralatan Andalan": string;
    "Medan Ideal": string;
    "Path Karir": string;
  };
  description: string;
  mission_challenge: SurveyResultMissionChallenge;
  note: string;
}

// Insecure Survey Result (Pahlawan)
export interface InsecureSurveyResultData {
  title: string;
  hero_name: string;
  super_strength: string;
  learning_mode: string;
  motivation_fuel: string;
  mission_challenge: SurveyResultMissionChallenge;
  note: string;
}

// Union type for both result formats
export type SurveyResultData =
  | SecureSurveyResultData
  | InsecureSurveyResultData;

// Type guards to distinguish between the two
export function isSecureResult(
  data: SurveyResultData
): data is SecureSurveyResultData {
  return "archetype" in data;
}

export function isInsecureResult(
  data: SurveyResultData
): data is InsecureSurveyResultData {
  return "title" in data;
}

export interface SurveyResultResponse {
  success: boolean;
  message: string;
  data: SurveyResultData;
}
