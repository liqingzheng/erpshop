import { useState } from 'react'
import { Card, Table, Tag, Button, Space, Modal, Form, Input, Select, Checkbox, Row, Col, message } from 'antd'
import usersMock from '../../../mock/users.json'

const { Option } = Select

export default function Settings() {
  const [users, setUsers] = useState<any[]>(usersMock.users)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<any | null>(null)
  const [form] = Form.useForm()

  const { roles, allPermissions } = usersMock as any

  const handleEdit = (record: any) => {
    setEditingUser(record)
    const roleObj = roles.find((r: any) => r.key === record.role)
    form.setFieldsValue({
      ...record,
      permissions: record.role === 'super_admin' ? ['*'] : (roleObj?.permissions || record.permissions || []),
    })
    setIsModalOpen(true)
  }

  const handleAdd = () => {
    setEditingUser(null)
    form.resetFields()
    setIsModalOpen(true)
  }

  const handleSave = async (values: any) => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    if (editingUser) {
      setUsers((prev) =>
        prev.map((u) =>
          u.id === editingUser.id
            ? { ...u, ...values, permissions: values.role === 'super_admin' ? ['*'] : values.permissions }
            : u
        )
      )
      message.success('用户信息更新成功')
    } else {
      const newUser = {
        id: String(users.length + 1),
        ...values,
        status: '启用',
        permissions: values.role === 'super_admin' ? ['*'] : values.permissions,
      }
      setUsers((prev) => [...prev, newUser])
      message.success('用户新增成功')
    }
    setIsModalOpen(false)
  }

  const handleToggleStatus = (record: any) => {
    const nextStatus = record.status === '启用' ? '停用' : '启用'
    setUsers((prev) => prev.map((u) => (u.id === record.id ? { ...u, status: nextStatus } : u)))
    message.success(`已${nextStatus}用户 ${record.username}`)
  }

  const onRoleChange = (roleKey: string) => {
    const roleObj = roles.find((r: any) => r.key === roleKey)
    if (roleObj) {
      form.setFieldsValue({ permissions: roleObj.permissions })
    }
  }

  const columns = [
    { title: '用户名', dataIndex: 'username' },
    { title: '昵称', dataIndex: 'nickname' },
    { title: '手机号', dataIndex: 'phone' },
    { title: '角色', dataIndex: 'role', render: (r: string) => {
      const roleObj = roles.find((role: any) => role.key === r)
      return <Tag color={r === 'super_admin' ? 'red' : 'blue'}>{roleObj?.name || r}</Tag>
    }},
    { title: '状态', dataIndex: 'status', render: (s: string) => <Tag color={s === '启用' ? 'green' : 'default'}>{s}</Tag> },
    {
      title: '操作',
      render: (_: any, record: any) => (
        <Space>
          <Button type="link" onClick={() => handleEdit(record)}>编辑权限</Button>
          <Button type="link" danger={record.status === '启用'} onClick={() => handleToggleStatus(record)}>
            {record.status === '启用' ? '停用' : '启用'}
          </Button>
        </Space>
      ),
    },
  ]

  const moduleGroups = allPermissions.reduce((acc: any, cur: any) => {
    if (!acc[cur.module]) acc[cur.module] = []
    acc[cur.module].push(cur)
    return acc
  }, {})

  return (
    <Card title="系统设置 - 用户与权限管理">
      <Space className="mb-4">
        <Button type="primary" onClick={handleAdd}>新增用户</Button>
      </Space>
      <Table columns={columns} dataSource={users} pagination={{ pageSize: 8 }} />

      <Modal
        title={editingUser ? '编辑用户权限' : '新增用户'}
        open={isModalOpen}
        onOk={() => form.submit()}
        onCancel={() => setIsModalOpen(false)}
        width={720}
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={handleSave}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="用户名" name="username" rules={[{ required: true, message: '请输入用户名' }]}>
                <Input disabled={!!editingUser} placeholder="请输入用户名" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="昵称" name="nickname" rules={[{ required: true, message: '请输入昵称' }]}>
                <Input placeholder="请输入昵称" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="手机号" name="phone" rules={[{ required: true, message: '请输入手机号' }, { pattern: /^1[3-9]\d{9}$/, message: '手机号格式错误' }]}>
                <Input placeholder="请输入手机号" maxLength={11} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="角色" name="role" rules={[{ required: true, message: '请选择角色' }]}>
                <Select placeholder="请选择角色" onChange={onRoleChange}>
                  {roles.map((r: any) => (
                    <Option key={r.key} value={r.key}>{r.name}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item label="权限配置" name="permissions" rules={[{ required: true, message: '请配置权限' }]}>
            <Checkbox.Group className="w-full">
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(moduleGroups).map(([moduleName, perms]: [string, any]) => (
                  <div key={moduleName} className="border rounded p-3">
                    <div className="font-bold mb-2">{moduleName}</div>
                    <Space wrap>
                      {perms.map((p: any) => (
                        <Checkbox key={p.key} value={p.key}>{p.label}</Checkbox>
                      ))}
                    </Space>
                  </div>
                ))}
              </div>
            </Checkbox.Group>
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  )
}
