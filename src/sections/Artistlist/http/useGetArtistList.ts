import { useQuery } from "@tanstack/react-query";
import { ARTIST_ENDPOINTS } from "src/http/apiEndPoints/Artist";
import axiosInstance from "src/utils/axios";

async function fetchData() {
  const { data } = await axiosInstance.get(`${ARTIST_ENDPOINTS.getAllArtistInDatabase}`);
  return data.data;
}

export const useGetArtistList = () => {
  return useQuery({
    queryKey: [ARTIST_ENDPOINTS.getAllArtistInDatabase],
    queryFn: fetchData,
  });
};


