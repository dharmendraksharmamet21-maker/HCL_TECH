import { useRouter } from 'next/router';
import { useEffect } from 'react';
import useAuthStore from '../store/authStore';

export default function Home() {
  const router = useRouter();
  const user = useAuthStore((state: any) => state.user);

  useEffect(() => {
    useAuthStore.getState().initializeFromStorage();
  }, []);

  useEffect(() => {
    if (user) {
      if (user.role === 'patient') {
        router.push('/patient/dashboard');
      } else if (user.role === 'provider') {
        router.push('/provider/dashboard');
      } else {
        router.push('/admin/dashboard');
      }
    } else {
      router.push('/login');
    }
  }, [user, router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">🚑 Healthcare Wellness Portal</h1>
        <p className="text-gray-600">Loading...</p>
      </div>
    </div>
  );
}
