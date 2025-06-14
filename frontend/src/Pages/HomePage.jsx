import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { getOutgoingFriendReqs, getRecommendedUsers, getUserFriends, sendFriendRequest } from "../lib/api";
import { CheckCircleIcon, MapPinIcon, UserPlusIcon, UsersIcon, Sparkles, Users, MessageCircle } from "lucide-react";
import { Link } from "react-router";
import FriendCard, { getLanguageFlag } from "../components/FriendCard";
import NoFriendsFound from "../components/NoFriendsFound";
import { capitialize } from "../lib/utils";

const HomePage = () => {
  const queryClient = useQueryClient();

  //this will store the ids of the users to which the user has sent a friend request
  const [outgoingRequestsIds, setOutgoingRequestsIds] = useState(new Set());

  const { data: friends = [], isLoading: loadingFriends } = useQuery({
    queryKey: ["friends"],
    queryFn: getUserFriends,
  });

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

//this will store the ids of the users to which the user has sent a friend request
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
    <div className="min-h-screen bg-gradient-to-br from-base-100 to-base-200 p-4 sm:p-6 lg:p-8">
      <div className="container mx-auto space-y-12">
        
        {/* Hero Section */}
        <div className="text-center space-y-4 py-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <MessageCircle className="size-8 text-primary animate-pulse" />
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Connect & Learn Together
          </h1>
          <p className="text-lg opacity-80 max-w-2xl mx-auto">
            Start conversations, make video calls, and practice languages with friends from around the world
          </p>
        </div>

        {/* Friends Section */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Users className="size-6 text-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Your Friends</h2>
                <p className="text-sm opacity-70">
                  {friends.length} {friends.length === 1 ? 'friend' : 'friends'} ready to chat
                </p>
              </div>
            </div>
            <Link to="/notifications" className="btn btn-outline btn-sm hover:btn-primary transition-all duration-300 group">
              <UsersIcon className="mr-2 size-4 group-hover:scale-110 transition-transform" />
              Friend Requests
            </Link>
          </div>

          {loadingFriends ? (
            <div className="flex justify-center py-16">
              <div className="flex flex-col items-center gap-4">
                <span className="loading loading-spinner loading-lg text-primary" />
                <p className="text-sm opacity-70">Loading your friends...</p>
              </div>
            </div>
          ) : friends.length === 0 ? (
            <NoFriendsFound />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {friends.map((friend, index) => (
                <div
                  key={friend._id}
                  className="animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <FriendCard friend={friend} />
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Recommended Users Section */}
        <section className="space-y-8">
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="p-2 bg-secondary/10 rounded-lg">
                <Sparkles className="size-6 text-secondary" />
              </div>
            </div>
            <h2 className="text-3xl font-bold">Discover New Language Partners</h2>
            <p className="text-lg opacity-70 max-w-xl mx-auto">
              Connect with amazing learners who share your passion for languages
            </p>
          </div>

          {loadingUsers ? (
            <div className="flex justify-center py-16">
              <div className="flex flex-col items-center gap-4">
                <span className="loading loading-spinner loading-lg text-secondary" />
                <p className="text-sm opacity-70">Finding perfect matches...</p>
              </div>
            </div>
          ) : recommendedUsers.length === 0 ? (
            <div className="card bg-gradient-to-br from-base-200 to-base-300 border border-base-300 p-8 text-center max-w-md mx-auto">
              <div className="p-3 bg-base-100 rounded-full w-fit mx-auto mb-4">
                <Users className="size-8 opacity-50" />
              </div>
              <h3 className="font-bold text-xl mb-2">No Recommendations Yet</h3>
              <p className="opacity-70">
                We're working on finding the perfect language partners for you. Check back soon!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {recommendedUsers.map((user, index) => {
                const hasRequestBeenSent = outgoingRequestsIds.has(user._id);

                return (
                  <div
                    key={user._id}
                    className="card bg-base-100 border border-base-300 hover:border-primary/30 hover:shadow-xl transition-all duration-500 hover:-translate-y-1 animate-fade-in"
                    style={{ animationDelay: `${index * 150}ms` }}
                  >
                    <div className="card-body p-6 space-y-5">
                      
                      {/* User Profile */}
                      <div className="flex items-start gap-4">
                        <div className="avatar">
                          <div className="size-16 rounded-full ring-2 ring-primary/20 ring-offset-2">
                            <img src={user.profilePic} alt={user.fullName} className="object-cover" />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-lg truncate">{user.fullName}</h3>
                          {user.location && (
                            <div className="flex items-center text-sm opacity-70 mt-1">
                              <MapPinIcon className="size-3 mr-1 flex-shrink-0" />
                              <span className="truncate">{user.location}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Languages */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 p-2 bg-primary/5 rounded-lg">
                          <span className="text-lg">{getLanguageFlag(user.nativeLanguage)}</span>
                          <span className="text-sm font-medium">Native: {capitialize(user.nativeLanguage)}</span>
                        </div>
                        <div className="flex items-center gap-2 p-2 bg-secondary/5 rounded-lg">
                          <span className="text-lg">{getLanguageFlag(user.learningLanguage)}</span>
                          <span className="text-sm font-medium">Learning: {capitialize(user.learningLanguage)}</span>
                        </div>
                      </div>

                      {/* Bio */}
                      {user.bio && (
                        <div className="bg-base-200 p-3 rounded-lg">
                          <p className="text-sm leading-relaxed">{user.bio}</p>
                        </div>
                      )}

                      {/* Action Button */}
                      <button
                        className={`btn w-full ${
                          hasRequestBeenSent 
                            ? "btn-success btn-disabled" 
                            : "btn-primary hover:btn-primary-focus"
                        } transition-all duration-300 group`}
                        onClick={() => sendRequestMutation(user._id)}
                        disabled={hasRequestBeenSent || isPending}
                      >
                        {hasRequestBeenSent ? (
                          <>
                            <CheckCircleIcon className="size-4 mr-2" />
                            Request Sent
                          </>
                        ) : (
                          <>
                            <UserPlusIcon className="size-4 mr-2 group-hover:scale-110 transition-transform" />
                            {isPending ? "Sending..." : "Connect"}
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
};

export default HomePage;