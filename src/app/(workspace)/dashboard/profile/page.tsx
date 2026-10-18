import { AccountProfilePage } from '@/components/dashboard/account-center';
import { redirect } from 'next/navigation';

type ProfilePageProps = {
  searchParams: Promise<{ tab?: string; person?: string }>;
};

export default async function ProfilePage({ searchParams }: ProfilePageProps) {
  const query = await searchParams;
  if (query.tab === 'organization' || query.person) {
    const person = query.person ? `?person=${encodeURIComponent(query.person)}` : '';
    redirect(`/dashboard/organization${person}`);
  }

  return <AccountProfilePage />;
}
