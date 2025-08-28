import { createBrowserRouter } from 'react-router-dom'
import { Suspense } from 'react'
import publicRoutes from './publicRoutes'


export const router = createBrowserRouter([
  ...publicRoutes,
])