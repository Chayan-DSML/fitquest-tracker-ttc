import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { ExerciseLog } from '@/lib/definitions';
import { format } from 'date-fns';

export function ExerciseTable({ data }: { data: ExerciseLog[] }) {
    if (data.length === 0) {
        return (
            <div className="flex items-center justify-center h-40 rounded-lg border border-dashed">
                <p className="text-muted-foreground">No workouts logged yet.</p>
            </div>
        );
    }
  return (
    <div className="rounded-md border">
        <Table>
            <TableHeader>
                <TableRow>
                <TableHead>Exercise</TableHead>
                <TableHead className="text-center">Weight</TableHead>
                <TableHead className="text-center">Sets</TableHead>
                <TableHead className="text-center">Reps</TableHead>
                <TableHead className="text-right">Date</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {data.map(log => (
                <TableRow key={log.id}>
                    <TableCell className="font-medium">{log.exerciseName}</TableCell>
                    <TableCell className="text-center">{log.weight} lbs</TableCell>
                    <TableCell className="text-center">{log.sets}</TableCell>
                    <TableCell className="text-center">{log.reps}</TableCell>
                    <TableCell className="text-right">{format(new Date(log.date), 'MMM d, yyyy')}</TableCell>
                </TableRow>
                ))}
            </TableBody>
        </Table>
    </div>
  );
}
