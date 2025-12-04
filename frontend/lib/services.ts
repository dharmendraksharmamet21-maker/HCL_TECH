import api from './api';

export const authService = {
  register: async (data: any) => {
    const response = await api.post('/auth/register', data);
    return response.data;
  },

  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  }
};

export const patientService = {
  getDashboard: async () => {
    const response = await api.get('/patient/dashboard');
    return response.data;
  },

  logMetrics: async (metrics: any) => {
    const response = await api.post('/patient/metrics/log', metrics);
    return response.data;
  },

  getMetricsHistory: async (days: number = 30) => {
    const response = await api.get(`/patient/metrics/history?days=${days}`);
    return response.data;
  },

  updateProfile: async (profileData: any) => {
    const response = await api.put('/patient/profile', profileData);
    return response.data;
  },

  getReminders: async (status?: string) => {
    let url = '/patient/reminders';
    if (status) url += `?status=${status}`;
    const response = await api.get(url);
    return response.data;
  },

  completeReminder: async (reminderId: string) => {
    const response = await api.put(`/patient/reminders/${reminderId}/complete`);
    return response.data;
  }
};

export const providerService = {
  getDashboard: async () => {
    const response = await api.get('/provider/dashboard');
    return response.data;
  },

  getAssignedPatients: async () => {
    const response = await api.get('/provider/patients');
    return response.data;
  },

  getPatientDetails: async (patientId: string) => {
    const response = await api.get(`/provider/patients/${patientId}`);
    return response.data;
  },

  assignPatient: async (patientId: string) => {
    const response = await api.post('/provider/patients/assign', { patientId });
    return response.data;
  },

  createReminder: async (reminderData: any) => {
    const response = await api.post('/provider/reminders', reminderData);
    return response.data;
  },

  updateReminder: async (reminderId: string, updates: any) => {
    const response = await api.put(`/provider/reminders/${reminderId}`, updates);
    return response.data;
  }
};
