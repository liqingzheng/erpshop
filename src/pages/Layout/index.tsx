import { useState } from 'react'
import { useLocation, useNavigate, Outlet } from 'react-router-dom'
import { Layout, Menu, Breadcrumb, Badge, Avatar, Dropdown, Space, theme, type MenuProps } from 'antd'
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  BellOutlined,
  DownOutlined,
} from '@ant-design/icons'
import { useAuthStore } from '@/store/authStore'
import { MODULES } from '@/utils/constants'
import './layout.scss'

const { Header, Sider, Content } = Layout

export default function AppLayout() {
  const [collapsed, setCollapsed] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { userInfo, logout } = useAuthStore()
  const {
    token: { colorBgContainer },
  } = theme.useToken()

  const selectedKeys = [location.pathname === '/' ? 'dashboard' : location.pathname.slice(1)]

  const breadcrumbItems = [
    { title: '首页', onClick: () => navigate('/') },
    ...(() => {
      const mod = MODULES.find((m) => m.path === location.pathname || (location.pathname === '/' && m.path === '/'))
      return mod ? [{ title: mod.label }] : []
    })(),
  ]

  const isAdmin = userInfo?.role === 'super_admin' || userInfo?.permissions?.includes('*')

  const userMenuItems: MenuProps['items'] = [
    { key: 'profile', label: '个人中心' },
    ...(isAdmin ? [{ key: 'settings', label: '系统设置' }] : []),
    { type: 'divider' as const },
    { key: 'logout', label: '退出登录', danger: true },
  ]

  const onUserMenuClick = ({ key }: { key: string }) => {
    if (key === 'logout') {
      logout()
      navigate('/login', { replace: true })
    } else if (key === 'profile') {
      navigate('/profile')
    } else if (key === 'settings') {
      navigate('/settings')
    }
  }

  return (
    <Layout className="layout-wrapper">
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        theme="dark"
        className="layout-sider"
        style={{ background: '#001529' }}
      >
        <div className="logo-box">
          <i className="bi bi-shop"></i>
          {!collapsed && <span>我的店ERP</span>}
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={selectedKeys}
          items={MODULES.map((m) => ({
            key: m.key,
            icon: <i className={m.icon} style={{ marginRight: 8 }}></i>,
            label: m.label,
            onClick: () => navigate(m.path),
          }))}
          style={{ background: '#001529' }}
        />
      </Sider>

      <Layout>
        <Header className="layout-header" style={{ background: colorBgContainer }}>
          <div className="header-left">
            <span className="trigger-btn" onClick={() => setCollapsed(!collapsed)}>
              {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            </span>
            <Breadcrumb items={breadcrumbItems} />
          </div>
          <div className="header-right">
            <Badge count={5} size="small">
              <BellOutlined style={{ fontSize: 18, cursor: 'pointer' }} />
            </Badge>
            <Dropdown menu={{ items: userMenuItems, onClick: onUserMenuClick }} placement="bottomRight">
              <div className="user-info">
                <Avatar style={{ backgroundColor: '#1677ff' }}>
                  {userInfo?.nickname?.charAt(0) || 'U'}
                </Avatar>
                <Space>
                  <span>{userInfo?.nickname}</span>
                  <DownOutlined style={{ fontSize: 12 }} />
                </Space>
              </div>
            </Dropdown>
          </div>
        </Header>

        <Content className="layout-content">
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  )
}
