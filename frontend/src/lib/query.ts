import { QueryCache, QueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { getApiErrorMessage } from './utils';

const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: error => {
      toast.error(getApiErrorMessage(error));
    },
  }),
});

export const getQueryClient = () => queryClient;
