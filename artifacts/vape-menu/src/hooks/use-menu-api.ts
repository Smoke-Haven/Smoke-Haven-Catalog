import { useQueryClient } from "@tanstack/react-query";
import { 
  getGetMenuItemsQueryKey,
  getGetBrandsQueryKey,
  getGetPuffCountsQueryKey
} from "@workspace/api-client-react";

export function useInvalidateMenu() {
  const queryClient = useQueryClient();
  
  return () => {
    queryClient.invalidateQueries({ queryKey: getGetMenuItemsQueryKey() });
    queryClient.invalidateQueries({ queryKey: getGetBrandsQueryKey() });
    queryClient.invalidateQueries({ queryKey: getGetPuffCountsQueryKey() });
  };
}
