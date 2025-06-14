import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getOutgoingFriendReqs, getRecommendedUsers, sendFriendRequest } from "../lib/api";
import { CheckCircleIcon, MapPinIcon, UserPlusIcon, GlobeIcon, SparklesIcon, UsersIcon, SearchIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { getLanguageFlag } from "../components/FriendCard";
import { capitialize } from "../lib/utils";

const LearnersPage = () => {
  const queryClient = useQueryClient();

  // This will store the ids of the users to which the user has sent a friend request
  const [outgoingRequestsIds, setOutgoingRequestsIds] = useState(new Set());
  
  const { data: recommendedUsers = [], isLoading: loadingUsers } = useQuery({
    queryKey: ["users"],
    queryFn: getRecommendedUsers,
  });

  const { data: outgoingFriendReqs } = useQuery({
    queryKey: ["outgoingFriendReqs"],
    queryFn: getOutgoingFriendReqs,
  });

  const { mutate: sendRequestMutation, isPending } = useMutation({
    mutationFn: sendFriendRequest,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["outgoingFriendReqs"] }),
  });

  // This will store the ids of the users to which the user has sent a friend request
  useEffect(() => {
    const outgoingIds = new Set();
    if (outgoingFriendReqs && outgoingFriendReqs.length > 0) {
      outgoingFriendReqs.forEach((req) => {
        outgoingIds.add(req.recipient._id);
      });
      setOutgoingRequestsIds(outgoingIds);
    }
  }, [outgoingFriendReqs]);

  return (
    <div className="min-h-screen bg-base-100">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-secondary/10 via-primary/5 to-accent/10 border-b border-base-300">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center space-y-6">
            <div className="flex items-center justify-center gap-1 mb-6">
              <div className="p-4 bg-secondary/20 rounded-full">
                <SearchIcon className="h-8 w-8 text-secondary" />
              </div>
            </div>
            
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent">
              Discover Language Partners
            </h1>
            
            <p className="text-lg text-base-content/70 max-w-3xl mx-auto leading-relaxed">
              Connect with passionate language learners from around the world. 
              Find your perfect exchange partner and start meaningful conversations today!
            </p>
            
            {!loadingUsers && recommendedUsers.length > 0 && (
              <div className="flex items-center justify-center gap-8 pt-6">
                <div className="stats stats-horizontal bg-base-200/50 shadow-lg">
                  <div className="stat place-items-center py-6 px-8">
                    <div className="stat-value text-3xl text-secondary font-bold">
                      {recommendedUsers.length}
                    </div>
                    <div className="stat-desc text-base">
                      Perfect {recommendedUsers.length === 1 ? 'Match' : 'Matches'} Found
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-10">
        <section className="space-y-8">
          {/* Section Header */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-base-content flex items-center gap-3">
                <UsersIcon className="h-8 w-8 text-secondary" />
                Meet New Learners
              </h2>
              <p className="text-base-content/60 text-lg mt-2">
                Discover perfect language exchange partners curated just for you
              </p>
            </div>
          </div>

          {loadingUsers ? (
            /* Enhanced Loading State */
            <div className="flex flex-col items-center justify-center py-24">
              <div className="relative mb-8">
                <span className="loading loading-spinner loading-lg text-secondary" />
                <div className="absolute inset-0 animate-ping">
                  <span className="loading loading-spinner loading-lg text-secondary/30" />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-2">Finding Your Perfect Matches</h3>
              <p className="text-base-content/60 text-lg">
                Searching through thousands of language learners...
              </p>
            </div>
          ) : recommendedUsers.length === 0 ? (
            /* Enhanced Empty State */
            <div className="text-center py-20">
              <div className="card bg-gradient-to-br from-base-200 to-base-300 p-12 max-w-lg mx-auto shadow-lg">
                <div className="mb-6">
                  <GlobeIcon className="h-20 w-20 text-base-content/30 mx-auto" />
                </div>
                <h3 className="font-bold text-2xl mb-4">No Recommendations Yet</h3>
                <p className="text-base-content/70 text-lg mb-6 leading-relaxed">
                  We're working hard to find the perfect language partners for you. 
                  Our algorithm is analyzing profiles to create meaningful connections!
                </p>
                <div className="flex items-center justify-center gap-2">
                  <div className="badge badge-secondary badge-lg gap-2">
                    <SparklesIcon className="h-4 w-4" />
                    Coming Soon
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Enhanced Users Grid */
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {recommendedUsers.map((user, index) => {
                  const hasRequestBeenSent = outgoingRequestsIds.has(user._id);

                  return (
                    <div
                      key={user._id}
                      className="card bg-base-200 hover:bg-base-300 hover:shadow-2xl transition-all duration-300 border border-base-300 hover:border-secondary/30 hover:scale-105 animate-fadeIn"
                      style={{
                        animationDelay: `${index * 0.1}s`,
                        animationFillMode: 'both'
                      }}
                    >
                      <div className="card-body p-7 space-y-5">
                        {/* User Header */}
                        <div className="flex items-center gap-4">
                          <div className="avatar">
                            <div className="w-20 h-20 rounded-full ring-4 ring-secondary/20 ring-offset-2 ring-offset-base-200">
                              <img src={user.profilePic} alt={user.fullName} className="object-cover" />
                            </div>
                          </div>

                          <div className="flex-1">
                            <h3 className="font-bold text-xl text-base-content">
                              {user.fullName}
                            </h3>
                            {user.location && (
                              <div className="flex items-center text-base text-base-content/60 mt-2">
                                <MapPinIcon className="w-5 h-5 mr-2" />
                                {user.location}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Language Badges */}
                        <div className="flex flex-wrap gap-3">
                          <div className="badge badge-secondary gap-2 py-3 px-4 text-sm font-medium">
                            <span className="text-lg">{getLanguageFlag(user.nativeLanguage)}</span>
                            <span>Native: {capitialize(user.nativeLanguage)}</span>
                          </div>
                          <div className="badge badge-outline gap-2 py-3 px-4 text-sm font-medium">
                            <span className="text-lg">{getLanguageFlag(user.learningLanguage)}</span>
                            <span>Learning: {capitialize(user.learningLanguage)}</span>
                          </div>
                        </div>

                        {/* Bio */}
                        {user.bio && (
                          <div className="bg-base-300/50 rounded-lg p-4">
                            <p className="text-sm text-base-content/80 line-clamp-3 leading-relaxed">
                              "{user.bio}"
                            </p>
                          </div>
                        )}

                        {/* Action Button */}
                        <button
                          className={`btn w-full gap-3 text-base font-medium ${
                            hasRequestBeenSent 
                              ? "btn-success btn-disabled" 
                              : "btn-primary hover:btn-primary-focus"
                          }`}
                          onClick={() => sendRequestMutation(user._id)}
                          disabled={hasRequestBeenSent || isPending}
                        >
                          {hasRequestBeenSent ? (
                            <>
                              <CheckCircleIcon className="w-5 h-5" />
                              Request Sent Successfully
                            </>
                          ) : (
                            <>
                              <UserPlusIcon className="w-5 h-5" />
                              {isPending ? "Sending Request..." : "Send Friend Request"}
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Bottom Encouragement Section */}
              {recommendedUsers.length > 0 && (
                <div className="text-center py-16">
                  <div className="bg-gradient-to-r from-secondary/5 to-primary/5 rounded-3xl p-10 border border-base-300 max-w-4xl mx-auto">
                    <div className="mb-6">
                      <GlobeIcon className="h-16 w-16 text-secondary mx-auto" />
                    </div>
                    <h3 className="text-2xl font-bold mb-4">
                      Ready to Start Amazing Conversations? 🌟
                    </h3>
                    <p className="text-base-content/70 text-lg mb-6 max-w-2xl mx-auto leading-relaxed">
                      Don't hesitate to reach out! Every great language exchange journey begins with 
                      a simple friend request. These learners are excited to connect with you too!
                    </p>
                    <div className="flex items-center justify-center gap-3 text-base text-base-content/60">
                      <SparklesIcon className="h-5 w-5" />
                      <span>New recommendations appear daily</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </section>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.8s ease-out;
        }
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default LearnersPage;