import React from "react";
import CustomerForm from "./CustomerForm";
import { toast } from "sonner";

const CustomerFormWrapper = ({
  addMutation,
  updateMutation,
  editing,
  setEditing,
  onSuccess, // callback to close modal
}) => {
  const handleSubmit = (customer, resetForm, setLoading) => {
    setLoading(true);

    if (editing) {
      updateMutation.mutate(
        { id: editing._id, customer },
        {
          onSuccess: () => {
            resetForm();
            setEditing(null);
            setLoading(false);
            toast.success("Customer updated successfully!");
            onSuccess?.();
          },
          onError: (error) => {
            setLoading(false);
            toast.error("Failed to update customer.");
            console.error(error);
          },
        }
      );
    } else {
      addMutation.mutate(customer, {
        onSuccess: () => {
          resetForm();
          setLoading(false);
          toast.success("Customer added successfully!");
          onSuccess?.();
        },
        onError: (error) => {
          setLoading(false);
          toast.error("Failed to add customer.");
          console.error(error);
        },
      });
    }
  };

  return (
    <CustomerForm
      initialData={editing}
      onSubmit={handleSubmit} // pass reset & loading handlers
    />
  );
};

export default CustomerFormWrapper;
