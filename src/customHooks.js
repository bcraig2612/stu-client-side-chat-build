import {useLocation} from "react-router-dom";
import useSWR from "swr";

export function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export function useGetConversation(id) {
  const { data, error } = useSWR(`http://localhost:9000/api/dummy_data.php?id=${id}`);
  return {
    data: data,
    isLoading: !error && !data,
    isError: error
  };
}

export function useGetConversations() {
  const { data, error } = useSWR('http://localhost:9000/api/dummy_data.php?conversation=1');
  return {
    data: data,
    isLoading: !error && !data,
    isError: error
  };
}