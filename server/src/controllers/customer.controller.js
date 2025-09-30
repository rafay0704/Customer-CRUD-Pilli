import Customer from "../models/customer.model.js";

// GET all customers
export const getCustomers = async (req, res) => {
  try {
    const customers = await Customer.find();
    res.status(200).json(customers);
  } catch (err) {
    console.error("Get customers error:", err.message);
    res.status(500).json({ error: "Failed to fetch customers" });
  }
};

// GET single customer by ID
export const getCustomerById = async (req, res) => {
  try {
    const { id } = req.params;
    const customer = await Customer.findById(id);
    if (!customer) return res.status(404).json({ error: "Customer not found" });
    res.status(200).json(customer);
  } catch (err) {
    console.error("Get customer by ID error:", err.message);
    res.status(500).json({ error: "Failed to fetch customer" });
  }
};

// CREATE customer
export const createCustomer = async (req, res) => {
  try {
    const { name, email, phone, address, company, notes } = req.body;

    if (!name || !email) {
      return res.status(400).json({ error: "Name and email are required" });
    }

    const imageData = req.file
      ? { url: req.file.path, public_id: req.file.filename }
      : null;

    const customer = new Customer({
      name,
      email,
      phone,
      address,
      company,
      notes,
      image: imageData,
    });

    await customer.save();
    res.status(201).json(customer);
  } catch (err) {
    console.error("Create customer error:", err.message);
    res.status(500).json({ error: "Failed to create customer" });
  }
};

// UPDATE customer
export const updateCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, address, company, notes } = req.body;

    const updateData = { name, email, phone, address, company, notes };

    if (req.file) {
      updateData.image = {
        url: req.file.path,
        public_id: req.file.filename,
      };
    }

    const updated = await Customer.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updated) return res.status(404).json({ error: "Customer not found" });

    res.status(200).json(updated);
  } catch (err) {
    console.error("Update customer error:", err.message);
    res.status(500).json({ error: "Failed to update customer" });
  }
};

// DELETE customer
export const deleteCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Customer.findByIdAndDelete(id);

    if (!deleted) return res.status(404).json({ error: "Customer not found" });

    res.status(200).json({ message: "Customer deleted successfully" });
  } catch (err) {
    console.error("Delete customer error:", err.message);
    res.status(500).json({ error: "Failed to delete customer" });
  }
};
