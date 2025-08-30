
import LandingLayout from "@/components/layout/LandingLayout"
import { lazy } from "react";



const Home = lazy(() => import("@/pages/Home"))
const LoginPage = lazy(()=> import("@/pages/Login"))

const publicRoutes = [
  {
    path: "/",
    element: <LandingLayout/>,
    children:[
      {
        index: true,
        element: <Home/>
      }
    ]
  },
  {
    path: "/login",
    element: <LoginPage/>
  }

]

export default publicRoutes;