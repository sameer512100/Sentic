const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

interface Location {
  area: string;
  latitude: number;
  longitude: number;
}

interface Reporter {
  name: string;
  phone: string;
}

export interface Report {
  _id: string;
  imageData?: string;
  imageMimeType?: string;
  issueType: 'pothole' | 'garbage' | 'tree_fall';
  severity: number;
  location: Location;
  reporter?: Reporter;
  status: 'open' | 'resolved' | 'flagged';
  createdAt: string;
}

interface LoginResponse {
  token: string;
  admin: {
    id: string;
    username: string;
  };
}

// Auth helpers
export const getToken = () => localStorage.getItem('adminToken');
export const setToken = (token: string) => localStorage.setItem('adminToken', token);
export const removeToken = () => localStorage.removeItem('adminToken');
export const isAuthenticated = () => !!getToken();

// API calls
export const api = {
  // Health check
  async health(): Promise<ApiResponse<null>> {
    const res = await fetch(`${API_BASE}/health`);
    return res.json();
  },

  // Public: Create report
  async createReport(formData: FormData): Promise<ApiResponse<Report>> {
    const res = await fetch(`${API_BASE}/api/reports`, {
      method: 'POST',
      body: formData,
    });
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'Failed to create report');
    }
    return res.json();
  },

  // Public: Get all reports
  async getReports(): Promise<ApiResponse<Report[]>> {
    const res = await fetch(`${API_BASE}/api/reports`);
    return res.json();
  },

  // Public: Get single report
  async getReport(id: string): Promise<ApiResponse<Report>> {
    const res = await fetch(`${API_BASE}/api/reports/${id}`);
    return res.json();
  },

  // Admin: Login
  async login(username: string, password: string): Promise<ApiResponse<LoginResponse>> {
    const res = await fetch(`${API_BASE}/api/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'Login failed');
    }
    return res.json();
  },

  // Admin: Get all reports (with reporter info)
  async getAdminReports(): Promise<ApiResponse<Report[]>> {
    const token = getToken();
    const res = await fetch(`${API_BASE}/api/admin/reports`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.status === 401) {
      removeToken();
      throw new Error('Session expired');
    }
    return res.json();
  },

  // Admin: Update report status
  async updateReportStatus(id: string, status: 'open' | 'resolved' | 'flagged'): Promise<ApiResponse<Report>> {
    const token = getToken();
    const res = await fetch(`${API_BASE}/api/admin/reports/${id}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    });
    if (res.status === 401) {
      removeToken();
      throw new Error('Session expired');
    }
    return res.json();
  },
};

// Utility functions
export const getSeverityLevel = (severity: number): 'high' | 'medium' | 'low' => {
  if (severity >= 70) return 'high';
  if (severity >= 40) return 'medium';
  return 'low';
};

export const getIssueTypeLabel = (type: string): string => {
  const labels: Record<string, string> = {
    pothole: 'Pothole',
    garbage: 'Garbage Dump',
    tree_fall: 'Fallen Tree',
  };
  return labels[type] || type;
};

export const getStatusLabel = (status: string): string => {
  const labels: Record<string, string> = {
    open: 'Open',
    resolved: 'Resolved',
    flagged: 'Flagged',
  };
  return labels[status] || status;
};

export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const getImageUrl = (report: Report): string | null => {
  if (report.imageData && report.imageMimeType) {
    return `data:${report.imageMimeType};base64,${report.imageData}`;
  }
  return null;
};
