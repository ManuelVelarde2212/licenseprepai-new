"use client";

import { useEffect, useState, useMemo } from 'react';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { BarChart, BookOpenText, TrendingUp, Lightbulb, Zap, CheckCircle2, AlertTriangle, LayoutDashboard } from 'lucide-react';
import type { UserPerformanceMetrics, AIStudyRecommendations } from '@/types';
import { personalizeStudyPlan } from '@/ai/flows/personalize-study-plan';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import { Bar, BarChart as RechartsBarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { ClientOnly } from '@/components/client-only';

const mockPerformanceData: UserPerformanceMetrics = {
  readinessScore: 78,
  masteryLevels: [
    { topic: 'Cardiology', level: 85 },
    { topic: 'Pulmonology', level: 70 },
    { topic: 'Renal', level: 60 },
    { topic: 'Endocrinology', level: 90 },
    { topic: 'Neurology', level: 75 },
  ],
  performanceTrends: [
    { date: 'Jan', score: 65, subject: 'Overall' },
    { date: 'Feb', score: 70, subject: 'Overall' },
    { date: 'Mar', score: 72, subject: 'Overall' },
    { date: 'Apr', score: 78, subject: 'Overall' },
  ],
};

const chartConfig = {
  score: {
    label: "Score",
    color: "hsl(var(--chart-1))",
  },
  level: {
    label: "Mastery Level",
    color: "hsl(var(--chart-2))",
  }
} satisfies Parameters<typeof ChartContainer>[0]["config"];


export default function DashboardPage() {
  const [recommendations, setRecommendations] = useState<AIStudyRecommendations | null>(null);
  const [isLoadingRecommendations, setIsLoadingRecommendations] = useState(true);
  const [errorRecommendations, setErrorRecommendations] = useState<string | null>(null);
  const [performanceData, setPerformanceData] = useState<UserPerformanceMetrics | null>(null);

  useEffect(() => {
    // Simulate fetching initial performance data
    setPerformanceData(mockPerformanceData);

    async function fetchRecommendations() {
      setIsLoadingRecommendations(true);
      setErrorRecommendations(null);
      try {
        // For AI call, user performance data needs to be stringified
        const userPerformanceString = JSON.stringify({
          scores: mockPerformanceData.masteryLevels,
          overallReadiness: mockPerformanceData.readinessScore,
        });
        const learningGoalsString = "Improve overall USMLE score, focusing on weaker areas like Renal and Pulmonology. Aim for 85+ readiness score.";
        
        const result = await personalizeStudyPlan({
          userPerformanceData: userPerformanceString,
          learningGoals: learningGoalsString,
        });
        setRecommendations(result);
      } catch (error) {
        console.error("Failed to fetch study recommendations:", error);
        setErrorRecommendations("Could not load AI study recommendations. Please try again later.");
      } finally {
        setIsLoadingRecommendations(false);
      }
    }
    fetchRecommendations();
  }, []);

  const readinessColor = useMemo(() => {
    if (!performanceData) return 'bg-muted';
    if (performanceData.readinessScore >= 80) return 'bg-green-500';
    if (performanceData.readinessScore >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  }, [performanceData]);

  if (!performanceData) {
    return (
      <div className="space-y-6">
        <PageHeader title="Dashboard" description="Your personalized USMLE study overview." icon={LayoutDashboard} />
        <Skeleton className="h-32 w-full" />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-48 w-full" />
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <PageHeader title="Dashboard" description="Your personalized USMLE study overview." icon={LayoutDashboard} />

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="text-primary" />
            Overall Readiness
          </CardTitle>
          <CardDescription>Your current estimated USMLE readiness score.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-5xl font-bold text-primary mb-2">{performanceData.readinessScore}%</div>
          <Progress value={performanceData.readinessScore} indicatorClassName={readinessColor} className="h-4" />
        </CardContent>
        <CardFooter>
          <p className="text-sm text-muted-foreground">Keep up the great work and focus on targeted reviews!</p>
        </CardFooter>
      </Card>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><BarChart className="text-primary" />Mastery Levels</CardTitle>
            <CardDescription>Your proficiency in different USMLE topics.</CardDescription>
          </CardHeader>
          <CardContent>
          <ClientOnly fallback={<Skeleton className="h-[200px] w-full" />}>
            <ChartContainer config={chartConfig} className="h-[200px] w-full">
              <RechartsBarChart data={performanceData.masteryLevels} layout="vertical" margin={{left: 10, right:10}}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" domain={[0, 100]} tickFormatter={(value) => `${value}%`} />
                <YAxis dataKey="topic" type="category" width={80} tickLine={false} axisLine={false} />
                <Tooltip cursor={{ fill: 'hsl(var(--muted))' }} content={<ChartTooltipContent indicator="dot" />} />
                <Bar dataKey="level" fill="var(--color-level)" radius={4} />
              </RechartsBarChart>
            </ChartContainer>
            </ClientOnly>
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><TrendingUp className="text-primary" />Performance Trends</CardTitle>
            <CardDescription>Your progress over the past few months.</CardDescription>
          </CardHeader>
          <CardContent>
            <ClientOnly fallback={<Skeleton className="h-[200px] w-full" />}>
              <ChartContainer config={chartConfig} className="h-[200px] w-full">
                <RechartsBarChart accessibilityLayer data={performanceData.performanceTrends} margin={{left: -25, right:10}}>
                  <CartesianGrid vertical={false} />
                   <XAxis
                    dataKey="date"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                  />
                  <YAxis domain={[0,100]} tickFormatter={(value) => `${value}%`} />
                  <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                  <Bar dataKey="score" fill="var(--color-score)" radius={8} />
                </RechartsBarChart>
              </ChartContainer>
            </ClientOnly>
          </CardContent>
        </Card>
        
        <Card className="shadow-md md:col-span-2 lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Lightbulb className="text-primary" />AI Study Recommendations</CardTitle>
            <CardDescription>Personalized suggestions to boost your preparation.</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingRecommendations ? (
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            ) : errorRecommendations ? (
               <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{errorRecommendations}</AlertDescription>
                </Alert>
            ) : recommendations ? (
              <div className="prose prose-sm dark:prose-invert max-w-none text-foreground">
                <p>{recommendations.studyRecommendations}</p>
              </div>
            ) : (
              <p className="text-muted-foreground">No recommendations available at the moment.</p>
            )}
          </CardContent>
          <CardFooter>
             <Button variant="outline" size="sm">
                <BookOpenText className="mr-2 h-4 w-4" />
                Explore Recommended Topics
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
