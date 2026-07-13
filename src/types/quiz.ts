export interface QuizQuestion {
  id: string;
  question: string;
  choices: string[];
  answer: string;
  explanation: string;
}

export interface OxQuestion {
  id: string;
  statement: string;
  answer: boolean;
  explanation: string;
}
