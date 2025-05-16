"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { ListPlus, Sparkles, Loader2, AlertTriangle, CheckCircle } from 'lucide-react';
import { generateQuizQuestions } from '@/ai/flows/generate-quiz-questions';
import type { GenerateQuizQuestionsInput, GenerateQuizQuestionsOutput, StudyMaterial, GeneratedQuiz } from '@/types';
import { useQuiz } from '@/context/quiz-context';
import { useToast } from '@/hooks/use-toast';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const mockMaterials: StudyMaterial[] = [
  { id: '1', name: 'Cardiology Basics.pdf', type: 'PDF', uploadDate: '2024-07-15', content: 'Cardiology is the study of the heart, including its structure, function, and diseases. Key topics include myocardial infarction, arrhythmias, and heart failure.' },
  { id: '2', name: 'Renal Physiology Notes.docx', type: 'DOC', uploadDate: '2024-07-10', content: 'The kidneys filter blood, remove waste, and regulate electrolytes. Glomerular filtration rate (GFR) is a key measure of kidney function.' },
  { id: '3', name: 'Endocrine System Overview.pptx', type: 'PPT', uploadDate: '2024-07-05', content: 'The endocrine system uses hormones to regulate bodily functions. Major glands include the pituitary, thyroid, and adrenal glands.' },
];

const usmleCategories = ["Cardiology", "Pulmonology", "Gastroenterology", "Renal", "Endocrinology", "Neurology", "Hematology/Oncology", "Musculoskeletal", "Psychiatry", "Biochemistry", "Microbiology", "Pharmacology"];

const quizBuilderSchema = z.object({
  materialId: z.string().min(1, "Please select study material."),
  category: z.string().min(1, "Please select a category."),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  numQuestions: z.coerce.number().min(1, "Minimum 1 question.").max(20, "Maximum 20 questions."),
});

type QuizBuilderFormValues = z.infer<typeof quizBuilderSchema>;

export default function QuizBuilderPage() {
  const router = useRouter();
  const { setCurrentQuiz } = useQuiz();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [generatedQuizInfo, setGeneratedQuizInfo] = useState<{title: string, numQuestions: number} | null>(null);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<QuizBuilderFormValues>({
    resolver: zodResolver(quizBuilderSchema),
    defaultValues: {
      materialId: '',
      category: '',
      difficulty: 'medium',
      numQuestions: 5,
    },
  });

  const onSubmit: SubmitHandler<QuizBuilderFormValues> = async (data) => {
    setIsLoading(true);
    setError(null);
    setGeneratedQuizInfo(null);

    const selectedMaterial = mockMaterials.find(m => m.id === data.materialId);
    if (!selectedMaterial || !selectedMaterial.content) {
      toast({ title: 'Error', description: 'Selected study material content not found.', variant: 'destructive' });
      setIsLoading(false);
      return;
    }

    const input: GenerateQuizQuestionsInput = {
      studyMaterials: selectedMaterial.content,
      numQuestions: data.numQuestions,
      quizCategory: data.category,
      difficulty: data.difficulty,
    };

    try {
      const output: GenerateQuizQuestionsOutput = await generateQuizQuestions(input);
      const newQuiz: GeneratedQuiz = {
        id: String(Date.now()),
        title: `${data.category} Quiz (${data.difficulty})`,
        questions: output.questions.map((q, index) => ({ ...q, id: String(index) })),
        sourceMaterialName: selectedMaterial.name,
        category: data.category,
        difficulty: data.difficulty,
        numQuestions: output.questions.length,
      };
      setCurrentQuiz(newQuiz);
      setGeneratedQuizInfo({title: newQuiz.title, numQuestions: newQuiz.numQuestions});
      toast({ title: 'Quiz Generated!', description: `Successfully created "${newQuiz.title}". You can now start the practice quiz.`, variant: 'default' });
      form.reset(); // Optionally reset form
    } catch (err) {
      console.error("Failed to generate quiz:", err);
      setError("Failed to generate quiz. The AI model might be busy or encountered an issue. Please try again.");
      toast({ title: 'Quiz Generation Failed', description: 'An error occurred while generating the quiz.', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Quiz Builder" description="Generate custom quizzes from your study materials." icon={ListPlus} />
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Sparkles className="text-primary" />Customize Your Quiz</CardTitle>
              <CardDescription>Select your study material, category, difficulty, and number of questions.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="materialId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Study Material</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger><SelectValue placeholder="Select a material" /></SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {mockMaterials.map(material => (
                          <SelectItem key={material.id} value={material.id}>{material.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>USMLE Category</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger><SelectValue placeholder="Select a category" /></SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {usmleCategories.map(category => (
                          <SelectItem key={category} value={category}>{category}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="difficulty"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Difficulty</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger><SelectValue placeholder="Select difficulty" /></SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="easy">Easy</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="hard">Hard</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="numQuestions"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Number of Questions</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="e.g., 10" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Generate Quiz
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </form>
      </Form>

      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Generation Failed</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {generatedQuizInfo && (
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-600"><CheckCircle /> Quiz Ready!</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-semibold">{generatedQuizInfo.title}</p>
            <p className="text-muted-foreground">{generatedQuizInfo.numQuestions} questions generated.</p>
          </CardContent>
          <CardFooter>
            <Button onClick={() => router.push('/practice-quiz')}>
              Start Practice Quiz
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
