import { useQuery } from "@tanstack/react-query";
import { ARTIST_ENDPOINTS } from "src/http/apiEndPoints/Artist";
import axiosInstance from "src/utils/axios";

async function fetchData() {
  const { data } = await axiosInstance.get(`${ARTIST_ENDPOINTS.suspendedArtist}`);
  return data.data;
}



export const useGetSuspendedArtistList = () => {
  return useQuery({
    queryKey: [ARTIST_ENDPOINTS.suspendedArtist],
    queryFn: fetchData,
  });
};



