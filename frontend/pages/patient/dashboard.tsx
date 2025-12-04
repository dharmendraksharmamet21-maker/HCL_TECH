import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import useAuthStore from '../../store/authStore';
import api from '../../lib/api';

interface DashboardData {
  todayMetric: any;
  weekMetrics: any[];
  upcomingReminders: any[];
  missedReminders: any[];
  healthTip: any;
  patient: any;
}

export default function PatientDashboard() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    useAuthStore.getState().initializeFromStorage();
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  useEffect(() => {
    if (user?.role === 'patient') {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/patient/dashboard');
      setDashboardData(response.data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  if (!user || user.role !== 'patient') {
    return <div>Unauthorized</div>;
  }

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-600">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">🚑 Healthcare Wellness</h1>
            <p className="text-sm text-gray-600">Patient Portal</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-gray-700">Welcome, {user.firstName}</span>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Dashboard Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Wellness Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Steps Today</p>
                <p className="text-3xl font-bold text-gray-900">
                  {dashboardData?.todayMetric?.steps || 0}
                </p>
                <p className="text-xs text-gray-500">Goal: {dashboardData?.todayMetric?.stepGoal || 8000}</p>
              </div>
              <span className="text-4xl">👟</span>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Sleep Hours</p>
                <p className="text-3xl font-bold text-gray-900">
                  {dashboardData?.todayMetric?.sleepHours || 0}h
                </p>
                <p className="text-xs text-gray-500">Goal: {dashboardData?.todayMetric?.sleepGoal || 8}h</p>
              </div>
              <span className="text-4xl">😴</span>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Water Intake</p>
                <p className="text-3xl font-bold text-gray-900">
                  {dashboardData?.todayMetric?.waterIntake || 0}L
                </p>
                <p className="text-xs text-gray-500">Goal: {dashboardData?.todayMetric?.waterGoal || 2}L</p>
              </div>
              <span className="text-4xl">💧</span>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Active Time</p>
                <p className="text-3xl font-bold text-gray-900">
                  {dashboardData?.todayMetric?.activeTime || 0}m
                </p>
                <p className="text-xs text-gray-500">Goal: {dashboardData?.todayMetric?.activeTimeGoal || 30}m</p>
              </div>
              <span className="text-4xl">🏃</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Preventive Care Reminders */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow p-6 mb-8">
              <h2 className="text-xl font-bold mb-4">📋 Upcoming Reminders</h2>
              {dashboardData?.upcomingReminders?.length ? (
                <div className="space-y-3">
                  {dashboardData.upcomingReminders.map((reminder: any) => (
                    <div key={reminder._id} className="p-3 border-l-4 border-blue-500 bg-blue-50">
                      <p className="font-semibold text-gray-900">{reminder.title}</p>
                      <p className="text-sm text-gray-600">{reminder.description}</p>
                      <p className="text-xs text-gray-500">
                        Due: {new Date(reminder.dueDate).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600">No upcoming reminders</p>
              )}
            </div>

            {dashboardData?.missedReminders?.length > 0 && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-bold mb-4 text-red-600">⚠️ Missed Reminders</h2>
                <div className="space-y-3">
                  {dashboardData.missedReminders.map((reminder: any) => (
                    <div key={reminder._id} className="p-3 border-l-4 border-red-500 bg-red-50">
                      <p className="font-semibold text-gray-900">{reminder.title}</p>
                      <p className="text-xs text-gray-500">
                        Was due: {new Date(reminder.dueDate).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Health Tip */}
          <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-lg shadow p-6 h-fit">
            <h2 className="text-xl font-bold mb-4">💡 Health Tip</h2>
            {dashboardData?.healthTip ? (
              <div>
                <p className="font-semibold text-gray-900 mb-2">{dashboardData.healthTip.title}</p>
                <p className="text-sm text-gray-700">{dashboardData.healthTip.content}</p>
                <span className="inline-block mt-3 px-3 py-1 bg-green-200 text-green-800 rounded-full text-xs">
                  {dashboardData.healthTip.category}
                </span>
              </div>
            ) : (
              <p className="text-gray-600">No health tips available</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
