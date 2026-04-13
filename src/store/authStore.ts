import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface UserInfo {
  id: string
  username: string
  nickname: string
  phone?: string
  avatar?: string
  role: string
  permissions: string[]
}

interface AuthState {
  token: string | null
  userInfo: UserInfo | null
  isLoggedIn: boolean
  login: (username: string, password: string) => Promise<void>
  logout: () => void
  updateUserInfo: (partial: Partial<UserInfo>) => void
  updatePassword: (oldPwd: string, newPwd: string) => Promise<void>
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      userInfo: null,
      isLoggedIn: false,
      login: async (username: string, password: string) => {
        await new Promise((resolve) => setTimeout(resolve, 800))
        if (password !== '123456') {
          throw new Error('密码错误')
        }
        if (username === 'admin') {
          set({
            token: 'mock_token_admin_' + Date.now(),
            userInfo: {
              id: '1',
              username: 'admin',
              nickname: '超级管理员',
              phone: '13800138000',
              role: 'super_admin',
              permissions: ['*'],
            },
            isLoggedIn: true,
          })
        } else {
          set({
            token: 'mock_token_' + username + '_' + Date.now(),
            userInfo: {
              id: '2',
              username,
              nickname: username === 'operator' ? '运营专员' : '普通用户',
              phone: '13900139000',
              role: 'operator',
              permissions: [
                'product:view', 'product:edit',
                'order:view', 'order:edit',
                'purchase:view',
                'inventory:view', 'inventory:edit',
                'data:view',
                'finance:view',
                'logistics:view',
                'dashboard:view',
              ],
            },
            isLoggedIn: true,
          })
        }
      },
      logout: () => {
        set({ token: null, userInfo: null, isLoggedIn: false })
      },
      updateUserInfo: (partial) => {
        set((state) => ({
          userInfo: state.userInfo ? { ...state.userInfo, ...partial } : null,
        }))
      },
      updatePassword: async (oldPwd, newPwd) => {
        await new Promise((resolve) => setTimeout(resolve, 600))
        if (oldPwd !== '123456') {
          throw new Error('旧密码错误')
        }
        if (newPwd.length < 6) {
          throw new Error('新密码长度不能小于6位')
        }
      },
    }),
    { name: 'auth-storage' }
  )
)
