import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { API_BASE_URL } from "@/lib/consts";
import axios from "axios";
import { getAccessToken } from "@/lib/utils";

export const useGithubLogin = () => {
  return useMutation({
    mutationFn: async () => {
      window.location.href = `${API_BASE_URL}/api/v1/auth/github/login`;
      // return Promise.resolve();
    },
  });
};

export const useGithubDisconnect = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const response = await axios.post(
        `${API_BASE_URL}/api/v1/auth/github/disconnect`,
        {},
        {
          headers: {
            Authorization: `Bearer ${getAccessToken()}`,
          },
        }
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["github-status"] });
    },
  });
};

export const useGithubStatus = () => {
  const accessToken = getAccessToken();

  return useQuery({
    queryKey: ["github-status"],
    queryFn: async () => {
      const response = await axios.get(
        `${API_BASE_URL}/api/v1/auth/github/status`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      return response.data;
    },
    enabled: !!accessToken,
  });
};
