import { AuthProvider } from '@/context/auth-context';
import Dashboard from '@/components/dashboard/dashboard';

export default async function Home() {

  return (
    <AuthProvider >
      <Dashboard />
    </AuthProvider>
  );
}