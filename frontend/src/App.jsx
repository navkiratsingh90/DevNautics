import React, { useEffect } from "react"
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import UserDashboard from "./Pages/Dashboard/UserDashboard";
import UserProfile from "./components/UserDetails";
import WorkExperience from "./components/WorkEx";
import EducationPage from "./components/Education";
import SocialFeed from "./components/SocialActivity";
import {Provider, useDispatch} from 'react-redux'
import { store } from "./Store/Store";
import ProjectsPage from "./components/Projects";
import SkillsPage from "./components/Skills";
import CertificationsPage from "./components/Certifications";
import HomePage from "./Pages/Main/LandingPage";
import Auth from "./Pages/Auth/Auth";
import Login from "./Pages/Auth/Login";
import Signup from "./Pages/Auth/Signup.jsx"; 
import Page from "./Pages/Main/Page";
import ContactPage from "./Pages/Main/Contact";
import AboutUsPage from "./Pages/Main/About";
import FeedPage from "./Pages/Feed/Feed";
import PendingRequestsPage from "./Pages/Pending-Requests/PendingRequests";
import EventsPage from "./Pages/Events/Events";
import ProjectCollaboration from "./Pages/Standalone/Collab";
import ProjectCollabPage from "./Pages/Project-Collaboration/ProjectCollab";
import ProjectDashboard from "./Pages/Notifications/Message";
import ChatPage from "./Pages/Notifications/Chat";
import CodeDecodeSection from "./Pages/Code/CodeDecode";
import DailyCodingChallenge from "./components/DailyCodingChallenge";
import CSFundamentalsProblem from "./components/CSFundamentalsChallenge";
import AptitudeProblem from "./components/AptitudeDailyChallenge";
import ProjectTracker from "./Pages/Project-Tracker/ProjectTracking";
import Workspaces from "./Pages/Projects/Projects";
import SignupPage from "./Pages/Auth/Signup.jsx";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getUser } from "./services/authApis.jsx";
import { handleCredentials } from "./Features/AuthSlice.jsx";

const router = createBrowserRouter([
  {
    path: '/auth',
    element : <Auth/>,
    children : [
      {
        path : '/auth/login',
        element : <Login/>
      },
      {
        path : '/auth/signup',
        element : <Signup/>  // Now this will work
      }
    ] 
  },
  { 
    path: "/", 
    element: <Page /> ,
    children: [
      {
        path: '/',
        element : <HomePage/>,
      },
      {
        path : '/contact',
        element : <ContactPage/>
      },
      {
        path : '/about',
        element : <AboutUsPage/>
      },
      {
        path : '/activity',
        element : <FeedPage/>
      },
      {
        path : '/activity/pending-requests',
        element : <PendingRequestsPage/>
      },
      {
        path : '/events',
        element : <EventsPage/>
      },
      {
        path : '/team-workspace',
        element : <Workspaces/>
      },
      {
        path : '/project-collaboration',
        element : <ProjectCollabPage/>
      },
      {
        path : '/project-collaboration/:id',
        element : <ProjectCollaboration/>
      },
      {
        path : '/notifications',
        element : <ProjectDashboard/>
      },
      {
        path : '/code-decode',
        element : <CodeDecodeSection/>
      },
      {
        path : '/code-decode/:id',
        element : <AptitudeProblem/>
      },
      {
        path : '/notifications/chat',
        element : <ChatPage/>
      },
      {
        path : '/project-tracker',
        element : <ProjectTracker/>
      },
    ]
  },
  {
    path : '/user/:id',
    element : <UserDashboard/>,
    children : [
      {
        path : '/user/:id',
        element : <UserProfile/>
      },
      {
        path : '/user/:id/work-experience',
        element : <WorkExperience/>
      },
      {
        path : '/user/:id/education',
        element : <EducationPage/>
      },
      {
        path : '/user/:id/activity',
        element : <SocialFeed/>
      },
      {
        path : '/user/:id/projects',
        element : <ProjectsPage/>
      },
      {
        path : '/user/:id/skills',
        element : <SkillsPage/>
      },
      {
        path : '/user/:id/certifications',
        element : <CertificationsPage/>
      }
    ]
  }
])

    
function App() {
  
  return (
    <>
     <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
        theme="dark"
      />
      <Provider store={store}>
        <RouterProvider router={router}/>
      </Provider>
    </>
  )
}

export default App