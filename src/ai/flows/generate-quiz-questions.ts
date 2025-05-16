// src/ai/flows/generate-quiz-questions.ts
'use server';
/**
 * @fileOverview AI flow for generating quiz questions from uploaded study materials.
 *
 * - generateQuizQuestions - A function that takes study materials as input and generates a set of quiz questions.
 * - GenerateQuizQuestionsInput - The input type for the generateQuizQuestions function.
 * - GenerateQuizQuestionsOutput - The return type for the generateQuizQuestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateQuizQuestionsInputSchema = z.object({
  studyMaterials: z
    .string()
    .describe(
      'The study materials to generate quiz questions from.  The materials should be in plain text format.'
    ),
  numQuestions: z.number().describe('The number of quiz questions to generate.'),
  quizCategory: z.string().describe('The USMLE category to focus the quiz questions on.'),
  difficulty: z.enum(['easy', 'medium', 'hard']).describe('The difficulty level of the quiz questions.'),
});
export type GenerateQuizQuestionsInput = z.infer<typeof GenerateQuizQuestionsInputSchema>;

const QuizQuestionSchema = z.object({
  question: z.string().describe('The quiz question.'),
  options: z.array(z.string()).describe('The possible answers to the question.'),
  correctAnswer: z.string().describe('The correct answer to the question.'),
  explanation: z.string().describe('Explanation of the correct answer.'),
});

const GenerateQuizQuestionsOutputSchema = z.object({
  questions: z.array(QuizQuestionSchema).describe('The generated quiz questions.'),
});
export type GenerateQuizQuestionsOutput = z.infer<typeof GenerateQuizQuestionsOutputSchema>;

export async function generateQuizQuestions(input: GenerateQuizQuestionsInput): Promise<GenerateQuizQuestionsOutput> {
  return generateQuizQuestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateQuizQuestionsPrompt',
  input: {schema: GenerateQuizQuestionsInputSchema},
  output: {schema: GenerateQuizQuestionsOutputSchema},
  prompt: `You are an expert in creating quiz questions for medical students preparing for the USMLE.  You are given study materials, a number of questions to generate, a quiz category, and a difficulty level.  You must generate the specified number of quiz questions based on the study materials, focused on the specified USMLE category, and at the specified difficulty level.

Study Materials: {{{studyMaterials}}}
Number of Questions: {{{numQuestions}}}
Quiz Category: {{{quizCategory}}}
Difficulty: {{{difficulty}}}

Each question should have 4 possible answers, and only one correct answer. Each question should include an explanation of the correct answer. The questions should be in JSON format.

{{output}}`,
});

const generateQuizQuestionsFlow = ai.defineFlow(
  {
    name: 'generateQuizQuestionsFlow',
    inputSchema: GenerateQuizQuestionsInputSchema,
    outputSchema: GenerateQuizQuestionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
