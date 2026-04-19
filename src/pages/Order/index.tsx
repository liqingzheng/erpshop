import { useState } from 'react'
import { Card, Tabs, Table, Tag, Button, Space, Input, Select, Badge, Modal, Form, message } from 'antd'
import orderMock from '../../../mock/order.json'
import { useAuthStore } from '@/store/authStore'

const { Option } = Select

const statusColors: any = { '待付款': 'default', '待审核': 'orange', '待发货': 'blue', '已发货': 'cyan', '已签收': 'green', '已完成': 'success', '售后中': 'red' }

export default function Order() {
  const [activeKey, setActiveKey] = useState('1')
  const [data, setData] = useState<any>(orderMock)
  const [orderKeyword, setOrderKeyword] = useState('')
  const [orderStatus, setOrderStatus] = useState<string | undefined>(undefined)
  const [refundKeyword, setRefundKeyword] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalType, setModalType] = useState<'order' | 'refund' | 'promo' | 'risk'>('order')
  const [editingRecord, setEditingRecord] = useState<any>(null)
  const [form] = Form.useForm()
  const userInfo = useAuthStore((s) => s.userInfo)
  const canEdit = (perm: string) => userInfo?.permissions?.includes('*') || userInfo?.permissions?.includes(perm)

  const openEdit = (type: typeof modalType, record: any) => {
    setModalType(type)
    setEditingRecord(record)
    form.setFieldsValue({ ...record })
    setIsModalOpen(true)
  }

  const handleSave = (values: any) => {
    const next = { ...data }
    if (modalType === 'order') {
      if (editingRecord) {
        next.orders = next.orders.map((item: any) => (item.key === editingRecord.key ? { ...item, ...values } : item))
      } else {
        next.orders = [{ key: Date.now(), ...values }, ...next.orders]
      }
    } else if (modalType === 'refund') {
      if (editingRecord) {
        next.refunds = next.refunds.map((item: any) => (item.key === editingRecord.key ? { ...item, ...values } : item))
      } else {
        next.refunds = [{ key: Date.now(), ...values }, ...next.refunds]
        message.info('仅作演示用，页面切换或刷新将会丢失')
      }
    } else if (modalType === 'promo') {
      if (editingRecord) {
        next.promotions = next.promotions.map((item: any) => (item.key === editingRecord.key ? { ...item, ...values } : item))
      } else {
        next.promotions = [{ key: Date.now(), ...values }, ...next.promotions]
      }
    } else if (modalType === 'risk') {
      if (editingRecord) {
        next.risks = next.risks.map((item: any) => (item.key === editingRecord.key ? { ...item, ...values } : item))
      } else {
        next.risks = [{ key: Date.now(), ...values }, ...next.risks]
      }
    }
    setData(next)
    message.success('保存成功')
    setIsModalOpen(false)
  }

  const orderColumns = [
    { title: '平台单号', dataIndex: 'orderNo' },
    { title: '店铺', dataIndex: 'shop' },
    { title: '买家昵称', dataIndex: 'buyer' },
    { title: '订单金额', dataIndex: 'amount' },
    { title: '实付金额', dataIndex: 'payAmount' },
    { title: '状态', dataIndex: 'status', render: (s: string) => <Badge status={statusColors[s] === 'default' ? 'default' : 'processing'} color={statusColors[s] === 'default' ? '#d9d9d9' : undefined} text={<Tag color={statusColors[s]}>{s}</Tag>} /> },
    { title: '下单时间', dataIndex: 'time' },
    { title: '操作', render: (_: any, r: any) => <Space>{canEdit('order:edit') && <><Button type="link" onClick={() => openEdit('order', r)}>编辑</Button><Button type="link">发货</Button></>}</Space> },
  ]

  const refundColumns = [
    { title: '售后单号', dataIndex: 'refundNo' },
    { title: '关联订单', dataIndex: 'orderNo' },
    { title: '售后类型', dataIndex: 'type' },
    { title: '退款金额', dataIndex: 'amount' },
    { title: '原因', dataIndex: 'reason' },
    { title: '状态', dataIndex: 'status', render: (s: string) => <Tag color={s === '待审核' ? 'orange' : s === '已退款' ? 'green' : 'blue'}>{s}</Tag> },
    { title: '操作', render: (_: any, r: any) => canEdit('order:edit') ? <Button type="link" onClick={() => openEdit('refund', r)}>处理</Button> : null },
  ]

  const promoColumns = [
    { title: '订单号', dataIndex: 'orderNo' },
    { title: '优惠类型', dataIndex: 'promo' },
    { title: '优惠金额', dataIndex: 'discount' },
    { title: '赠品', dataIndex: 'gift' },
    { title: '价保状态', dataIndex: 'priceProtect', render: (s: string) => <Tag color={s === '已价保' ? 'green' : 'default'}>{s}</Tag> },
    { title: '操作', render: (_: any, r: any) => canEdit('order:edit') ? <Button type="link" onClick={() => openEdit('promo', r)}>编辑</Button> : null },
  ]

  const riskColumns = [
    { title: '订单号', dataIndex: 'orderNo' },
    { title: '风险类型', dataIndex: 'riskType' },
    { title: '风险评分', dataIndex: 'score' },
    { title: '命中规则', dataIndex: 'rule' },
    { title: '处理状态', dataIndex: 'handle', render: (s: string) => <Tag color={s === '已拦截' ? 'red' : 'green'}>{s}</Tag> },
    { title: '操作', render: (_: any, r: any) => <Space>{canEdit('order:edit') && <><Button type="link" onClick={() => openEdit('risk', r)}>复核</Button><Button type="link">放行</Button></>}</Space> },
  ]

  const orderData = (data.orders || []).filter((item: any) => {
    const matchKeyword = !orderKeyword || [item.orderNo, item.buyer].some((v) => String(v || '').toLowerCase().includes(orderKeyword.toLowerCase()))
    const matchStatus = !orderStatus || orderStatus === 'all' || item.status === orderStatus
    return matchKeyword && matchStatus
  })
  const refundData = (data.refunds || []).filter((item: any) => {
    return !refundKeyword || [item.refundNo, item.orderNo].some((v) => String(v || '').toLowerCase().includes(refundKeyword.toLowerCase()))
  })

  return (
    <Card>
      <Tabs activeKey={activeKey} onChange={setActiveKey}>
        <Tabs.TabPane tab={<span>订单中心 <Badge count={2} size="small" offset={[8, 0]} /></span>} key="1">
          <Space className="mb-4">
            <Input.Search placeholder="订单号/买家昵称" allowClear style={{ width: 260 }} value={orderKeyword} onChange={(e) => setOrderKeyword(e.target.value)} />
            <Select placeholder="订单状态" allowClear style={{ width: 140 }} value={orderStatus} onChange={(v) => setOrderStatus(v)}>
              <Option value="all">全部</Option>
              <Option value="待审核">待审核</Option>
              <Option value="待发货">待发货</Option>
              <Option value="已发货">已发货</Option>
              <Option value="售后中">售后中</Option>
            </Select>
            {canEdit('order:edit') && <><Button type="primary">批量审单</Button><Button>批量发货</Button></>}
          </Space>
          <Table columns={orderColumns} dataSource={orderData} pagination={{ pageSize: 5 }} style={{ marginTop: '12px' }} />
        </Tabs.TabPane>

        <Tabs.TabPane tab="售后管理" key="2">
          <Space className="mb-4">
            <Input.Search placeholder="售后单号/订单号" allowClear style={{ width: 260 }} value={refundKeyword} onChange={(e) => setRefundKeyword(e.target.value)} />
            {canEdit('order:edit') && <Button type="primary" onClick={() => { setModalType('refund'); setEditingRecord(null); form.resetFields(); setIsModalOpen(true) }}>代客发起售后</Button>}
          </Space>
          <Table columns={refundColumns} dataSource={refundData} pagination={{ pageSize: 5 }} style={{ marginTop: '12px' }} />
        </Tabs.TabPane>

        <Tabs.TabPane tab="促销与价保" key="3">
          <Table columns={promoColumns} dataSource={data.promotions} pagination={{ pageSize: 5 }} />
        </Tabs.TabPane>

        <Tabs.TabPane tab="订单风控" key="4">
          <Table columns={riskColumns} dataSource={data.risks} pagination={false} />
        </Tabs.TabPane>
      </Tabs>

      <Modal title={editingRecord ? '编辑' : modalType === 'refund' ? '代客发起售后' : '编辑'} open={isModalOpen} onOk={() => form.submit()} onCancel={() => setIsModalOpen(false)} destroyOnClose>
        <Form form={form} layout="vertical" onFinish={handleSave}>
          {modalType === 'order' && (
            <>
              <Form.Item label="买家昵称" name="buyer"><Input /></Form.Item>
              <Form.Item label="订单金额" name="amount"><Input /></Form.Item>
              <Form.Item label="实付金额" name="payAmount"><Input /></Form.Item>
              <Form.Item label="状态" name="status">
                <Select><Option value="待审核">待审核</Option><Option value="待发货">待发货</Option><Option value="已发货">已发货</Option><Option value="售后中">售后中</Option><Option value="已完成">已完成</Option></Select>
              </Form.Item>
            </>
          )}
          {modalType === 'refund' && (
            <>
              <Form.Item label="售后单号" name="refundNo"><Input /></Form.Item>
              <Form.Item label="关联订单" name="orderNo"><Input /></Form.Item>
              <Form.Item label="售后类型" name="type"><Input /></Form.Item>
              <Form.Item label="退款金额" name="amount"><Input /></Form.Item>
              <Form.Item label="原因" name="reason"><Input /></Form.Item>
              <Form.Item label="状态" name="status">
                <Select><Option value="待审核">待审核</Option><Option value="已退款">已退款</Option><Option value="仓库质检中">仓库质检中</Option></Select>
              </Form.Item>
            </>
          )}
          {modalType === 'promo' && (
            <>
              <Form.Item label="优惠类型" name="promo"><Input /></Form.Item>
              <Form.Item label="优惠金额" name="discount"><Input /></Form.Item>
              <Form.Item label="赠品" name="gift"><Input /></Form.Item>
              <Form.Item label="价保状态" name="priceProtect">
                <Select><Option value="已价保">已价保</Option><Option value="无价保">无价保</Option></Select>
              </Form.Item>
            </>
          )}
          {modalType === 'risk' && (
            <>
              <Form.Item label="风险类型" name="riskType"><Input /></Form.Item>
              <Form.Item label="风险评分" name="score"><Input type="number" /></Form.Item>
              <Form.Item label="命中规则" name="rule"><Input /></Form.Item>
              <Form.Item label="处理状态" name="handle">
                <Select><Option value="已拦截">已拦截</Option><Option value="已放行">已放行</Option></Select>
              </Form.Item>
            </>
          )}
        </Form>
      </Modal>
    </Card>
  )
}
