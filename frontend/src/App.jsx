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
import Layout from "./components/Layout.jsx"
import { useThemeStore } from "./store/useThemeStore.js"
import Navbar from "./components/Navbar.jsx"
import FriendPage from "./Pages/FriendPage.jsx"
import LearnersPage from "./Pages/LearnersPage.jsx"

const App = () => {


  const { authUser, isLoading } = useAuthUser();

  const { theme } = useThemeStore();

  const isAuthenticated = Boolean(authUser);
  const isOnboarded = authUser?.isOnboarded;

  if (isLoading)
    return <PageLoader />;



  return (
    <div className="h-screen" data-theme={theme}>

      <Routes>
        <Route
          path="/"
          element={
            isAuthenticated && isOnboarded ? (
              <Layout showSidebar={true}>
                <HomePage />
              </Layout>
            ) : (
              <Navigate to={!isAuthenticated ? "/signup" : "/onboarding"} />
            )
          } />

        <Route path="/signup" element={
          !isAuthenticated ? <SignupPage /> : <Navigate to={isOnboarded ? "/" : "/onboarding"} />
        } />

        <Route path="/login" element={
          !isAuthenticated ? <LoginPage /> : <Navigate to={isOnboarded ? "/" : "/onboarding"} />
        } />


        <Route path="/onboarding"
          element={
            isAuthenticated ?
              (!isOnboarded ? (<OnboardingPage />)
                : (<Navigate to="/" />))
              : (<Navigate to="/login" />)} />

        <Route
          path="/notifications"
          element={
            isAuthenticated && isOnboarded ?
              /* if user is authenticated and onboarded */
              (<Layout showSidebar={true}>
                <NotificationsPage />
              </Layout>) :
              /* if user is not authenticated or not onboarded */
              (<Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />)} />

        <Route
          path="/call/:id"
          element={
            isAuthenticated && isOnboarded ? (
              <CallPage />
            ) : (
              <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
            )
          }
        />



        <Route
          path="/friends"
          element={
            isAuthenticated && isOnboarded ? (
              <Layout showSidebar={true}>
                <FriendPage />
              </Layout>
            ) : (
              <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
            )
          }
        />

        <Route
          path="/get-more-learners"
          element={
            isAuthenticated && isOnboarded ? (
              <Layout showSidebar={true}>
                <LearnersPage />
              </Layout>
            ) : (
              <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
            )
          }
        />

        <Route path="/chat/:id" element={
          isAuthenticated && isOnboarded ?
            /* if user is authenticated and onboarded */
            (<Layout showSidebar={true}>

              <ChatPage />
            </Layout>) :
            /* if user is not authenticated or not onboarded */
            (<Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />)} />
      </Routes>

      <Toaster />
    </div>
  )
}

export default App