import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchCustomers,
  addCustomer,
  updateCustomer,
  deleteCustomer,
} from "../api/customerAPI";

export const useCustomers = () => {
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["customers"],
    queryFn: fetchCustomers,
  });

  const addMutation = useMutation({
    mutationFn: addCustomer,
    onSuccess: () => queryClient.invalidateQueries(["customers"]),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, customer }) => updateCustomer(id, customer),
    onSuccess: () => queryClient.invalidateQueries(["customers"]),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteCustomer,
    onSuccess: () => queryClient.invalidateQueries(["customers"]),
  });

  const getCustomerById = (id) => data?.find((c) => c._id === id);

  return {
    data,
    isLoading,
    isError,
    addMutation,
    updateMutation,
    deleteMutation,
    getCustomerById,
  };
};
