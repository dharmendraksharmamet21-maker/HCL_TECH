import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import useAuthStore from '../../store/authStore';
import api from '../../lib/api';

interface ComplianceData {
  patientId: string;
  patientName: string;
  totalReminders: number;
  completedReminders: number;
  missedReminders: number;
  compliancePercentage: number;
  adherenceStatus: string;
}

interface DashboardData {
  totalPatients: number;
  complianceData: ComplianceData[];
  upcomingHighPriorityReminders: any[];
  missedReminders: any[];
  provider: any;
}

export default function ProviderDashboard() {
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
    if (user?.role === 'provider') {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/provider/dashboard');
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

  if (!user || user.role !== 'provider') {
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
            <p className="text-sm text-gray-600">Provider Portal</p>
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
        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Patients</p>
                <p className="text-3xl font-bold text-gray-900">{dashboardData?.totalPatients || 0}</p>
              </div>
              <span className="text-4xl">👥</span>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">High Compliance</p>
                <p className="text-3xl font-bold text-green-600">
                  {dashboardData?.complianceData?.filter(c => c.adherenceStatus === 'high').length || 0}
                </p>
              </div>
              <span className="text-4xl">✅</span>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Low Adherence</p>
                <p className="text-3xl font-bold text-red-600">
                  {dashboardData?.complianceData?.filter(c => c.adherenceStatus === 'low').length || 0}
                </p>
              </div>
              <span className="text-4xl">⚠️</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Patient Compliance */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold mb-4">📊 Patient Compliance</h2>
              <div className="space-y-4">
                {dashboardData?.complianceData?.map((patient) => (
                  <div key={patient.patientId} className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-semibold text-gray-900">{patient.patientName}</p>
                        <p className="text-sm text-gray-600">
                          {patient.completedReminders}/{patient.totalReminders} reminders completed
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        patient.adherenceStatus === 'high' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {patient.compliancePercentage}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          patient.adherenceStatus === 'high' ? 'bg-green-600' : 'bg-red-600'
                        }`}
                        style={{ width: `${patient.compliancePercentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* High Priority Reminders */}
          <div className="bg-white rounded-lg shadow p-6 h-fit">
            <h2 className="text-xl font-bold mb-4">🔔 High Priority</h2>
            {dashboardData?.upcomingHighPriorityReminders?.length ? (
              <div className="space-y-3">
                {dashboardData.upcomingHighPriorityReminders.map((reminder: any) => (
                  <div key={reminder._id} className="p-3 border-l-4 border-yellow-500 bg-yellow-50">
                    <p className="font-semibold text-gray-900 text-sm">{reminder.title}</p>
                    <p className="text-xs text-gray-600">{reminder.patientId?.patientName || 'Unknown'}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(reminder.dueDate).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600 text-sm">No high priority reminders</p>
            )}
          </div>
        </div>

        {/* Missed Reminders */}
        {dashboardData?.missedReminders?.length > 0 && (
          <div className="bg-white rounded-lg shadow p-6 mt-8">
            <h2 className="text-xl font-bold mb-4 text-red-600">⚠️ Missed Reminders</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {dashboardData.missedReminders.map((reminder: any) => (
                <div key={reminder._id} className="p-4 border-l-4 border-red-500 bg-red-50">
                  <p className="font-semibold text-gray-900">{reminder.title}</p>
                  <p className="text-sm text-gray-600">{reminder.patientId?.firstName} {reminder.patientId?.lastName}</p>
                  <p className="text-xs text-gray-500">
                    Was due: {new Date(reminder.dueDate).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
