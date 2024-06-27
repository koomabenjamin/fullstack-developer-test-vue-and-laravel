import { useGenericApi } from "../../src/composables/useGenericApi";
import axios from "axios";
import { vi } from "vitest";

vi.mock("axios");

describe("useGenericApi", () => {
  it("fetches data correctly", async () => {
    const mockData = { id: 1, name: "John Doe" };
    axios.get.mockResolvedValue({ data: mockData });

    const { fetchData } = useGenericApi();
    const data = await fetchData("/api/users/1");

    expect(data).toEqual(mockData);
  });
});
