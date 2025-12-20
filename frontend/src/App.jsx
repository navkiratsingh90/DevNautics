
import React from "react"
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import UserDashboard from "./Pages/Dashboard/UserDashboard";
import UserProfile from "./components/UserDetails";
import WorkExperience from "./components/WorkEx";
import EducationPage from "./components/Education";
import SocialFeed from "./components/SocialActivity";
import {Provider} from 'react-redux'
import { store } from "./Store/Store";
import ProjectsPage from "./components/Projects";
import SkillsPage from "./components/Skills";
// import SkillsPage from './components/'/
import CertificationsPage from "./components/Certifications";
import HomePage from "./Pages/Main/LandingPage";
import Auth from "./Pages/Auth/Auth";
import { LogIn } from "lucide-react";
import Login from "./Pages/Auth/Login";
import SignupPage from "./Pages/Auth/Signup";
import Page from "./Pages/Main/Page";
import ContactPage from "./Pages/Main/Contact";
import AboutUsPage from "./Pages/Main/About";
import FeedPage from "./Pages/Feed/Feed";
import PendingRequestsPage from "./Pages/Pending-Requests/PendingRequests";
import EventsPage from "./Pages/Events/Events";
// import ProjectCollabPage from "./Pages/Standalone/Collab";
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
// import CollabPage from "./Pages/Standalone/Collab";

// import PopupForm from "./components/ui/PopupUserForm";

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
        element : <SignupPage/>
      }
    ] 
  },
  { path: "/", 
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
    path : '/feed',
    element : <FeedPage/>
  },
  {
    path : '/pending-requests',
    element : <PendingRequestsPage/>
  },
  {
    path : '/events',
    element : <EventsPage/>
  },
  {
    path : '/project',
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
  // {
  //   path : '/projects/:id',
  //   element : <ProjectDetailPage/>
  // }
  ]
  },
  {
    path : '/user',
    element : <UserDashboard/>,
    children : [
      {
        path : '/user',
        element : <UserProfile/>
      },
      {
        path : '/user/work-experience',
        element : <WorkExperience/>
      },
      {
        path : '/user/education',
        element : <EducationPage/>
      },
      {
        path : '/user/activity',
        element : <SocialFeed/>
      },
      {
        path : '/user/projects',
        element : <ProjectsPage/>
      },
      {
        path : '/user/skills',
        element : <SkillsPage/>
      },
      {
        path : '/user/certifications',
        element : <CertificationsPage/>
      }
    ]
  }
  // { path: "/about", element: <About /> },
])

function App() {
  return (
    // <div className="min-h-screen bg-gray-100 flex items-center justify-center">
    //  <LandingPage/>
    <Provider store={store}>
    <RouterProvider router={router}/>
    </Provider>
    // </div>
  )
}

export default App
