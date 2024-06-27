import { setActivePinia, createPinia } from "pinia";
import { useAuthStore } from "../../src/stores/auth";
import axios from "axios";
import { vi } from "vitest";

vi.mock("axios");

describe("useAuthStore", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it("logs in a user correctly", async () => {
    const mockResponse = {
      data: {
        results: {
          user: { id: 1, name: "John Doe" },
          token: "sample-token",
          expires_at: new Date(Date.now() + 1000 * 60 * 60).toISOString(), // 1 hour from now
        },
      },
    };

    axios.post.mockResolvedValue(mockResponse);

    const authStore = useAuthStore();
    await authStore.login("test@example.com", "password");

    expect(authStore.user).toEqual(mockResponse.data.results.user);
    expect(authStore.token).toBe(mockResponse.data.results.token);
    expect(authStore.tokenExpiry).toBe(mockResponse.data.results.expires_at);
  });
});
