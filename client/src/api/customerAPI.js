import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api/v1/customers";

// Convert plain object to FormData (supports file uploads)
const toFormData = (customer) => {
  const formData = new FormData();
  Object.entries(customer).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      formData.append(key, value);
    }
  });
  return formData;
};



// Get all customers
export const fetchCustomers = async () => {
  const { data } = await axios.get(API_URL);
  return data;
};

// Add customer
export const addCustomer = async (customer) => {
  const formData = toFormData(customer);
  const { data } = await axios.post(API_URL, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}

// Update customer
export const updateCustomer = async (id, customer) => {
  const formData = toFormData(customer);
  const { data } = await axios.put(`${API_URL}/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};

// Delete customer(s)
export const deleteCustomer = async (ids) => {
  if (Array.isArray(ids)) {
    // Delete multiple customers sequentially
    const deletePromises = ids.map((id) => axios.delete(`${API_URL}/${id}`));
    await Promise.all(deletePromises);
    return ids;
  } else {
    // Single delete
    await axios.delete(`${API_URL}/${ids}`);
    return ids;
  }
};
