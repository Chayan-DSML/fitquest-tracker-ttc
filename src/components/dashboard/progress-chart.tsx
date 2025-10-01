'use client';

import { useState, useMemo } from 'react';
import { Line, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import {
  ChartContainer,
  ChartTooltipContent,
} from '@/components/ui/chart';
import type { ExerciseLog } from '@/lib/definitions';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { format } from 'date-fns';

export function ProgressChart({ data, uniqueExercises }: { data: ExerciseLog[], uniqueExercises: string[] }) {
  const [selectedExercise, setSelectedExercise] = useState(uniqueExercises[0] || '');

  const chartData = useMemo(() => {
    return data
      .filter(log => log.exerciseName === selectedExercise)
      .map(log => ({
        date: new Date(log.date),
        weight: log.weight,
      }))
      .sort((a, b) => a.date.getTime() - b.date.getTime());
  }, [data, selectedExercise]);

  const chartConfig = {
    weight: {
      label: 'Weight (lbs)',
      color: 'hsl(var(--primary))',
    },
  };
  
  if (uniqueExercises.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
        <div className="w-full max-w-sm px-2">
            <Select onValueChange={setSelectedExercise} defaultValue={selectedExercise}>
                <SelectTrigger>
                    <SelectValue placeholder="Select an exercise" />
                </SelectTrigger>
                <SelectContent>
                    {uniqueExercises.map(ex => <SelectItem key={ex} value={ex}>{ex}</SelectItem>)}
                </SelectContent>
            </Select>
        </div>
        {chartData.length > 1 ? (
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis
                    dataKey="date"
                    tickFormatter={(tick) => format(tick, 'MMM d')}
                    tickLine={false}
                    axisLine={false}
                />
                <YAxis
                    tickLine={false}
                    axisLine={false}
                    domain={['dataMin - 10', 'dataMax + 10']}
                />
                <Tooltip
                    cursor={{
                        stroke: 'hsl(var(--muted-foreground))',
                        strokeWidth: 1,
                        strokeDasharray: '3 3',
                    }}
                    content={<ChartTooltipContent />}
                />
                <Line
                    dataKey="weight"
                    type="monotone"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    dot={{ r: 4, fill: 'hsl(var(--primary))' }}
                    activeDot={{ r: 6 }}
                />
            </LineChart>
            </ResponsiveContainer>
        </ChartContainer>
        ) : (
            <div className="flex h-[300px] w-full items-center justify-center text-muted-foreground">
                <p>Not enough data for {selectedExercise} to draw a chart.</p>
            </div>
        )}
    </div>
  );
}
