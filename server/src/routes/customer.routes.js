import express from "express";
import {
  getCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  deleteCustomer,
} from "../controllers/customer.controller.js";
import upload from "../middlewares/upload.js";

const router = express.Router();

router.get("/", getCustomers);
router.get("/:id", getCustomerById);
router.post("/", upload.single("image"), createCustomer);
router.put("/:id", upload.single("image"), updateCustomer);
router.delete("/:id", deleteCustomer);

export default router;
