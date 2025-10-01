'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import Link from 'next/link';
import { Mail, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { signIn } from '@/lib/actions';

export function SignInForm() {
  const [state, dispatch] = useActionState(signIn, undefined);

  return (
    <form action={dispatch} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="username">Username</Label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input id="username" name="username" placeholder="your_username" required className="pl-10" />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
         <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="m@example.com"
            required
            className="pl-10"
          />
        </div>
      </div>

      {state?.message && (
        <p className="text-sm text-destructive">{state.message}</p>
      )}
      
      <SubmitButton />

      <div className="mt-4 text-center text-sm">
        Don&apos;t have an account?{' '}
        <Link href="/signup" className="underline text-primary hover:text-primary/80">
          Sign up
        </Link>
      </div>
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? 'Signing In...' : 'Sign In'}
    </Button>
  );
}
