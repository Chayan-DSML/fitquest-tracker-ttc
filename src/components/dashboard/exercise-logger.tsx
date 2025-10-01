'use client';

import { useEffect, useState, useRef } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { PlusCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { logExercise } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"


export function ExerciseLogger({ uniqueExercises }: { uniqueExercises: string[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [state, formAction] = useFormState(logExercise, undefined);
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);
  const [exerciseName, setExerciseName] = useState('');

  useEffect(() => {
    if (state?.success) {
      toast({
        title: 'Success!',
        description: state.message,
      });
      setIsOpen(false);
      formRef.current?.reset();
      setExerciseName('');
    } else if (state?.message) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: state.message,
      });
    }
  }, [state, toast]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Log Exercise
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Log a New Exercise</DialogTitle>
          <DialogDescription>
            Record your sets, reps, and weight to track your progress.
          </DialogDescription>
        </DialogHeader>
        <form action={formAction} ref={formRef} className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="exerciseName" className="text-right">
              Exercise
            </Label>
            <div className="col-span-3">
              <Select onValueChange={setExerciseName} name="exerciseName">
                  <SelectTrigger>
                      <SelectValue placeholder="Select an exercise" />
                  </SelectTrigger>
                  <SelectContent>
                      {uniqueExercises.map(ex => <SelectItem key={ex} value={ex}>{ex}</SelectItem>)}
                  </SelectContent>
              </Select>
               <Input 
                id="exerciseName" 
                name="exerciseName"
                value={exerciseName}
                onChange={(e) => setExerciseName(e.target.value)}
                placeholder="Or type a new one"
                className="mt-2"
              />
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="sets" className="text-right">
              Sets
            </Label>
            <Input id="sets" name="sets" type="number" defaultValue="3" className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="reps" className="text-right">
              Reps
            </Label>
            <Input id="reps" name="reps" type="number" defaultValue="8" className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="weight" className="text-right">
              Weight (lbs)
            </Label>
            <Input id="weight" name="weight" type="number" step="0.5" placeholder="135" className="col-span-3" />
          </div>
          <DialogFooter>
            <SubmitButton />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {pending ? 'Logging...' : 'Log Exercise'}
    </Button>
  );
}
