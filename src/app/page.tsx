import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default function RootPage() {
  const sessionCookie = cookies().get('session');

  if (sessionCookie) {
    redirect('/dashboard');
  } else {
    redirect('/signin');
  }

  return null;
}
