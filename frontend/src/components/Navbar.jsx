import { Link, useLocation } from "react-router";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import useAuthUser from "../hooks/useAuthUser";
import useLogout from "../hooks/useLogout.js";
import { BellIcon, Languages, LogOutIcon, MenuIcon, XIcon, HomeIcon, UsersIcon } from "lucide-react";
import ThemeSelector from "./ThemeSelector.jsx";
import { getFriendRequests } from "../lib/api";

const Navbar = () => {
    const { authUser } = useAuthUser();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [hasSeenNotifications, setHasSeenNotifications] = useState(false);

    const location = useLocation();
    const currentPath = location.pathname;
    const isChatPage = location.pathname?.startsWith("/chat");
    const isNotificationsPage = location.pathname === "/notifications";

    const { logoutMutation } = useLogout();

    // Fetch friend requests to get notification count
    const { data: friendRequests } = useQuery({
        queryKey: ["friendRequests"],
        queryFn: getFriendRequests,
        enabled: !!authUser, // Only fetch when user is authenticated
        refetchInterval: 30000, // Refetch every 30 seconds for real-time updates
    });

    const incomingRequestsCount = friendRequests?.incomingReqs?.length || 0;

    // Reset notification badge when visiting notifications page
    useEffect(() => {
        if (isNotificationsPage) {
            setHasSeenNotifications(true);
        }
    }, [isNotificationsPage]);

    // Reset hasSeenNotifications when new requests come in
    useEffect(() => {
        if (incomingRequestsCount > 0 && !isNotificationsPage) {
            setHasSeenNotifications(false);
        }
    }, [incomingRequestsCount, isNotificationsPage]);

    const showNotificationBadge = incomingRequestsCount > 0 && !hasSeenNotifications;

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const closeSidebar = () => {
        setIsSidebarOpen(false);
    };

    return (
        <>
            <nav className="bg-base-200 border-b border-base-300 sticky top-0 z-30 h-16 flex items-center">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between w-full">
                        {/* Mobile menu button for small/medium devices */}
                        <div className="lg:hidden">
                            <button 
                                className="btn btn-ghost btn-circle"
                                onClick={toggleSidebar}
                            >
                                <MenuIcon className="h-6 w-6 text-base-content opacity-70" />
                            </button>
                        </div>

                        {/* LOGO - ONLY IN THE CHAT PAGE */}
                        {isChatPage && (
                            <div className="pl-5">
                                <Link to="/" className="flex items-center gap-2.5">
                                </Link>
                            </div>
                        )}

                        <div className="flex items-center gap-3 sm:gap-4 ml-auto">
                            {/* Enhanced Notification Bell with Badge */}
                            <Link to={"/notifications"} className="relative">
                                <button className="btn btn-ghost btn-circle relative">
                                    <BellIcon className="h-6 w-6 text-base-content opacity-70" />
                                    {/* Notification Badge */}
                                    {showNotificationBadge && (
                                        <div className="absolute -top-1 -right-1 flex items-center justify-center">
                                            <span className="bg-error text-error-content text-xs font-bold rounded-full min-w-[20px] h-5 flex items-center justify-center px-1 animate-pulse">
                                                {incomingRequestsCount > 99 ? '99+' : incomingRequestsCount}
                                            </span>
                                        </div>
                                    )}
                                </button>
                            </Link>
                        </div>

                        <ThemeSelector />

                        <div className="avatar">
                            <div className="w-9 rounded-full">
                                <img src={authUser?.profilePic} alt="User Avatar" rel="noreferrer" />
                            </div>
                        </div>

                        {/* Logout button */}
                        <button className="btn btn-ghost btn-circle" onClick={logoutMutation}>
                            <LogOutIcon className="h-6 w-6 text-base-content opacity-70" />
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                    onClick={closeSidebar}
                />
            )}

            {/* Mobile Sidebar */}
            <aside className={`fixed top-0 left-0 w-64 bg-base-200 border-r border-base-300 flex flex-col h-screen z-50 transform transition-transform duration-300 ease-in-out lg:hidden ${
                isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
            }`}>
                {/* Sidebar Header */}
                <div className="p-5 border-b border-base-300 flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-2.5" onClick={closeSidebar}>
                        <Languages className="size-9 text-primary" />
                        <span className="text-xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary  tracking-wider">
                            LanguageXpert
                        </span>
                    </Link>
                    <button 
                        className="btn btn-ghost btn-circle btn-sm"
                        onClick={closeSidebar}
                    >
                        <XIcon className="h-5 w-5 text-base-content opacity-70" />
                    </button>
                </div>

                {/* Sidebar Navigation */}
                <nav className="flex-1 p-4 space-y-1">
                    <Link
                        to="/"
                        className={`btn btn-ghost justify-start w-full gap-3 px-3 normal-case ${
                            currentPath === "/" ? "btn-active" : ""
                        }`}
                        onClick={closeSidebar}
                    >
                        <HomeIcon className="size-5 text-base-content opacity-70" />
                        <span>Home</span>
                    </Link>

                    <Link
                        to="/friends"
                        className={`btn btn-ghost justify-start w-full gap-3 px-3 normal-case ${
                            currentPath === "/friends" ? "btn-active" : ""
                        }`}
                        onClick={closeSidebar}
                    >
                        <UsersIcon className="size-5 text-base-content opacity-70" />
                        <span>Friends</span>
                    </Link>
                    
                    <Link
                        to="/get-more-learners"
                        className={`btn btn-ghost justify-start w-full gap-3 px-3 normal-case ${
                            currentPath === "/get-more-learners" ? "btn-active" : ""
                        }`}
                        onClick={closeSidebar}
                    >
                        <UsersIcon className="size-5 text-base-content opacity-70" />
                        <span>Meet new Learners</span>
                    </Link>

                    {/* Enhanced Notifications Link with Badge in Sidebar */}
                    <Link
                        to="/notifications"
                        className={`btn btn-ghost justify-start w-full gap-3 px-3 normal-case relative ${
                            currentPath === "/notifications" ? "btn-active" : ""
                        }`}
                        onClick={closeSidebar}
                    >
                        <div className="relative">
                            <BellIcon className="size-5 text-base-content opacity-70" />
                            {/* Mobile Sidebar Notification Badge */}
                            {showNotificationBadge && (
                                <span className="absolute -top-2 -right-2 bg-error text-error-content text-xs font-bold rounded-full min-w-[16px] h-4 flex items-center justify-center px-1 animate-pulse">
                                    {incomingRequestsCount > 9 ? '9+' : incomingRequestsCount}
                                </span>
                            )}
                        </div>
                        <span>Notifications</span>
                        {/* Alternative badge position for mobile */}
                        {showNotificationBadge && (
                            <span className="badge badge-error badge-sm ml-auto">
                                {incomingRequestsCount}
                            </span>
                        )}
                    </Link>
                </nav>

                {/* USER PROFILE SECTION */}
                <div className="p-4 border-t border-base-300 mt-auto">
                    <div className="flex items-center gap-3">
                        <div className="avatar">
                            <div className="w-10 rounded-full">
                                <img src={authUser?.profilePic} alt="User Avatar" />
                            </div>
                        </div>
                        <div className="flex-1">
                            <p className="font-semibold text-sm">{authUser?.fullName}</p>
                            <p className="text-xs text-success flex items-center gap-1">
                                <span className="size-2 rounded-full bg-success inline-block" />
                                Online
                            </p>
                        </div>
                    </div>
                </div>
            </aside>
        </>
    )
}

export default Navbar