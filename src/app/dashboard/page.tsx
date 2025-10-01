import { redirect } from 'next/navigation';
import {
  getSessionUser,
  getExerciseLogsForUser,
  getUniqueExercisesForUser,
} from '@/lib/data';
import { ProgressChart } from '@/components/dashboard/progress-chart';
import { ExerciseLogger } from '@/components/dashboard/exercise-logger';
import { ExerciseTable } from '@/components/dashboard/exercise-table';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from '@/components/ui/card';

export default async function DashboardPage() {
  const user = await getSessionUser();
  if (!user) {
    redirect('/signin');
  }

  const logs = await getExerciseLogsForUser(user.id);
  const uniqueExercises = await getUniqueExercisesForUser(user.id);

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">
          Welcome back, {user.fullName.split(' ')[0]}!
        </h2>
        <div className="flex items-center space-x-2">
          <ExerciseLogger uniqueExercises={uniqueExercises} />
        </div>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-full lg:col-span-4 shadow-sm">
          <CardHeader>
            <CardTitle>Progress Overview</CardTitle>
            <CardDescription>
              Your weight lifting progress over time.
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            {logs.length > 0 ? (
                <ProgressChart data={logs} uniqueExercises={uniqueExercises} />
            ) : (
                <div className="flex items-center justify-center h-80">
                    <p className="text-muted-foreground">Log an exercise to see your progress.</p>
                </div>
            )}
          </CardContent>
        </Card>
        <Card className="col-span-full lg:col-span-3 shadow-sm">
          <CardHeader>
            <CardTitle>Recent Workouts</CardTitle>
            <CardDescription>
              Your last 10 logged exercises.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ExerciseTable data={logs.slice(0, 10)} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
