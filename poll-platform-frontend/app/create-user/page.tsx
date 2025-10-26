// app/create-user/page.tsx

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation"; // ✅ Import router
import { useToast } from "../../src/components/Toast";
import { createUser } from "../../src/services/api"; // uses your existing API helper

interface CreateUserResponse {
  status: "success" | "info" | "error";
  message: string;
  user_id?: string;
  name?: string;
  email?: string;
}

// **New Helper Function to Save User**
const saveUserIdentity = (user: { id: string; email: string }) => {
  localStorage.setItem("poll_user_id", user.id);
  localStorage.setItem("poll_user_email", user.email);
  console.log("User identity saved to Local Storage:", user.email);
};

export default function CreateUserPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({});
  const { showToast } = useToast();
  const router = useRouter(); // ✅ Initialize router

  const validate = () => {
    const newErrors: typeof errors = {};
    if (!name.trim()) newErrors.name = "Name is required.";
    else if (name.trim().length < 2)
      newErrors.name = "Name must be at least 2 characters.";

    if (!email.trim()) newErrors.email = "Email is required.";
    else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email.trim()))
      newErrors.email = "Enter a valid email address.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setLoading(true);
      const response: CreateUserResponse = await createUser(email, name);

      if (response.status === "success") {
        if (response.user_id && response.email) {
          saveUserIdentity({
            id: response.user_id,
            email: response.email,
          });
        }

        showToast(`✅ ${response.message}`, "success");
        setName("");
        setEmail("");

        // ✅ Redirect after short delay to show toast
        setTimeout(() => {
          router.push("/create-poll");
        }, 1000);
      } else if (response.status === "info" || response.status === "error") {
        showToast(`⚠️ ${response.message}`, "error");
      } else {
        showToast("Something went wrong!", "error");
      }
    } catch (err) {
      console.error("Error creating user:", err);
      const message =
        (err as any).response?.data?.detail || "Server error — please try again!";
      showToast(message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white shadow p-6 rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Create User</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name Field */}
        <div>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter name"
            className={`w-full border px-3 py-2 rounded ${errors.name ? "border-red-500" : "border-gray-300"
              }`}
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name}</p>
          )}
        </div>

        {/* Email Field */}
        <div>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter email"
            className={`w-full border px-3 py-2 rounded ${errors.email ? "border-red-500" : "border-gray-300"
              }`}
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition ${loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
        >
          {loading ? "Creating..." : "Create User"}
        </button>
      </form>
    </div>
  );
}
