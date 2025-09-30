import { useState, useEffect } from "react";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Loader2, UploadCloud } from "lucide-react";

const MAX_FILE_SIZE = 1048576; // 1 MB

const customerSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(15, "Name too long"),
  email: z.string().email("Invalid email address").max(25, "Email too long"),
  phone: z.string().optional(),
  address: z.string().max(50, "Address too long").optional(),
  company: z.string().max(50, "Company name too long").optional(),
  notes: z.string().max(200, "Notes too long").optional(),
  image: z
    .any()
    .refine(
      (file) => !file || file.size <= MAX_FILE_SIZE,
      `File must be 1 MB or less`
    )
    .optional(),
});

const CustomerForm = ({ onSubmit, initialData }) => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    company: "",
    notes: "",
    image: null,
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [imageError, setImageError] = useState("");

  useEffect(() => {
    if (initialData) {
      setForm({
        name: initialData.name || "",
        email: initialData.email || "",
        phone: initialData.phone || "",
        address: initialData.address || "",
        company: initialData.company || "",
        notes: initialData.notes || "",
        image: null,
      });
      setImagePreview(initialData.image?.url || initialData.image || null);
    }
  }, [initialData]);

  const validateField = (name, value) => {
    // Validate single field using Zod
    const fieldSchema = customerSchema.pick({ [name]: true });
    const result = fieldSchema.safeParse({ [name]: value });
    setErrors((prev) => ({
      ...prev,
      [name]: result.success ? undefined : result.error.format()[name],
    }));
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "image") {
      const file = files[0];
      if (file) {
        if (file.size > MAX_FILE_SIZE) {
          setImageError("File size must be 1 MB or less");
          setForm((prev) => ({ ...prev, image: null }));
          setImagePreview(null);
          return;
        } else {
          setImageError("");
        }

        setImageLoading(true);
        setTimeout(() => {
          setForm((prev) => ({ ...prev, image: file }));
          setImagePreview(URL.createObjectURL(file));
          setImageLoading(false);
        }, 500);
      }
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
      validateField(name, value); // Real-time validation
    }
  };

  const resetForm = () => {
    setForm({
      name: "",
      email: "",
      phone: "",
      address: "",
      company: "",
      notes: "",
      image: null,
    });
    setImagePreview(null);
    setErrors({});
    setImageError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const result = customerSchema.safeParse(form);

    if (!result.success) {
      const fieldErrors = result.error.format();
      setErrors(fieldErrors);
      return;
    }

    if (imageError) return;

    onSubmit(form, resetForm, setLoading);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 text-gray-900 dark:text-gray-100"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Name */}
        <div>
          <Label className="mb-1">Name</Label>
          <Input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Full Name"
            disabled={loading || imageLoading}
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">
              {errors.name._errors[0]}
            </p>
          )}
        </div>

        {/* Email */}
        <div>
          <Label className="mb-1">Email</Label>
          <Input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email Address"
            disabled={loading || imageLoading}
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">
              {errors.email._errors[0]}
            </p>
          )}
        </div>

        {/* Phone */}
        <div>
          <Label className="mb-1">Phone</Label>
          <Input
            type="text"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="Phone Number"
            disabled={loading || imageLoading}
          />
        </div>

        {/* Company */}
        <div>
          <Label className="mb-1">Company</Label>
          <Input
            type="text"
            name="company"
            value={form.company}
            onChange={handleChange}
            placeholder="Company Name"
            disabled={loading || imageLoading}
          />
          {errors.company && (
            <p className="text-red-500 text-sm mt-1">
              {errors.company._errors[0]}
            </p>
          )}
        </div>

        {/* Address */}
        <div className="md:col-span-2">
          <Label className="mb-1">Address</Label>
          <Input
            type="text"
            name="address"
            value={form.address}
            onChange={handleChange}
            placeholder="Address"
            disabled={loading || imageLoading}
          />
          {errors.address && (
            <p className="text-red-500 text-sm mt-1">
              {errors.address._errors[0]}
            </p>
          )}
        </div>

        {/* Notes */}
        <div className="md:col-span-2">
          <Label className="mb-1">Notes</Label>
          <Textarea
            name="notes"
            value={form.notes}
            onChange={handleChange}
            placeholder="Additional Notes"
            disabled={loading || imageLoading}
          />
          {errors.notes && (
            <p className="text-red-500 text-sm mt-1">
              {errors.notes._errors[0]}
            </p>
          )}
        </div>

        {/* Image Upload */}
        {/* Image Upload */}
        <div className="md:col-span-2 flex flex-col gap-2">
          <Label className="mb-1">Image (Max: 1 MB)</Label>
          <div className="flex items-center gap-3">
            <Input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleChange}
              disabled={loading || imageLoading}
              className="cursor-pointer"
            />
            {imageLoading ? (
              <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
            ) : (
              <UploadCloud className="w-5 h-5 text-muted-foreground" />
            )}
          </div>
          {imageError && (
            <p className="text-red-500 text-sm mt-1">{imageError}</p>
          )}
          {imagePreview && (
            <div className="relative mt-2 w-32 h-32">
              <img
                src={imagePreview}
                alt="Preview"
                className="h-32 w-32 object-cover rounded-md border border-gray-300 dark:border-gray-600"
              />
              <button
                type="button"
                onClick={() => {
                  setForm((prev) => ({ ...prev, image: null }));
                  setImagePreview(null);
                  setImageError("");
                }}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
              >
                &times;
              </button>
            </div>
          )}
        </div>
      </div>

      <Button
        type="submit"
        className="w-full md:w-auto flex items-center justify-center gap-2"
        disabled={loading || imageLoading || !!imageError}
      >
        {(loading || imageLoading) && (
          <Loader2 className="w-4 h-4 animate-spin" />
        )}
        {loading
          ? initialData
            ? "Updating..."
            : "Adding..."
          : initialData
          ? "Update Customer"
          : "Add Customer"}
      </Button>
    </form>
  );
};

export default CustomerForm;
