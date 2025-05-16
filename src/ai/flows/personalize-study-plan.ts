// src/ai/flows/personalize-study-plan.ts
'use server';

/**
 * @fileOverview AI-powered personalized study plan recommendations.
 *
 * - personalizeStudyPlan - A function that provides personalized study recommendations.
 * - PersonalizeStudyPlanInput - The input type for the personalizeStudyPlan function.
 * - PersonalizeStudyPlanOutput - The return type for the personalizeStudyPlan function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PersonalizeStudyPlanInputSchema = z.object({
  userPerformanceData: z
    .string()
    .describe(
      'A string containing the user performance data, including topics, scores, and time spent.'
    ),
  learningGoals: z
    .string()
    .describe('A string describing the user learning goals and objectives.'),
});
export type PersonalizeStudyPlanInput = z.infer<typeof PersonalizeStudyPlanInputSchema>;

const PersonalizeStudyPlanOutputSchema = z.object({
  studyRecommendations: z
    .string()
    .describe(
      'A string containing personalized study recommendations, including topics to review and suggested quizzes.'
    ),
});
export type PersonalizeStudyPlanOutput = z.infer<typeof PersonalizeStudyPlanOutputSchema>;

export async function personalizeStudyPlan(
  input: PersonalizeStudyPlanInput
): Promise<PersonalizeStudyPlanOutput> {
  return personalizeStudyPlanFlow(input);
}

const prompt = ai.definePrompt({
  name: 'personalizeStudyPlanPrompt',
  input: {schema: PersonalizeStudyPlanInputSchema},
  output: {schema: PersonalizeStudyPlanOutputSchema},
  prompt: `You are an AI-powered study plan generator. Analyze the user's performance data and learning goals to provide personalized study recommendations.

User Performance Data: {{{userPerformanceData}}}
Learning Goals: {{{learningGoals}}}

Provide study recommendations to help the user focus on their weakest areas.`,
});

const personalizeStudyPlanFlow = ai.defineFlow(
  {
    name: 'personalizeStudyPlanFlow',
    inputSchema: PersonalizeStudyPlanInputSchema,
    outputSchema: PersonalizeStudyPlanOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
