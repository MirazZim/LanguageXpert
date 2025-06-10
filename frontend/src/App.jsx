import { Navigate, Route, Routes } from "react-router"
import HomePage from "./Pages/HomePage.jsx"
import LoginPage from "./Pages/LoginPage.jsx"
import SignupPage from "./Pages/SignupPage.jsx"
import OnboardingPage from "./Pages/OnboardingPage.jsx"
import NotificationsPage from "./Pages/NotificationsPage.jsx"
import CallPage from "./Pages/CallPage.jsx"
import ChatPage from "./Pages/ChatPage.jsx"
import { Toaster } from "react-hot-toast"
import PageLoader from "./components/PageLoader.jsx"
import useAuthUser from "./hooks/useAuthUser.js"

const App = () => {


  const { authUser, isLoading } = useAuthUser();

  const isAuthenticated = Boolean(authUser);
  const isOnboarded = authUser?.isOnboarded;

  if (isLoading)
    return <PageLoader />;



  return (
    <div className="h-screen">

      <Routes>
        <Route
          path="/"
          element={
            isAuthenticated && isOnboarded ? (
              <HomePage />
            ) : (
              <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
            )
          } />

        <Route path="/login" element={
            !isAuthenticated ? <LoginPage /> : <Navigate to={isOnboarded ? "/" : "/onboarding"} />
          } />

        <Route path="/signup" element={
            !isAuthenticated ? <SignupPage /> : <Navigate to={isOnboarded ? "/" : "/onboarding"} />
          } />

        <Route path="/onboarding" element={!isAuthenticated ? <OnboardingPage /> : <Navigate to="/" />} />

        <Route path="/notifications" element={isAuthenticated ? <NotificationsPage /> : <Navigate to="/" />} />

        <Route path="/call" element={isAuthenticated ? <CallPage /> : <Navigate to="/" />} />

        <Route path="/chat" element={isAuthenticated ? <ChatPage /> : <Navigate to="/" />} />
      </Routes>

      <Toaster />
    </div>
  )
}

export default App