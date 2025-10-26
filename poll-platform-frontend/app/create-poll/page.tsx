"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // ✅ Import router
import { createPoll } from "../../src/services/api";
import { useToast } from "../../src/components/Toast";

export default function CreatePollPage() {
    const [question, setQuestion] = useState("");
    const [options, setOptions] = useState<string[]>(["", ""]);
    const [loading, setLoading] = useState(false);
    const [createdBy, setCreatedBy] = useState("anonymous");

    const { showToast } = useToast();
    const router = useRouter(); // ✅ Initialize router

    // ✅ Safely read from localStorage in useEffect
    useEffect(() => {
        if (typeof window !== "undefined") {
            const userEmail = localStorage.getItem("poll_user_email");
            if (userEmail) setCreatedBy(userEmail);
        }
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const validOptions = options.filter((opt) => opt.trim() !== "");
        if (!question.trim() || validOptions.length < 2) {
            showToast("Please enter a question and at least 2 options.", "info");
            return;
        }

        try {
            setLoading(true);
            await createPoll(question, validOptions, createdBy);
            showToast("✅ Poll created successfully!", "success");
            setQuestion("");
            setOptions(["", ""]);

            // ✅ Redirect after a short delay
            setTimeout(() => {
                router.push("/polls");
            }, 1000);
        } catch (err) {
            console.error(err);
            showToast("❌ Failed to create poll. Please try again.", "error");
        } finally {
            setLoading(false);
        }
    };

    const addOption = () => setOptions([...options, ""]);
    const updateOption = (i: number, val: string) =>
        setOptions(options.map((opt, idx) => (idx === i ? val : opt)));

    return (
        <div className="max-w-md mx-auto bg-white shadow p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Create a New Poll</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder="Poll question"
                    className="w-full border px-3 py-2 rounded"
                    required
                />

                {options.map((opt, i) => (
                    <input
                        key={i}
                        value={opt}
                        onChange={(e) => updateOption(i, e.target.value)}
                        placeholder={`Option ${i + 1}`}
                        className="w-full border px-3 py-2 rounded"
                        required
                    />
                ))}

                <button
                    type="button"
                    onClick={addOption}
                    className="w-full border border-dashed border-gray-400 py-2 rounded hover:bg-gray-50"
                >
                    ➕ Add Option
                </button>

                <button
                    type="submit"
                    disabled={loading}
                    className={`w-full py-2 rounded font-semibold ${loading
                            ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                            : "bg-green-600 text-white hover:bg-green-700"
                        }`}
                >
                    {loading ? "Creating..." : "Create Poll"}
                </button>
            </form>
        </div>
    );
}
