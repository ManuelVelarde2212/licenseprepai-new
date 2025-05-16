"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Lightbulb, CheckCircle, XCircle, ChevronsRight, RotateCcw, BookOpen, Trophy } from 'lucide-react';
import type { QuizQuestion, GeneratedQuiz } from '@/types';
import { useQuiz } from '@/context/quiz-context';
import { Separator } from '@/components/ui/separator';
import { ClientOnly } from '@/components/client-only';

export default function PracticeQuizPage() {
  const router = useRouter();
  const { currentQuiz, setCurrentQuiz } = useQuiz();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);

  const question: QuizQuestion | undefined = currentQuiz?.questions[currentQuestionIndex];

  useEffect(() => {
    // Reset state if quiz changes or on initial load
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setIsAnswerSubmitted(false);
    setScore(0);
    setShowExplanation(false);
  }, [currentQuiz]);

  if (!currentQuiz) {
    return (
       <ClientOnly> {/* Ensure this only runs client-side to avoid hydration issues with router and context */}
        <div className="space-y-6 flex flex-col items-center justify-center min-h-[calc(100vh-10rem)]">
          <PageHeader title="Practice Quiz" icon={Lightbulb} />
          <Card className="w-full max-w-md text-center shadow-lg">
            <CardHeader>
              <CardTitle>No Quiz Selected</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Please generate a quiz from the Quiz Builder page first.</p>
            </CardContent>
            <CardFooter className="justify-center">
              <Button onClick={() => router.push('/quiz-builder')}>Go to Quiz Builder</Button>
            </CardFooter>
          </Card>
        </div>
      </ClientOnly>
    );
  }

  const handleAnswerSubmit = () => {
    if (!question || selectedAnswer === null) return;
    setIsAnswerSubmitted(true);
    if (selectedAnswer === question.correctAnswer) {
      setScore(prev => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    setSelectedAnswer(null);
    setIsAnswerSubmitted(false);
    setShowExplanation(false);
    if (currentQuestionIndex < currentQuiz.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      // Quiz finished, handled by quiz completion card
    }
  };

  const handleRestartQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setIsAnswerSubmitted(false);
    setScore(0);
    setShowExplanation(false);
  };

  const progressPercentage = ((currentQuestionIndex + (isAnswerSubmitted ? 1: 0)) / currentQuiz.questions.length) * 100;
  const isQuizFinished = isAnswerSubmitted && currentQuestionIndex === currentQuiz.questions.length - 1;


  if (isQuizFinished) {
    return (
      <ClientOnly>
        <div className="space-y-6 flex flex-col items-center justify-center min-h-[calc(100vh-10rem)]">
         <PageHeader title="Quiz Complete!" icon={Trophy} />
          <Card className="w-full max-w-lg text-center shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl text-primary">{currentQuiz.title}</CardTitle>
              <CardDescription>You've completed the quiz. Well done!</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-4xl font-bold">
                Your Score: {score} / {currentQuiz.questions.length}
              </div>
              <Progress value={(score / currentQuiz.questions.length) * 100} className="h-3" />
              <p className="text-lg">
                You answered {((score / currentQuiz.questions.length) * 100).toFixed(0)}% of questions correctly.
              </p>
            </CardContent>
            <CardFooter className="flex flex-col sm:flex-row justify-center gap-2">
              <Button onClick={handleRestartQuiz} variant="outline">
                <RotateCcw className="mr-2 h-4 w-4" /> Restart Quiz
              </Button>
              <Button onClick={() => router.push('/quiz-builder')}>
                <ListPlus className="mr-2 h-4 w-4" /> Build Another Quiz
              </Button>
            </CardFooter>
          </Card>
        </div>
      </ClientOnly>
    );
  }
  
  if (!question) {
     return (
      <ClientOnly>
        <div className="space-y-6 flex flex-col items-center justify-center min-h-[calc(100vh-10rem)]">
            <PageHeader title="Loading Quiz..." icon={Lightbulb} />
            <p className="text-muted-foreground">Preparing your quiz...</p>
        </div>
      </ClientOnly>
    );
  }

  return (
    <ClientOnly>
      <div className="space-y-6">
        <PageHeader title={currentQuiz.title} description={`Question ${currentQuestionIndex + 1} of ${currentQuiz.questions.length}`} icon={Lightbulb} />
        
        <Progress value={progressPercentage} className="w-full h-2 mb-4" />

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl md:text-2xl leading-relaxed">{question.question}</CardTitle>
          </CardHeader>
          <CardContent>
            <RadioGroup
              value={selectedAnswer || ''}
              onValueChange={setSelectedAnswer}
              disabled={isAnswerSubmitted}
              className="space-y-3"
            >
              {question.options.map((option, index) => {
                const isCorrect = option === question.correctAnswer;
                const isSelected = option === selectedAnswer;
                let itemClass = "border-border hover:border-primary";
                if (isAnswerSubmitted) {
                  if (isCorrect) itemClass = "border-green-500 bg-green-500/10";
                  else if (isSelected && !isCorrect) itemClass = "border-red-500 bg-red-500/10";
                }

                return (
                  <Label
                    key={index}
                    htmlFor={`option-${index}`}
                    className={`flex items-center space-x-3 p-4 border rounded-md cursor-pointer transition-all ${itemClass} ${isAnswerSubmitted ? 'cursor-default' : ''}`}
                  >
                    <RadioGroupItem value={option} id={`option-${index}`} />
                    <span>{option}</span>
                    {isAnswerSubmitted && isCorrect && <CheckCircle className="ml-auto h-5 w-5 text-green-500" />}
                    {isAnswerSubmitted && isSelected && !isCorrect && <XCircle className="ml-auto h-5 w-5 text-red-500" />}
                  </Label>
                );
              })}
            </RadioGroup>
          </CardContent>
          <CardFooter className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="text-sm text-muted-foreground">
              Difficulty: <span className="font-semibold capitalize">{currentQuiz.difficulty}</span>
            </div>
            {!isAnswerSubmitted ? (
              <Button onClick={handleAnswerSubmit} disabled={!selectedAnswer}>
                Submit Answer
              </Button>
            ) : (
              <Button onClick={handleNextQuestion}>
                {currentQuestionIndex === currentQuiz.questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
                <ChevronsRight className="ml-2 h-4 w-4" />
              </Button>
            )}
          </CardFooter>
        </Card>

        {isAnswerSubmitted && (
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="text-primary h-5 w-5" />
                Explanation
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedAnswer === question.correctAnswer ? (
                <Alert variant="default" className="bg-green-500/10 border-green-500">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <AlertTitle className="text-green-700">Correct!</AlertTitle>
                </Alert>
              ) : (
                <Alert variant="destructive" className="bg-red-500/10 border-red-500">
                  <XCircle className="h-5 w-5 text-red-600" />
                  <AlertTitle className="text-red-700">Incorrect</AlertTitle>
                  <AlertDescription className="text-red-600">
                    The correct answer was: <strong>{question.correctAnswer}</strong>
                  </AlertDescription>
                </Alert>
              )}
              <Separator className="my-4" />
              <div className="prose prose-sm dark:prose-invert max-w-none text-foreground">
                <p>{question.explanation}</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </ClientOnly>
  );
}
