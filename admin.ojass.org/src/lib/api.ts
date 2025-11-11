// API base URL - defaults to localhost, should be set via environment variable
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

// Helper function to make API requests
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    credentials: 'include', // Important for cookies
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: response.statusText }));
    throw new Error(error.error || error.message || `HTTP error! status: ${response.status}`);
  }

  return response.json();
}

// Auth API
export const authAPI = {
  login: async (email: string, password: string) => {
    return apiRequest<{ success: boolean; message: string }>('/api/admin/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  logout: async () => {
    return apiRequest<{ success: boolean; message: string }>('/api/admin/auth/logout', {
      method: 'POST',
    });
  },
};

// Event API Types
export interface EventPrizes {
  total: string;
  winner: string;
  first_runner_up: string;
  second_runner_up: string;
}

export interface EventHead {
  name: string;
  Phone: string;
}

export interface Event {
  _id: string;
  name: string;
  teamSizeMin: number;
  teamSizeMax: number;
  isTeamEvent: boolean;
  img: string;
  rulebookurl: string;
  redirect: string;
  organizer?: string;
  description: string;
  prizes: EventPrizes;
  details: string[];
  rules: string[];
  event_head: EventHead;
  winners: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateEventData {
  name: string;
  teamSizeMin: number;
  teamSizeMax: number;
  isTeamEvent: boolean;
  img: string;
  rulebookurl: string;
  redirect: string;
  organizer?: string;
  description: string;
  prizes: EventPrizes;
  details: string[];
  rules: string[];
  event_head: EventHead;
  winners?: string[];
}

// Event API
export const eventAPI = {
  getAll: async (): Promise<Event[]> => {
    return apiRequest<Event[]>('/api/admin/events');
  },

  getById: async (eventId: string): Promise<Event> => {
    return apiRequest<Event>(`/api/admin/events/${eventId}`);
  },

  create: async (eventData: CreateEventData): Promise<Event> => {
    return apiRequest<Event>('/api/admin/events', {
      method: 'POST',
      body: JSON.stringify(eventData),
    });
  },

  update: async (eventId: string, eventData: Partial<CreateEventData>): Promise<Event> => {
    return apiRequest<Event>(`/api/admin/events/${eventId}`, {
      method: 'PUT',
      body: JSON.stringify(eventData),
    });
  },

  delete: async (eventId: string): Promise<{ success: boolean }> => {
    return apiRequest<{ success: boolean }>(`/api/admin/events/${eventId}`, {
      method: 'DELETE',
    });
  },
};

// Media API
export interface UploadFileResponse {
  message: string;
  files: Array<{
    fileId: string;
    url: string;
    cloudinaryId: string;
    imageUrl: string;
    fileName: string;
    fileType: string;
    fileSize: number;
    resourceType: string;
    isIdCard: boolean;
    createdAt: string;
  }>;
}

export const mediaAPI = {
  upload: async (file: File): Promise<UploadFileResponse> => {
    const formData = new FormData();
    formData.append('files', file);

    const response = await fetch(`${API_BASE_URL}/api/media/upload`, {
      method: 'POST',
      body: formData,
      credentials: 'include',
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: response.statusText }));
      throw new Error(error.error || error.message || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  },
};

