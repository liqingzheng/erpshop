import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { Suspense, lazy } from 'react'
import Login from '@/pages/Login'
import Layout from '@/pages/Layout'
import NotFound from '@/pages/Error/NotFound'
import Forbidden from '@/pages/Error/Forbidden'

const Dashboard = lazy(() => import('@/pages/Dashboard'))
const Product = lazy(() => import('@/pages/Product'))
const Order = lazy(() => import('@/pages/Order'))
const Purchase = lazy(() => import('@/pages/Purchase'))
const Inventory = lazy(() => import('@/pages/Inventory'))
const DataCenter = lazy(() => import('@/pages/DataCenter'))
const Finance = lazy(() => import('@/pages/Finance'))
const Logistics = lazy(() => import('@/pages/Logistics'))
const Profile = lazy(() => import('@/pages/Profile'))
const Settings = lazy(() => import('@/pages/Settings'))

function RequireAuth({ children }: { children: React.ReactElement }) {
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn)
  return isLoggedIn ? children : <Navigate to="/login" replace />
}

function AdminGuard({ children }: { children: React.ReactElement }) {
  const userInfo = useAuthStore((s) => s.userInfo)
  const isAdmin = userInfo?.role === 'super_admin' || userInfo?.permissions?.includes('*')
  return isAdmin ? children : <Navigate to="/" replace />
}

const PageFallback = (
  <div
    style={{
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#64748b',
    }}
  >
    页面加载中...
  </div>
)

export default function AppRoutes() {
  return (
    <Suspense fallback={PageFallback}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <RequireAuth>
              <Layout />
            </RequireAuth>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="product" element={<Product />} />
          <Route path="order" element={<Order />} />
          <Route path="purchase" element={<Purchase />} />
          <Route path="inventory" element={<Inventory />} />
          <Route path="data" element={<DataCenter />} />
          <Route path="finance" element={<Finance />} />
          <Route path="logistics" element={<Logistics />} />
          <Route path="profile" element={<Profile />} />
          <Route
            path="settings"
            element={
              <AdminGuard>
                <Settings />
              </AdminGuard>
            }
          />
        </Route>
        <Route path="/403" element={<Forbidden />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  )
}
