import { AuthenticatedHome } from '@/components/home/authenticated-home';

export const metadata = {
  title: 'داشبورد | سامانه یکپارچه',
};

export default function DashboardPage() {
  return <AuthenticatedHome />;
}
