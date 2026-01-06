/**
 * API service for communicating with the SharePlate backend
 */

const API_BASE_URL =
  import.meta.env.VITE_BACKEND_API_URL || "http://localhost:8000/api";

/* =========================
   AUTH HELPERS
========================= */

const getAuthToken = (): string | null => {
  return localStorage.getItem("authToken");
};

const getHeaders = (includeAuth = true): HeadersInit => {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (includeAuth) {
    const token = getAuthToken();
    if (token) {
      headers["Authorization"] = `Token ${token}`;
    }
  }

  return headers;
};

/* =========================
   TYPES
========================= */

export interface DonationItem {
  id: number;
  name: string;
  description: string;
  quantity: number;
  expiry_date: string;
  address: string;
  is_available: boolean;
  created_at: string;
  donor: string;
  latitude?: number;
  longitude?: number;
}

export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  role: "donor" | "recipient" | "volunteer" | null;
  phone_number?: string;
  email_notifications_enabled: boolean;
}

export interface CreateDonationData {
  name: string;
  description?: string;
  quantity: number;
  expiry_date: string;
  address: string;
  latitude?: number;
  longitude?: number;
}

export interface RegisterUserData {
  email: string;
  password: string;
  first_name?: string;
  last_name?: string;
  role: "donor" | "recipient" | "volunteer";
  phone_number?: string;
}

/* =========================
   API METHODS
========================= */

export const api = {
  /* -------- DONATIONS -------- */

  async createDonation(data: CreateDonationData): Promise<DonationItem> {
    const response = await fetch(`${API_BASE_URL}/items/`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({
        name: data.name,
        description: data.description || "",
        quantity: data.quantity,
        expiry_date: data.expiry_date,
        address: data.address,
        ...(data.latitude &&
          data.longitude && {
            location: {
              type: "Point",
              coordinates: [data.longitude, data.latitude],
            },
          }),
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || "Failed to create donation");
    }

    return await response.json();
  },

  async getDonations(bbox?: string): Promise<DonationItem[]> {
    const url = new URL(`${API_BASE_URL}/items/`);
    if (bbox) url.searchParams.append("in_bbox", bbox);

    const response = await fetch(url.toString(), {
      headers: getHeaders(),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch donations");
    }

    const data = await response.json();

    if (data.type === "FeatureCollection") {
      return data.features.map((f: any) => ({
        ...f.properties,
        id: f.properties.id,
        latitude: f.geometry?.coordinates[1],
        longitude: f.geometry?.coordinates[0],
      }));
    }

    return data;
  },

  /* -------- AUTH -------- */

  async registerUser(
    data: RegisterUserData
  ): Promise<{ user: User; token: string }> {
    const response = await fetch(`${API_BASE_URL}/users/register/`, {
      method: "POST",
      headers: getHeaders(false),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || "Registration failed");
    }

    return await response.json();
  },

  async loginUser(email: string, password: string) {
    const response = await fetch(`${API_BASE_URL}/api-token-auth/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || "Invalid credentials");
    }

    const data = await response.json();

    // ✅ SINGLE SOURCE OF TRUTH
    localStorage.setItem("authToken", data.token);

    return data;
  },

  /* -------- REQUESTS / CLAIMS -------- */

  async getRequests(): Promise<any[]> {
    const response = await fetch(`${API_BASE_URL}/requests/`, {
      headers: getHeaders(),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch requests");
    }

    return await response.json();
  },

  async createRequest(itemId: number): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/requests/`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({ item_id: itemId }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to claim donation");
    }

    return await response.json();
  },

  /* -------- USERS -------- */

  async getMe(email: string): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/users/?email=${email}`, {
      headers: getHeaders(),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch user");
    }

    const users = await response.json();
    return users[0];
  },

  async getVolunteers(): Promise<User[]> {
    const response = await fetch(`${API_BASE_URL}/users/?role=volunteer`, {
      headers: getHeaders(),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch volunteers");
    }

    return await response.json();
  },
};

/* =========================
   AUTH UTILITIES
========================= */

export const removeAuthToken = () => {
  localStorage.removeItem("authToken");
};

export const isAuthenticated = (): boolean => {
  return !!getAuthToken();
};
