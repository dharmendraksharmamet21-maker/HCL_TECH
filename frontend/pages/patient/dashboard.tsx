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
  const user = useAuthStore((state: any) => state.user);
  const logout = useAuthStore((state: any) => state.logout);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const missedReminders = dashboardData?.missedReminders ?? [];
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    useAuthStore.getState().initializeFromStorage();
    // If no user in storage (direct visit), create a demo patient for local dev
    const storedUser = typeof window !== 'undefined' && localStorage.getItem('user');
    if (!storedUser && !user) {
      const demoUser = {
        id: 'demo-patient',
        email: 'demo.patient@example.com',
        firstName: 'Demo',
        lastName: 'Patient',
        role: 'patient'
      } as any;
      useAuthStore.getState().login('local-dev-token', demoUser);
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
      console.log('Fetching dashboard from:', 'http://localhost:5000/api/patient/dashboard');
      const response = await api.get('/patient/dashboard');
      console.log('Dashboard response:', response.data);
      setDashboardData(response.data);
    } catch (err: any) {
      console.error('Dashboard fetch error:', err);
      console.error('Error response:', err.response);
      console.error('Error message:', err.message);
      // Fallback to demo data if network fails (for local dev without backend)
      const demoData = {
        todayMetric: { steps: 3200, sleepHours: 7, waterIntake: 1.5, activeTime: 25, stepGoal: 8000, sleepGoal: 8, waterGoal: 2, activeTimeGoal: 30 },
        weekMetrics: [],
        upcomingReminders: [],
        missedReminders: [],
        healthTip: { title: 'Stay hydrated', content: 'Drink water regularly.', category: 'Hydration' },
        patient: { firstName: user?.firstName || 'Demo', lastName: user?.lastName || 'Patient', profilePicture: null }
      };
      console.log('Using fallback demo data:', demoData);
      setDashboardData(demoData);
      setError('');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  if (!user) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (user.role !== 'patient') {
    return <div>Unauthorized</div>;
  }

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-600">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-blue-100">
      {/* Navigation */}
      <nav className="bg-white shadow-lg border-b-4 border-blue-500">
        <div className="container mx-auto px-6 py-5 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-green-600">
              🚑 Healthcare Wellness
            </h1>
            <p className="text-sm text-gray-500 mt-1">Patient Portal</p>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-right">
              <p className="text-gray-900 font-semibold">Welcome back, {user.firstName}! 👋</p>
              <p className="text-xs text-gray-500">Patient ID: {user.id}</p>
            </div>
            <button
              onClick={handleLogout}
              className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-6 py-2 rounded-lg font-semibold shadow-md transition-all duration-200 transform hover:scale-105"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Dashboard Content */}
      <div className="container mx-auto px-6 py-8">
        {/* Wellness Metrics - Enhanced Cards */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">📊 Your Wellness Metrics</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Steps Card */}
            <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border-t-4 border-blue-500 transform hover:scale-105">
              <div className="flex items-center justify-between mb-4">
                <span className="text-4xl">👟</span>
                <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-xs font-semibold">
                  {dashboardData?.todayMetric?.steps && dashboardData.todayMetric.steps > (dashboardData.todayMetric.stepGoal || 8000) ? '✓ Goal Met' : 'In Progress'}
                </span>
              </div>
              <p className="text-gray-600 text-sm font-semibold mb-2">Steps Today</p>
              <p className="text-4xl font-bold text-blue-600 mb-2">
                {dashboardData?.todayMetric?.steps || 0}
              </p>
              <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                <div
                  className="bg-gradient-to-r from-blue-400 to-blue-600 h-2 rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.min((dashboardData?.todayMetric?.steps || 0) / (dashboardData?.todayMetric?.stepGoal || 8000) * 100, 100)}%`
                  }}
                />
              </div>
              <p className="text-xs text-gray-500">Goal: {dashboardData?.todayMetric?.stepGoal || 8000}</p>
            </div>

            {/* Sleep Card */}
            <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border-t-4 border-purple-500 transform hover:scale-105">
              <div className="flex items-center justify-between mb-4">
                <span className="text-4xl">😴</span>
                <span className="bg-purple-100 text-purple-600 px-3 py-1 rounded-full text-xs font-semibold">
                  {dashboardData?.todayMetric?.sleepHours && dashboardData.todayMetric.sleepHours >= (dashboardData.todayMetric.sleepGoal || 8) ? '✓ Goal Met' : 'Pending'}
                </span>
              </div>
              <p className="text-gray-600 text-sm font-semibold mb-2">Sleep Hours</p>
              <p className="text-4xl font-bold text-purple-600 mb-2">
                {dashboardData?.todayMetric?.sleepHours || 0}h
              </p>
              <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                <div
                  className="bg-gradient-to-r from-purple-400 to-purple-600 h-2 rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.min((dashboardData?.todayMetric?.sleepHours || 0) / (dashboardData?.todayMetric?.sleepGoal || 8) * 100, 100)}%`
                  }}
                />
              </div>
              <p className="text-xs text-gray-500">Goal: {dashboardData?.todayMetric?.sleepGoal || 8}h</p>
            </div>

            {/* Water Intake Card */}
            <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border-t-4 border-cyan-500 transform hover:scale-105">
              <div className="flex items-center justify-between mb-4">
                <span className="text-4xl">💧</span>
                <span className="bg-cyan-100 text-cyan-600 px-3 py-1 rounded-full text-xs font-semibold">
                  {dashboardData?.todayMetric?.waterIntake && dashboardData.todayMetric.waterIntake >= (dashboardData.todayMetric.waterGoal || 2) ? '✓ Goal Met' : 'Keep Hydrating'}
                </span>
              </div>
              <p className="text-gray-600 text-sm font-semibold mb-2">Water Intake</p>
              <p className="text-4xl font-bold text-cyan-600 mb-2">
                {dashboardData?.todayMetric?.waterIntake || 0}L
              </p>
              <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                <div
                  className="bg-gradient-to-r from-cyan-400 to-cyan-600 h-2 rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.min((dashboardData?.todayMetric?.waterIntake || 0) / (dashboardData?.todayMetric?.waterGoal || 2) * 100, 100)}%`
                  }}
                />
              </div>
              <p className="text-xs text-gray-500">Goal: {dashboardData?.todayMetric?.waterGoal || 2}L</p>
            </div>

            {/* Active Time Card */}
            <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border-t-4 border-green-500 transform hover:scale-105">
              <div className="flex items-center justify-between mb-4">
                <span className="text-4xl">🏃</span>
                <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-xs font-semibold">
                  {dashboardData?.todayMetric?.activeTime && dashboardData.todayMetric.activeTime >= (dashboardData.todayMetric.activeTimeGoal || 30) ? '✓ Goal Met' : 'Move More'}
                </span>
              </div>
              <p className="text-gray-600 text-sm font-semibold mb-2">Active Time</p>
              <p className="text-4xl font-bold text-green-600 mb-2">
                {dashboardData?.todayMetric?.activeTime || 0}m
              </p>
              <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                <div
                  className="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.min((dashboardData?.todayMetric?.activeTime || 0) / (dashboardData?.todayMetric?.activeTimeGoal || 30) * 100, 100)}%`
                  }}
                />
              </div>
              <p className="text-xs text-gray-500">Goal: {dashboardData?.todayMetric?.activeTimeGoal || 30}m</p>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Reminders Section */}
          <div className="lg:col-span-2">
            {/* Upcoming Reminders */}
            <div className="bg-white rounded-xl shadow-lg p-8 mb-8 border-l-4 border-blue-500">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                📋 Upcoming Reminders
                <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm font-semibold">
                  {dashboardData?.upcomingReminders?.length || 0}
                </span>
              </h2>
              {dashboardData?.upcomingReminders?.length ? (
                <div className="space-y-4">
                  {dashboardData.upcomingReminders.map((reminder: any) => (
                    <div
                      key={reminder._id}
                      className="p-4 border-l-4 border-blue-500 bg-gradient-to-r from-blue-50 to-white rounded-lg hover:shadow-md transition-all duration-200"
                    >
                      <p className="font-semibold text-gray-900 text-lg">{reminder.title}</p>
                      <p className="text-sm text-gray-600 mt-2">{reminder.description}</p>
                      <p className="text-xs text-blue-600 font-semibold mt-3">
                        📅 Due: {new Date(reminder.dueDate).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500 text-lg">✨ No upcoming reminders. You're all caught up!</p>
                </div>
              )}
            </div>

            {/* Missed Reminders */}
            {missedReminders.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-8 border-l-4 border-red-500">
                <h2 className="text-2xl font-bold text-red-600 mb-6 flex items-center gap-2">
                  ⚠️ Missed Reminders
                  <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm font-semibold">
                    {missedReminders.length}
                  </span>
                </h2>
                <div className="space-y-4">
                  {missedReminders.map((reminder: any) => (
                    <div
                      key={reminder._id}
                      className="p-4 border-l-4 border-red-500 bg-gradient-to-r from-red-50 to-white rounded-lg hover:shadow-md transition-all duration-200"
                    >
                      <p className="font-semibold text-gray-900 text-lg">{reminder.title}</p>
                      <p className="text-xs text-red-600 font-semibold mt-3">
                        📅 Was due: {new Date(reminder.dueDate).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Health Tip Sidebar */}
          <div className="bg-gradient-to-br from-green-400 via-blue-400 to-purple-500 rounded-xl shadow-lg p-8 h-fit text-white transform hover:scale-105 transition-all duration-300">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">💡 Daily Health Tip</h2>
            {dashboardData?.healthTip ? (
              <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-6">
                <p className="font-bold text-lg mb-3">{dashboardData.healthTip.title}</p>
                <p className="text-sm leading-relaxed mb-4">{dashboardData.healthTip.content}</p>
                <div className="flex items-center justify-between">
                  <span className="bg-white bg-opacity-20 px-4 py-2 rounded-full text-xs font-semibold">
                    {dashboardData.healthTip.category}
                  </span>
                  <span className="text-2xl">✨</span>
                </div>
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-sm">No health tips available today</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
