import { useState } from 'react'
import { Card, Tabs, Table, Tag, Button, Space, Input, Progress, Modal, Form, message } from 'antd'
import purchaseMock from '../../../mock/purchase.json'

export default function Purchase() {
  const [activeKey, setActiveKey] = useState('1')
  const [data, setData] = useState<any>(purchaseMock)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalType, setModalType] = useState<'supplier' | 'po' | 'receipt' | 'statement'>('supplier')
  const [editingRecord, setEditingRecord] = useState<any>(null)
  const [form] = Form.useForm()

  const openEdit = (type: typeof modalType, record: any) => {
    setModalType(type)
    setEditingRecord(record)
    form.setFieldsValue({ ...record })
    setIsModalOpen(true)
  }

  const handleSave = (values: any) => {
    const next = { ...data }
    if (modalType === 'supplier') {
      next.suppliers = next.suppliers.map((item: any) => (item.key === editingRecord.key ? { ...item, ...values } : item))
    } else if (modalType === 'po') {
      next.purchaseOrders = next.purchaseOrders.map((item: any) => (item.key === editingRecord.key ? { ...item, ...values } : item))
    } else if (modalType === 'receipt') {
      next.receipts = next.receipts.map((item: any) => (item.key === editingRecord.key ? { ...item, ...values } : item))
    } else if (modalType === 'statement') {
      next.statements = next.statements.map((item: any) => (item.key === editingRecord.key ? { ...item, ...values } : item))
    }
    setData(next)
    message.success('保存成功')
    setIsModalOpen(false)
  }

  const supplierColumns = [
    { title: '供应商编码', dataIndex: 'code' },
    { title: '供应商名称', dataIndex: 'name' },
    { title: '联系人', dataIndex: 'contact' },
    { title: '结算方式', dataIndex: 'settlement' },
    { title: '评级', dataIndex: 'rating', render: (r: string) => <Tag color={r === 'S' ? 'gold' : r === 'A' ? 'green' : 'default'}>{r}级</Tag> },
    { title: '状态', dataIndex: 'status', render: (s: string) => <Tag color={s === '正常' ? 'green' : 'red'}>{s}</Tag> },
    { title: '操作', render: (_: any, r: any) => <Button type="link" onClick={() => openEdit('supplier', r)}>编辑</Button> },
  ]

  const poColumns = [
    { title: '采购单号', dataIndex: 'poNo' },
    { title: '供应商', dataIndex: 'supplier' },
    { title: '采购金额', dataIndex: 'amount' },
    { title: '状态', dataIndex: 'status', render: (s: string) => <Tag color={s === '全部到货' ? 'green' : s === '待审核' ? 'orange' : 'blue'}>{s}</Tag> },
    { title: '到货进度', dataIndex: 'progress', render: (p: number) => <Progress percent={p} size="small" /> },
    { title: '下单日期', dataIndex: 'date' },
    { title: '操作', render: (_: any, r: any) => <Space><Button type="link" onClick={() => openEdit('po', r)}>编辑</Button><Button type="link">详情</Button></Space> },
  ]

  const receiptColumns = [
    { title: '到货单号', dataIndex: 'receiptNo' },
    { title: '关联PO', dataIndex: 'poNo' },
    { title: '到货数量', dataIndex: 'qty' },
    { title: '合格数量', dataIndex: 'passQty' },
    { title: '不合格数量', dataIndex: 'rejectQty' },
    { title: '质检结果', dataIndex: 'result', render: (s: string) => <Tag color={s === '合格' ? 'green' : s === '让步接收' ? 'orange' : 'red'}>{s}</Tag> },
    { title: '操作', render: (_: any, r: any) => <Button type="link" onClick={() => openEdit('receipt', r)}>编辑</Button> },
  ]

  const suggestColumns = [
    { title: 'SKU编码', dataIndex: 'skuCode' },
    { title: '商品名称', dataIndex: 'name' },
    { title: '安全库存', dataIndex: 'safe' },
    { title: '可用库存', dataIndex: 'available' },
    { title: '在途库存', dataIndex: 'inTransit' },
    { title: '建议采购量', dataIndex: 'suggest' },
    { title: '推荐供应商', dataIndex: 'supplier' },
    { title: '操作', render: () => <Button type="primary" size="small">生成PR</Button> },
  ]

  const statementColumns = [
    { title: '对账月份', dataIndex: 'month' },
    { title: '供应商', dataIndex: 'supplier' },
    { title: '对账金额', dataIndex: 'amount' },
    { title: '已付金额', dataIndex: 'paid' },
    { title: '未付余额', dataIndex: 'balance' },
    { title: '对账状态', dataIndex: 'status', render: (s: string) => <Tag color={s === '已确认' ? 'green' : 'orange'}>{s}</Tag> },
    { title: '操作', render: (_: any, r: any) => <Button type="link" onClick={() => openEdit('statement', r)}>编辑</Button> },
  ]

  return (
    <Card>
      <Tabs activeKey={activeKey} onChange={setActiveKey}>
        <Tabs.TabPane tab="供应商管理" key="1">
          <Space className="mb-4">
            <Input.Search placeholder="供应商名称/编码" allowClear style={{ width: 260 }} />
            <Button type="primary">新增供应商</Button>
          </Space>
          <Table columns={supplierColumns} dataSource={data.suppliers} pagination={{ pageSize: 5 }} />
        </Tabs.TabPane>

        <Tabs.TabPane tab="采购计划与询比价" key="2">
          <div className="mb-4 font-bold">智能补货建议</div>
          <Table columns={suggestColumns} dataSource={data.suggestions} pagination={false} />
        </Tabs.TabPane>

        <Tabs.TabPane tab="采购执行与到货" key="3">
          <Space className="mb-4">
            <Input.Search placeholder="采购单号" allowClear style={{ width: 260 }} />
            <Button type="primary">新建采购单</Button>
          </Space>
          <Table columns={poColumns} dataSource={data.purchaseOrders} pagination={{ pageSize: 5 }} />
          <div className="mt-4 font-bold">到货质检</div>
          <Table className="mt-2" columns={receiptColumns} dataSource={data.receipts} pagination={false} size="small" />
        </Tabs.TabPane>

        <Tabs.TabPane tab="对账与结算" key="4">
          <Table columns={statementColumns} dataSource={data.statements} pagination={{ pageSize: 5 }} />
        </Tabs.TabPane>
      </Tabs>

      <Modal title="编辑" open={isModalOpen} onOk={() => form.submit()} onCancel={() => setIsModalOpen(false)} destroyOnClose>
        <Form form={form} layout="vertical" onFinish={handleSave}>
          {modalType === 'supplier' && (
            <>
              <Form.Item label="供应商名称" name="name" rules={[{ required: true }]}><Input /></Form.Item>
              <Form.Item label="联系人" name="contact"><Input /></Form.Item>
              <Form.Item label="结算方式" name="settlement"><Input /></Form.Item>
              <Form.Item label="评级" name="rating"><Input /></Form.Item>
              <Form.Item label="状态" name="status"><Input /></Form.Item>
            </>
          )}
          {modalType === 'po' && (
            <>
              <Form.Item label="采购金额" name="amount"><Input /></Form.Item>
              <Form.Item label="状态" name="status"><Input /></Form.Item>
              <Form.Item label="下单日期" name="date"><Input /></Form.Item>
            </>
          )}
          {modalType === 'receipt' && (
            <>
              <Form.Item label="到货数量" name="qty"><Input type="number" /></Form.Item>
              <Form.Item label="合格数量" name="passQty"><Input type="number" /></Form.Item>
              <Form.Item label="不合格数量" name="rejectQty"><Input type="number" /></Form.Item>
              <Form.Item label="质检结果" name="result"><Input /></Form.Item>
            </>
          )}
          {modalType === 'statement' && (
            <>
              <Form.Item label="对账金额" name="amount"><Input /></Form.Item>
              <Form.Item label="已付金额" name="paid"><Input /></Form.Item>
              <Form.Item label="未付余额" name="balance"><Input /></Form.Item>
              <Form.Item label="对账状态" name="status"><Input /></Form.Item>
            </>
          )}
        </Form>
      </Modal>
    </Card>
  )
}
