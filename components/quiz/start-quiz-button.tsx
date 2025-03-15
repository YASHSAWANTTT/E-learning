"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

interface StartQuizButtonProps {
  quizId: string;
}

export function StartQuizButton({ quizId }: StartQuizButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleStartQuiz = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/quizzes/${quizId}/attempt`, {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Failed to start quiz");
      }

      const data = await response.json();
      router.push(`/quizzes/${quizId}/take`);
    } catch (error) {
      console.error("Error starting quiz:", error);
      alert("Failed to start quiz. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button onClick={handleStartQuiz} disabled={isLoading}>
      {isLoading ? "Starting..." : "Start Quiz"}
    </Button>
  );
} 