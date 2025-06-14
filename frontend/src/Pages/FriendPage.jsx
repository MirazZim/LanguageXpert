import { useQuery } from "@tanstack/react-query";
import { getUserFriends } from "../lib/api";
import NoFriendsFound from "../components/NoFriendsFound";
import FriendCard from "../components/FriendCard";
import { UsersIcon, SparklesIcon } from "lucide-react";

const FriendPage = () => {
    const { data: friends = [], isLoading: loadingFriends } = useQuery({
        queryKey: ["friends"],
        queryFn: getUserFriends,
    });

    return (
        <div className="min-h-screen bg-base-100">
            {/* Hero Section */}
            <div className="bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10 border-b border-base-300">
                <div className="container mx-auto px-4 py-12">
                    <div className="text-center space-y-4">
                        <div className="flex items-center justify-center gap-3 mb-4">
                            <div className="p-3 bg-primary/20 rounded-full">
                                <UsersIcon className="h-8 w-8 text-primary" />
                            </div>
                        </div>
                        
                        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                            Your Language Friends
                        </h1>
                        
                        {!loadingFriends && friends.length > 0 && (
                            <div className="flex items-center justify-center gap-6 pt-4">
                                <div className="stats stats-horizontal bg-base-200/50 shadow-sm">
                                    <div className="stat place-items-center py-4 px-6">
                                        <div className="stat-value text-2xl text-primary font-bold">
                                            {friends.length}
                                        </div>
                                        <div className="stat-desc text-sm">
                                            {friends.length === 1 ? 'Friend' : 'Friends'}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-4 py-8">
                {loadingFriends ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="relative">
                            <span className="loading loading-spinner loading-lg text-primary" />
                            <div className="absolute inset-0 animate-ping">
                                <span className="loading loading-spinner loading-lg text-primary/30" />
                            </div>
                        </div>
                        <p className="text-base-content/60 mt-6 text-lg">
                            Loading your amazing friends...
                        </p>
                    </div>
                ) : friends.length === 0 ? (
                    <div className="py-8">
                        <NoFriendsFound />
                    </div>
                ) : (
                    <div className="space-y-6">
                        {/* Section Header */}
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-2xl font-semibold text-base-content">
                                    All Friends
                                </h2>
                                <p className="text-base-content/60 text-sm mt-1">
                                    Stay connected with your language learning community
                                </p>
                            </div>
                            
                            {/* Optional: Add filter/sort buttons here */}
                            <div className="hidden sm:flex gap-2">
                                <div className="badge badge-primary badge-outline">
                                    <UsersIcon className="h-3 w-3 mr-1" />
                                    {friends.length} Total
                                </div>
                            </div>
                        </div>

                        {/* Friends Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {friends.map((friend, index) => (
                                <div
                                    key={friend._id}
                                    className="animate-fadeIn"
                                    style={{
                                        animationDelay: `${index * 0.1}s`,
                                        animationFillMode: 'both'
                                    }}
                                >
                                    <FriendCard friend={friend} />
                                </div>
                            ))}
                        </div>

                        {/* Bottom CTA */}
                        {friends.length > 0 && (
                            <div className="text-center py-12">
                                <div className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-2xl p-8 border border-base-300">
                                    <h3 className="text-xl font-semibold mb-2">
                                        Keep Growing Your Network! 🌟
                                    </h3>
                                    <p className="text-base-content/70 mb-4">
                                        The more friends you have, the richer your language learning experience becomes.
                                    </p>
                                    <button className="btn btn-primary btn-sm">
                                        Find More Friends
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <style jsx>{`
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.6s ease-out;
                }
            `}</style>
        </div>
    );
};

export default FriendPage;