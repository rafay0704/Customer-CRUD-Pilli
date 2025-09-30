import React, { useState } from "react";
import { Plus } from "lucide-react";
import CustomerFormWrapper from "../components/customers/CustomerFormWrapper";
import CustomerTable from "../components/customers/CustomerTable";
import Modal from "../components/common/Modal";
import { useCustomers } from "../hooks/useCustomers";
import { seedCustomers } from "../seedData/seedCustomers"; // import your seed data
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ModeToggle } from "@/components/theme/mode-toggle";

const Customers = () => {
  const {
    data,
    isLoading,
    isError,
    addMutation,
    updateMutation,
    deleteMutation,
  } = useCustomers();
  const [editing, setEditing] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [insertingSeed, setInsertingSeed] = useState(false);

  const handleAddClick = () => {
    setEditing(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditing(null);
  };

  const handleInsertSeed = async () => {
    if (!addMutation) return;
    setInsertingSeed(true);
    try {
      for (const customer of seedCustomers) {
        await addMutation.mutateAsync(customer);
      }
    } catch (error) {
      console.error("Error inserting seed data:", error);
    } finally {
      setInsertingSeed(false);
    }
  };

  return (
    <div className="w-[100%] mx-auto p-6 space-y-6">
      {/* Header */}
      <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-4">
        <CardTitle className="text-xl sm:text-2xl font-bold tracking-tight">
          Customers Database
        </CardTitle>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
          <ModeToggle />
          <Button
            className="flex-1 sm:flex-none w-full sm:w-auto justify-center"
            onClick={handleAddClick}
          >
            <Plus className="w-4 h-4 mr-2" /> Add Customer
          </Button>
          <Button
            onClick={handleInsertSeed}
            disabled={insertingSeed}
            className="bg-green-500 hover:bg-green-600 text-white flex-1 sm:flex-none w-full sm:w-auto justify-center"
          >
            {insertingSeed ? "Inserting..." : "Insert Dummy Data"}
          </Button>
        </div>
      </CardHeader>

      {/* Modal */}
      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        <CustomerFormWrapper
          addMutation={addMutation}
          updateMutation={updateMutation}
          editing={editing}
          setEditing={setEditing}
          onSuccess={handleCloseModal}
        />
      </Modal>

      {/* Table or Skeleton */}
      <Card className="shadow-sm border">
        <CardContent className="p-4">
          {isLoading ? (
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-10 w-full rounded-md" />
              ))}
            </div>
          ) : isError ? (
            <p className="text-red-500">Error fetching customers</p>
          ) : (
            <CustomerTable
              data={data || []}
              deleteMutation={deleteMutation}
              setEditing={(customer) => {
                setEditing(customer);
                setIsModalOpen(true);
              }}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Customers;
