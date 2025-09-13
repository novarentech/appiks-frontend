"use client";

import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { ChevronLeft, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import { Question } from "@/types/survey";
import { useAuthData } from "@/hooks/useAuth";

interface SurveyProps {
  className?: string;
}

export function Survey({}: SurveyProps = {}) {
  const router = useRouter();
  const { token } = useAuthData();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<number, string>
  >({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [surveyType, setSurveyType] = useState<"secure" | "insecure">("secure");

  // Get survey type from sessionStorage based on isSafe value
  useEffect(() => {
    try {
      const isSafeStr = sessionStorage.getItem("mood_is_safe");
      if (isSafeStr !== null) {
        const isSafe = JSON.parse(isSafeStr);
        setSurveyType(isSafe ? "secure" : "insecure");
      }
    } catch (error) {
      console.error("Failed to parse isSafe from sessionStorage:", error);
      // Default to secure if parsing fails
      setSurveyType("secure");
    }
  }, []);

  const fetchQuestions = useCallback(async () => {
    if (!token) {
      setError("Authentication required");
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`/api/questionnaire?type=${surveyType}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success && data.data) {
        const mappedQuestions: Question[] = data.data.map((item: Question) => ({
          quiz_name: item.quiz_name,
          question: item.question,
          answers: item.answers,
          type: item.type,
          order: item.order,
        }));
        setQuestions(mappedQuestions);
      } else {
        throw new Error("Invalid response format");
      }
    } catch (err) {
      console.error("Failed to fetch questions:", err);
      setError(err instanceof Error ? err.message : "Failed to load questions");
    } finally {
      setIsLoading(false);
    }
  }, [token, surveyType]);

  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  const refetchQuestions = () => {
    fetchQuestions();
  };

  const handleBackToDashboard = () => {
    router.push("/dashboard");
  };

  const handleAnswerChange = (value: string) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQuestionIndex]: value,
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Submit survey
      handleSubmitSurvey();
    }
  };

  const handleSubmitSurvey = async () => {
    if (!token) {
      setError("Authentication required");
      return;
    }

    try {
      setIsSubmitting(true);

      // Convert selectedAnswers to array of answer strings
      const answersArray: string[] = [];

      // Sort by question index and get the answer text
      for (let i = 0; i < questions.length; i++) {
        const selectedOption = selectedAnswers[i]; // This should be 'A', 'B', 'C', or 'D'
        if (selectedOption && questions[i]) {
          const answerText =
            questions[i].answers[selectedOption as "A" | "B" | "C" | "D"]?.text;
          if (answerText) {
            answersArray.push(answerText);
          }
        }
      }

      const response = await fetch(`/api/questionnaire/${surveyType}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          answers: answersArray,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {
        // Store result in sessionStorage or pass via URL params
        sessionStorage.setItem("surveyResult", JSON.stringify(result.data));
        router.push("/survey-result");
      } else {
        throw new Error(result.message || "Failed to submit survey");
      }
    } catch (err) {
      console.error("Failed to submit survey:", err);
      setError(err instanceof Error ? err.message : "Failed to submit survey");
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentQuestion = questions[currentQuestionIndex];
  const progress =
    questions.length > 0
      ? ((currentQuestionIndex + 1) / questions.length) * 100
      : 0;
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const currentAnswer = selectedAnswers[currentQuestionIndex];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Memuat pertanyaan...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error: {error}</p>
          <Button onClick={refetchQuestions}>Coba Lagi</Button>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-gray-600">No questions available</p>
          <Button onClick={handleBackToDashboard} className="mt-4">
            Kembali ke Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <div className="mb-8">
          <Button
            variant="ghost"
            className="p-0 h-auto text-gray-600 hover:text-gray-900 hover:bg-transparent group"
            onClick={handleBackToDashboard}
          >
            <ChevronLeft className="w-4 h-4 mr-2 group-hover:-translate-x-0.5 transition-transform" />
            Ke Halaman Dashboard
          </Button>
        </div>

        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Isi Angket
          </h1>
          <p className="text-gray-600 text-base max-w-2xl mx-auto">
            Respons mu menunjukkan eksplorasi karier yang sehat dan perencanaan
            masa depan yang positif.
          </p>
        </div>

        {/* Survey Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-3xl mx-auto">
          {/* Quiz Section Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              {currentQuestion.quiz_name}
            </h2>
            <span className="text-sm text-indigo-600 font-medium">
              Pertanyaan {currentQuestionIndex + 1} dari {questions.length}
            </span>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <Progress value={progress} className="h-2" />
          </div>

          {/* Question */}
          <div className="mb-8">
            <h3 className="text-lg font-medium text-gray-900 mb-6">
              {currentQuestion.question}
            </h3>

            {/* Answer Options */}
            <RadioGroup
              value={currentAnswer || ""}
              onValueChange={handleAnswerChange}
              className="space-y-3"
            >
              {Object.entries(currentQuestion.answers).map(([key, answer]) => (
                <div
                  key={key}
                  className={`flex items-center space-x-3 p-4 rounded-lg border transition-all ${
                    currentAnswer === key
                      ? "border-indigo-500 bg-indigo-50"
                      : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  <RadioGroupItem
                    value={key}
                    id={key}
                    className="text-indigo-600"
                  />
                  <Label
                    htmlFor={key}
                    className="flex-1 text-gray-700 cursor-pointer leading-relaxed"
                  >
                    {answer.text}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Navigation */}
          <div className="flex justify-end">
            <Button
              onClick={handleNext}
              disabled={!currentAnswer || isSubmitting}
              className="bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {isSubmitting
                ? "Mengirim..."
                : isLastQuestion
                ? "Selesai"
                : "Lanjut"}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
