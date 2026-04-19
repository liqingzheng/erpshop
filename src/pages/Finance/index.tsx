import { useState } from 'react'
import { Card, Tabs, Table, Tag, Button, Space, Statistic, Row, Col, Modal, Form, Input, message } from 'antd'
import financeMock from '../../../mock/finance.json'
import { useAuthStore } from '@/store/authStore'

export default function Finance() {
  const [activeKey, setActiveKey] = useState('1')
  const [data, setData] = useState<any>(financeMock)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalType, setModalType] = useState<'ar' | 'ap' | 'cost' | 'profit' | 'fund'>('ar')
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

  const openAdd = () => {
    setModalType('fund')
    setEditingRecord(null)
    form.resetFields()
    setIsModalOpen(true)
  }

  const handleSave = (values: any) => {
    const next = { ...data }
    if (modalType === 'ar') {
      next.arList = next.arList.map((item: any) => (item.key === editingRecord.key ? { ...item, ...values } : item))
    } else if (modalType === 'ap') {
      next.apList = next.apList.map((item: any) => (item.key === editingRecord.key ? { ...item, ...values } : item))
    } else if (modalType === 'cost') {
      next.costs = next.costs.map((item: any) => (item.key === editingRecord.key ? { ...item, ...values } : item))
    } else if (modalType === 'profit') {
      next.profitList = next.profitList.map((item: any) => (item.key === editingRecord.key ? { ...item, ...values } : item))
    } else if (modalType === 'fund') {
      if (editingRecord) {
        next.fundFlows = next.fundFlows.map((item: any) => (item.key === editingRecord.key ? { ...item, ...values } : item))
      } else {
        next.fundFlows.unshift({ key: Date.now(), ...values })
      }
    }
    setData(next)
    message.success('保存成功')
    message.info('仅作演示用，页面切换或刷新将会丢失')
    setIsModalOpen(false)
  }

  const arColumns = [
    { title: '业务单号', dataIndex: 'bizNo' },
    { title: '平台/店铺', dataIndex: 'platform' },
    { title: '应收金额', dataIndex: 'amount' },
    { title: '已收金额', dataIndex: 'received' },
    { title: '未收余额', dataIndex: 'balance' },
    { title: '账龄(天)', dataIndex: 'aging' },
    { title: '状态', dataIndex: 'status', render: (s: string) => <Tag color={s === '已结清' ? 'green' : 'orange'}>{s}</Tag> },
    { title: '操作', render: (_: any, r: any) => canEdit('finance:edit') ? <Button type="link" onClick={() => openEdit('ar', r)}>编辑</Button> : null },
  ]

  const apColumns = [
    { title: '业务单号', dataIndex: 'bizNo' },
    { title: '供应商', dataIndex: 'supplier' },
    { title: '应付金额', dataIndex: 'amount' },
    { title: '已付金额', dataIndex: 'paid' },
    { title: '未付余额', dataIndex: 'balance' },
    { title: '到期日', dataIndex: 'dueDate' },
    { title: '状态', dataIndex: 'status', render: (s: string) => <Tag color={s === '已付清' ? 'green' : 'orange'}>{s}</Tag> },
    { title: '操作', render: (_: any, r: any) => canEdit('finance:edit') ? <Button type="link" onClick={() => openEdit('ap', r)}>编辑</Button> : null },
  ]

  const costColumns = [
    { title: 'SKU编码', dataIndex: 'skuCode' },
    { title: '采购成本(加权平均)', dataIndex: 'cost' },
    { title: '运费分摊', dataIndex: 'freight' },
    { title: '包装费分摊', dataIndex: 'package' },
    { title: '平台佣金', dataIndex: 'commission' },
    { title: '推广费分摊', dataIndex: 'ad' },
    { title: '综合成本', dataIndex: 'total' },
    { title: '操作', render: (_: any, r: any) => canEdit('finance:edit') ? <Button type="link" onClick={() => openEdit('cost', r)}>编辑</Button> : null },
  ]

  const profitColumns = [
    { title: '日期', dataIndex: 'date' },
    { title: '销售额', dataIndex: 'sales' },
    { title: '成本', dataIndex: 'cost' },
    { title: '费用', dataIndex: 'expense' },
    { title: '毛利', dataIndex: 'gross' },
    { title: '毛利率', dataIndex: 'grossRate' },
    { title: '操作', render: (_: any, r: any) => canEdit('finance:edit') ? <Button type="link" onClick={() => openEdit('profit', r)}>编辑</Button> : null },
  ]

  const fundColumns = [
    { title: '流水号', dataIndex: 'flowNo' },
    { title: '账户', dataIndex: 'account' },
    { title: '收支类型', dataIndex: 'type' },
    { title: '金额', dataIndex: 'amount' },
    { title: '余额', dataIndex: 'balance' },
    { title: '交易时间', dataIndex: 'time' },
    { title: '备注', dataIndex: 'remark' },
    { title: '操作', render: (_: any, r: any) => canEdit('finance:edit') ? <Button type="link" onClick={() => openEdit('fund', r)}>编辑</Button> : null },
  ]

  return (
    <Card>
      <Tabs activeKey={activeKey} onChange={setActiveKey}>
        <Tabs.TabPane tab="应收应付管理" key="1">
          <Row gutter={[16, 16]} className="mb-4">
            <Col span={6}><Card><Statistic title="应收账款总额" value={data.arSummary.total} prefix="¥" /></Card></Col>
            <Col span={6}><Card><Statistic title="已收金额" value={data.arSummary.received} prefix="¥" valueStyle={{ color: '#52c41a' }} /></Card></Col>
            <Col span={6}><Card><Statistic title="应付账款总额" value={data.apSummary.total} prefix="¥" /></Card></Col>
            <Col span={6}><Card><Statistic title="已付金额" value={data.apSummary.paid} prefix="¥" valueStyle={{ color: '#f5222d' }} /></Card></Col>
          </Row>
          <div className="font-bold mb-2">应收账款</div>
          <Table columns={arColumns} dataSource={data.arList} pagination={{ pageSize: 5 }} size="small" />
          <div className="font-bold mb-2 mt-4">应付账款</div>
          <Table columns={apColumns} dataSource={data.apList} pagination={{ pageSize: 5 }} size="small" />
        </Tabs.TabPane>

        <Tabs.TabPane tab="成本核算" key="2">
          <Table columns={costColumns} dataSource={data.costs} pagination={false} />
        </Tabs.TabPane>

        <Tabs.TabPane tab="利润分析" key="3">
          <Row gutter={[16, 16]} className="mb-4">
            <Col span={8}><Card><Statistic title="本月毛利" value={data.profitSummary.gross} prefix="¥" valueStyle={{ color: '#52c41a' }} /></Card></Col>
            <Col span={8}><Card><Statistic title="本月净利" value={data.profitSummary.net} prefix="¥" valueStyle={{ color: '#1677ff' }} /></Card></Col>
            <Col span={8}><Card><Statistic title="净利润率" value={data.profitSummary.margin} suffix="%" valueStyle={{ color: '#722ed1' }} /></Card></Col>
          </Row>
          <Table columns={profitColumns} dataSource={data.profitList} pagination={false} />
        </Tabs.TabPane>

        <Tabs.TabPane tab="资金与票据" key="4">
          <Space className="mb-4">
            {canEdit('finance:edit') && <><Button type="primary" onClick={openAdd}>新增付款申请</Button><Button>发票验真</Button></>}
          </Space>
          <Table columns={fundColumns} dataSource={data.fundFlows} pagination={{ pageSize: 5 }} />
        </Tabs.TabPane>
      </Tabs>

      <Modal title={editingRecord ? '编辑' : '新增付款申请'} open={isModalOpen} onOk={() => form.submit()} onCancel={() => setIsModalOpen(false)} destroyOnClose>
        <Form form={form} layout="vertical" onFinish={handleSave}>
          {modalType === 'ar' && (
            <>
              <Form.Item label="应收金额" name="amount"><Input /></Form.Item>
              <Form.Item label="已收金额" name="received"><Input /></Form.Item>
              <Form.Item label="未收余额" name="balance"><Input /></Form.Item>
              <Form.Item label="账龄(天)" name="aging"><Input type="number" /></Form.Item>
              <Form.Item label="状态" name="status"><Input /></Form.Item>
            </>
          )}
          {modalType === 'ap' && (
            <>
              <Form.Item label="应付金额" name="amount"><Input /></Form.Item>
              <Form.Item label="已付金额" name="paid"><Input /></Form.Item>
              <Form.Item label="未付余额" name="balance"><Input /></Form.Item>
              <Form.Item label="到期日" name="dueDate"><Input /></Form.Item>
              <Form.Item label="状态" name="status"><Input /></Form.Item>
            </>
          )}
          {modalType === 'cost' && (
            <>
              <Form.Item label="采购成本" name="cost"><Input /></Form.Item>
              <Form.Item label="运费分摊" name="freight"><Input /></Form.Item>
              <Form.Item label="包装费分摊" name="package"><Input /></Form.Item>
              <Form.Item label="平台佣金" name="commission"><Input /></Form.Item>
              <Form.Item label="推广费分摊" name="ad"><Input /></Form.Item>
              <Form.Item label="综合成本" name="total"><Input /></Form.Item>
            </>
          )}
          {modalType === 'profit' && (
            <>
              <Form.Item label="销售额" name="sales"><Input /></Form.Item>
              <Form.Item label="成本" name="cost"><Input /></Form.Item>
              <Form.Item label="费用" name="expense"><Input /></Form.Item>
              <Form.Item label="毛利" name="gross"><Input /></Form.Item>
              <Form.Item label="毛利率" name="grossRate"><Input /></Form.Item>
            </>
          )}
          {modalType === 'fund' && (
            <>
              <Form.Item label="流水号" name="flowNo"><Input /></Form.Item>
              <Form.Item label="账户" name="account"><Input /></Form.Item>
              <Form.Item label="收支类型" name="type"><Input /></Form.Item>
              <Form.Item label="金额" name="amount"><Input /></Form.Item>
              <Form.Item label="余额" name="balance"><Input /></Form.Item>
              <Form.Item label="交易时间" name="time"><Input /></Form.Item>
              <Form.Item label="备注" name="remark"><Input /></Form.Item>
            </>
          )}
        </Form>
      </Modal>
    </Card>
  )
}
