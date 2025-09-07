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

export interface SurveyResultData {
  archetype: SurveyResultArchetype;
  summary: SurveyResultSummary;
  description: string;
  mission_challenge: SurveyResultMissionChallenge;
  note: string;
}

export interface SurveyResultResponse {
  success: boolean;
  message: string;
  data: SurveyResultData;
}
