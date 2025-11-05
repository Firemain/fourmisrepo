import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Mission, CreateMission } from "@fourmis/types";

// Fetch missions
export const useMissions = () => {
  return useQuery({
    queryKey: ["missions"],
    queryFn: async (): Promise<Mission[]> => {
      const response = await fetch("/api/missions");
      if (!response.ok) {
        throw new Error("Failed to fetch missions");
      }
      return response.json();
    },
  });
};

// Create mission
export const useCreateMission = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (mission: CreateMission): Promise<Mission> => {
      const response = await fetch("/api/missions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(mission),
      });

      if (!response.ok) {
        throw new Error("Failed to create mission");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["missions"] });
    },
  });
};
