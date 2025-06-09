import {  Navigate, Route, Routes } from "react-router"
import HomePage from "./Pages/HomePage.jsx"
import LoginPage from "./Pages/LoginPage.jsx"
import SignupPage from "./Pages/SignupPage.jsx"
import OnboardingPage from "./Pages/OnboardingPage.jsx"
import NotificationsPage from "./Pages/NotificationsPage.jsx"
import CallPage from "./Pages/CallPage.jsx"
import ChatPage from "./Pages/ChatPage.jsx"
import { Toaster } from "react-hot-toast"
import { useQuery } from "@tanstack/react-query"
import { axiosInstance } from "./lib/axios.js"

const App = () => {

  const {data: authData , isloading, error} = useQuery({
    queryKey:["authUser"],
    queryFn: async () =>{
      const res = await axiosInstance.get("/auth/me");
      return res.data;
    },
    retry: false, // auth user should not be retried
    
  })

  const authUser = authData?.user;


  return (
    <div className="h-screen">

      <Routes>
        <Route path="/" element={authUser ? <HomePage /> : <Navigate to="/login" />} />


        <Route path="/login" element={!authUser ? <LoginPage /> : 
        <Navigate to="/" />} />
        
        <Route path="/signup" element={!authUser ? <SignupPage /> : <Navigate to="/" />} />
        
        <Route path="/onboarding" element={<OnboardingPage />} />
        
        <Route path="/notifications" element={authUser ?<NotificationsPage /> : <Navigate to="/" />} />
        
        <Route path="/call" element={authUser ?<CallPage /> : <Navigate to="/" />} />
        
        <Route path="/chat" element={authUser ?<ChatPage /> : <Navigate to="/" />} />
      </Routes>

      <Toaster />
    </div>
  )
}

export default App