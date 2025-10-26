// app/polls/page.tsx

"use client";

import { useState, useEffect } from "react";
import { usePolls } from "../../src/hooks/usePolls";
import { useToast } from "../../src/components/Toast";
import { votePoll, toggleLike } from "../../src/services/api";

// --- Helper Hook to Get User ID ---
const useUserIdentifier = () => {
    const [userId, setUserId] = useState<string | undefined>(undefined);

    useEffect(() => {
        const id = localStorage.getItem("poll_user_email");
        setUserId(id || undefined);
    }, []);

    return userId;
};
// ---------------------------------

export default function PollsPage() {
    const { polls, loading, error } = usePolls();
    const { showToast } = useToast();
    const userIdentifier = useUserIdentifier();
    const [selectedVotes, setSelectedVotes] = useState<Map<number, number>>(new Map());

    const handleOptionSelect = (pollId: number, optionId: number) => {
        setSelectedVotes((prev) => {
            const newMap = new Map(prev);
            newMap.set(pollId, optionId);
            return newMap;
        });
    };

    const handleVote = async (e: React.MouseEvent, pollId: number) => {
        e.preventDefault();
        if (!userIdentifier) {
            showToast("⚠️ Please create a user first to vote.", "info");
            return;
        }

        const optionId = selectedVotes.get(pollId);
        if (!optionId) {
            showToast("⚠️ Please select an option first.", "info");
            return;
        }

        try {
            await votePoll(pollId, optionId, userIdentifier);
            showToast("✅ Vote submitted!", "success");

            setSelectedVotes((prev) => {
                const newMap = new Map(prev);
                newMap.delete(pollId);
                return newMap;
            });
        } catch (err) {
            showToast("❌ Failed to submit vote.", "error");
        }
    };

    const handleLike = async (e: React.MouseEvent, pollId: number) => {
        e.preventDefault();
        e.stopPropagation();
        if (!userIdentifier) {
            showToast("⚠️ Please create a user first to like.", "info");
            return;
        }

        try {
            await toggleLike(pollId, userIdentifier);
            showToast("👍 Like toggled!", "success");
        } catch (err) {
            showToast("❌ Failed to toggle like.", "error");
        }
    };

    if (loading) return <p className="text-center">Loading polls...</p>;
    if (error) return <p className="text-center text-red-500">Error: {error}</p>;

    return (
        <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">All Polls</h2>

            {polls.map((poll) => {
                const totalVotes = poll.options.reduce((sum, option) => sum + option.votes_count, 0);
                const selectedOption = selectedVotes.get(poll.id);

                return (
                    <div
                        key={poll.id}
                        className="block border rounded-lg p-4 mb-3 shadow-md transition duration-150 ease-in-out"
                    >
                        {/* --- Title and Created By --- */}
                        <h2 className="font-bold text-lg mb-1 text-gray-800">{poll.question}</h2>
                        <p className="text-sm text-gray-500 mb-3">Created by: {poll.created_by}</p>

                        {/* --- Stats --- */}
                        <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
                            <button
                                onClick={(e) => handleLike(e, poll.id)}
                                className="font-medium flex items-center space-x-1 hover:text-red-500 transition"
                            >
                                <span className="text-red-500">❤️</span>{" "}
                                <span>{poll.likes_count} likes</span>
                            </button>
                            <p className="font-medium">🗳️ {totalVotes} votes total</p>
                            {userIdentifier && <p className="text-blue-500">(Logged in as {userIdentifier})</p>}
                        </div>

                        {/* --- Options for Voting --- */}
                        <div className="space-y-2 mb-4 p-2 bg-gray-50 rounded">
                            <p className="font-semibold text-xs text-gray-500 uppercase mb-1">
                                Cast Your Vote:
                            </p>
                            {poll.options.map((option) => (
                                <div key={option.id} className="flex items-center justify-between text-sm">
                                    <label className="flex items-center space-x-2 cursor-pointer w-full">
                                        <input
                                            type="radio"
                                            name={`vote-poll-${poll.id}`}
                                            checked={selectedOption === option.id}
                                            onChange={() => handleOptionSelect(poll.id, option.id)}
                                            className="form-radio text-blue-600"
                                        />
                                        <span className="text-gray-700 font-medium">{option.text}</span>
                                    </label>
                                    <span className="font-mono text-xs text-gray-500">
                                        ({option.votes_count} votes)
                                    </span>
                                </div>
                            ))}
                        </div>

                        {/* --- Submit Vote Button --- */}
                        <button
                            onClick={(e) => handleVote(e, poll.id)}
                            disabled={!selectedOption}
                            className={`w-full py-2 rounded transition font-semibold ${selectedOption
                                    ? "bg-blue-600 text-white hover:bg-blue-700"
                                    : "bg-gray-300 text-gray-600 cursor-not-allowed"
                                }`}
                        >
                            Submit Vote
                        </button>
                    </div>
                );
            })}

            {polls.length === 0 && !loading && (
                <p className="text-center text-gray-500">No polls available yet.</p>
            )}
        </div>
    );
}
