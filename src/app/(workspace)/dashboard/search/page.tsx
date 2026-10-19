import { redirect } from 'next/navigation';

export default function SearchPage() {
  redirect('/dashboard/events?tab=search');
}
