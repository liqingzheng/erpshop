import { useState } from 'react'
import { Card, Avatar, Descriptions, Tag, Form, Input, Button, Row, Col, message, Divider } from 'antd'
import { useAuthStore } from '@/store/authStore'

export default function Profile() {
  const { userInfo, updateUserInfo, updatePassword } = useAuthStore()
  const [infoForm] = Form.useForm()
  const [pwdForm] = Form.useForm()
  const [infoLoading, setInfoLoading] = useState(false)
  const [pwdLoading, setPwdLoading] = useState(false)

  const handleUpdateInfo = async (values: { nickname: string; phone: string }) => {
    setInfoLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 600))
      updateUserInfo({ nickname: values.nickname, phone: values.phone })
      message.success('个人信息更新成功')
    } finally {
      setInfoLoading(false)
    }
  }

  const handleUpdatePassword = async (values: { oldPassword: string; newPassword: string; confirmPassword: string }) => {
    if (values.newPassword !== values.confirmPassword) {
      message.error('两次输入的新密码不一致')
      return
    }
    setPwdLoading(true)
    try {
      await updatePassword(values.oldPassword, values.newPassword)
      message.success('密码修改成功，请重新登录')
      pwdForm.resetFields()
    } catch (e: any) {
      message.error(e.message || '密码修改失败')
    } finally {
      setPwdLoading(false)
    }
  }

  const allPermissions = [
    { key: 'dashboard:view', label: '统计Dashboard' },
    { key: 'product:view', label: '产品查看' },
    { key: 'product:edit', label: '产品编辑' },
    { key: 'order:view', label: '订单查看' },
    { key: 'order:edit', label: '订单编辑' },
    { key: 'purchase:view', label: '采购查看' },
    { key: 'purchase:edit', label: '采购编辑' },
    { key: 'inventory:view', label: '库存查看' },
    { key: 'inventory:edit', label: '库存编辑' },
    { key: 'data:view', label: '数据中心' },
    { key: 'finance:view', label: '财务查看' },
    { key: 'finance:edit', label: '财务编辑' },
    { key: 'logistics:view', label: '物流查看' },
    { key: 'logistics:edit', label: '物流编辑' },
    { key: 'system:settings', label: '系统设置' },
  ]

  const userPerms = userInfo?.permissions || []
  const isSuper = userInfo?.role === 'super_admin' || userPerms.includes('*')

  return (
    <div>
      <Row gutter={[24, 24]}>
        <Col xs={24} lg={8}>
          <Card title="个人资料" className="h-full">
            <div className="flex flex-col items-center mb-6">
              <Avatar size={96} style={{ backgroundColor: '#1677ff', fontSize: 40 }}>
                {userInfo?.nickname?.charAt(0) || 'U'}
              </Avatar>
              <div className="mt-3 text-lg font-bold">{userInfo?.nickname}</div>
              <div className="text-gray-500">{userInfo?.username}</div>
              <Tag color={isSuper ? 'red' : 'blue'} className="mt-2">
                {isSuper ? '超级管理员' : userInfo?.role === 'operator' ? '运营专员' : '普通用户'}
              </Tag>
            </div>
            <Descriptions column={1} bordered size="small">
              <Descriptions.Item label="用户ID">{userInfo?.id}</Descriptions.Item>
              <Descriptions.Item label="用户名">{userInfo?.username}</Descriptions.Item>
              <Descriptions.Item label="手机号">{userInfo?.phone || '-'}</Descriptions.Item>
              <Descriptions.Item label="角色">{userInfo?.role}</Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>

        <Col xs={24} lg={16}>
          <Card title="我的权限" className="mb-6">
            <div className="flex flex-wrap gap-2">
              {isSuper ? (
                <Tag color="red">全部权限（*）</Tag>
              ) : (
                allPermissions
                  .filter((p) => userPerms.includes(p.key))
                  .map((p) => (
                    <Tag key={p.key} color="blue">
                      {p.label}
                    </Tag>
                  ))
              )}
            </div>
            {(!isSuper && userPerms.length === 0) && <div className="text-gray-400 mt-2">暂无特殊权限</div>}
          </Card>

          <Card title="修改个人信息">
            <Form
              form={infoForm}
              layout="vertical"
              initialValues={{ nickname: userInfo?.nickname, phone: userInfo?.phone }}
              onFinish={handleUpdateInfo}
            >
              <Row gutter={16}>
                <Col xs={24} sm={12}>
                  <Form.Item label="昵称" name="nickname" rules={[{ required: true, message: '请输入昵称' }]}>
                    <Input placeholder="请输入昵称" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                  <Form.Item label="手机号" name="phone" rules={[{ required: true, message: '请输入手机号' }, { pattern: /^1[3-9]\d{9}$/, message: '手机号格式错误' }]}>
                    <Input placeholder="请输入手机号" maxLength={11} />
                  </Form.Item>
                </Col>
              </Row>
              <Form.Item>
                <Button type="primary" htmlType="submit" loading={infoLoading}>
                  保存修改
                </Button>
              </Form.Item>
            </Form>

            <Divider />

            <div className="text-base font-bold mb-4">修改密码</div>
            <Form form={pwdForm} layout="vertical" onFinish={handleUpdatePassword}>
              <Row gutter={16}>
                <Col xs={24} sm={12}>
                  <Form.Item label="旧密码" name="oldPassword" rules={[{ required: true, message: '请输入旧密码' }]}>
                    <Input.Password placeholder="请输入旧密码" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12}></Col>
                <Col xs={24} sm={12}>
                  <Form.Item label="新密码" name="newPassword" rules={[{ required: true, message: '请输入新密码' }, { min: 6, message: '密码长度不能小于6位' }]}>
                    <Input.Password placeholder="请输入新密码" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                  <Form.Item
                    label="确认新密码"
                    name="confirmPassword"
                    rules={[{ required: true, message: '请确认新密码' }]}
                  >
                    <Input.Password placeholder="请再次输入新密码" />
                  </Form.Item>
                </Col>
              </Row>
              <Form.Item>
                <Button type="primary" htmlType="submit" loading={pwdLoading}>
                  修改密码
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>
      </Row>
    </div>
  )
}
