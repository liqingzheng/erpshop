import { useState } from 'react'
import { Card, Tabs, Table, Tag, Button, Space, Input, Modal, Form, message } from 'antd'
import inventoryMock from '../../../mock/inventory.json'

export default function Inventory() {
  const [activeKey, setActiveKey] = useState('1')
  const [data, setData] = useState<any>(inventoryMock)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalType, setModalType] = useState<'warehouse' | 'inbound' | 'outbound' | 'inventory'>('warehouse')
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
    if (modalType === 'warehouse') {
      next.warehouses = next.warehouses.map((item: any) => (item.key === editingRecord.key ? { ...item, ...values } : item))
    } else if (modalType === 'inbound') {
      next.inbounds = next.inbounds.map((item: any) => (item.key === editingRecord.key ? { ...item, ...values } : item))
    } else if (modalType === 'outbound') {
      next.outbounds = next.outbounds.map((item: any) => (item.key === editingRecord.key ? { ...item, ...values } : item))
    } else if (modalType === 'inventory') {
      next.inventoryList = next.inventoryList.map((item: any) => (item.key === editingRecord.key ? { ...item, ...values } : item))
    }
    setData(next)
    message.success('保存成功')
    setIsModalOpen(false)
  }

  const warehouseColumns = [
    { title: '仓库编码', dataIndex: 'code' },
    { title: '仓库名称', dataIndex: 'name' },
    { title: '类型', dataIndex: 'type' },
    { title: '地址', dataIndex: 'address' },
    { title: '面积(m²)', dataIndex: 'area' },
    { title: '状态', dataIndex: 'status', render: (s: string) => <Tag color={s === '启用' ? 'green' : 'red'}>{s}</Tag> },
    { title: '操作', render: (_: any, r: any) => <Space><Button type="link" onClick={() => openEdit('warehouse', r)}>编辑</Button><Button type="link">库位管理</Button></Space> },
  ]

  const inventoryColumns = [
    { title: 'SKU编码', dataIndex: 'skuCode' },
    { title: '仓库', dataIndex: 'warehouse' },
    { title: '库位', dataIndex: 'location' },
    { title: '可用库存', dataIndex: 'available' },
    { title: '锁定库存', dataIndex: 'locked' },
    { title: '在途库存', dataIndex: 'inTransit' },
    { title: '冻结库存', dataIndex: 'frozen' },
    { title: '状态', dataIndex: 'status', render: (s: string) => <Tag color={s === '正常' ? 'green' : 'red'}>{s}</Tag> },
    { title: '操作', render: (_: any, r: any) => <Button type="link" onClick={() => openEdit('inventory', r)}>编辑</Button> },
  ]

  const inboundColumns = [
    { title: '入库单号', dataIndex: 'inNo' },
    { title: '业务类型', dataIndex: 'type' },
    { title: '仓库', dataIndex: 'warehouse' },
    { title: 'SKU数', dataIndex: 'skuCount' },
    { title: '总数量', dataIndex: 'qty' },
    { title: '状态', dataIndex: 'status', render: (s: string) => <Tag color={s === '已完成' ? 'green' : 'blue'}>{s}</Tag> },
    { title: '操作', render: (_: any, r: any) => <Button type="link" onClick={() => openEdit('inbound', r)}>编辑</Button> },
  ]

  const outboundColumns = [
    { title: '出库单号', dataIndex: 'outNo' },
    { title: '业务类型', dataIndex: 'type' },
    { title: '仓库', dataIndex: 'warehouse' },
    { title: 'SKU数', dataIndex: 'skuCount' },
    { title: '总数量', dataIndex: 'qty' },
    { title: '状态', dataIndex: 'status', render: (s: string) => <Tag color={s === '已出库' ? 'green' : 'blue'}>{s}</Tag> },
    { title: '操作', render: (_: any, r: any) => <Button type="link" onClick={() => openEdit('outbound', r)}>编辑</Button> },
  ]

  return (
    <Card>
      <Tabs activeKey={activeKey} onChange={setActiveKey}>
        <Tabs.TabPane tab="仓库与库位" key="1">
          <Space className="mb-4">
            <Input.Search placeholder="仓库名称/编码" allowClear style={{ width: 260 }} />
            <Button type="primary">新增仓库</Button>
          </Space>
          <Table columns={warehouseColumns} dataSource={data.warehouses} pagination={{ pageSize: 5 }} />
        </Tabs.TabPane>

        <Tabs.TabPane tab="入库管理" key="2">
          <Space className="mb-4">
            <Input.Search placeholder="入库单号" allowClear style={{ width: 260 }} />
            <Button type="primary">新建入库单</Button>
          </Space>
          <Table columns={inboundColumns} dataSource={data.inbounds} pagination={{ pageSize: 5 }} />
        </Tabs.TabPane>

        <Tabs.TabPane tab="出库与库内作业" key="3">
          <Space className="mb-4">
            <Input.Search placeholder="出库单号" allowClear style={{ width: 260 }} />
            <Button type="primary">新建出库单</Button>
            <Button>盘点任务</Button>
            <Button>移库</Button>
          </Space>
          <Table columns={outboundColumns} dataSource={data.outbounds} pagination={{ pageSize: 5 }} />
        </Tabs.TabPane>

        <Tabs.TabPane tab="库存监控与预警" key="4">
          <Space className="mb-4">
            <Input.Search placeholder="SKU编码" allowClear style={{ width: 260 }} />
            <Button type="primary">导出库存</Button>
          </Space>
          <Table columns={inventoryColumns} dataSource={data.inventoryList} pagination={{ pageSize: 5 }} />
          <div className="mt-4 grid grid-cols-3 gap-4">
            <Card size="small" title="安全库存不足">
              <div className="text-red-500 text-2xl font-bold">{data.alerts?.safeStock}</div>
              <div className="text-gray-500 text-sm">个SKU需补货</div>
            </Card>
            <Card size="small" title="超储预警">
              <div className="text-orange-500 text-2xl font-bold">{data.alerts?.overStock}</div>
              <div className="text-gray-500 text-sm">个SKU库存积压</div>
            </Card>
            <Card size="small" title="临期预警">
              <div className="text-yellow-500 text-2xl font-bold">{data.alerts?.expire}</div>
              <div className="text-gray-500 text-sm">个SKU临期</div>
            </Card>
          </div>
        </Tabs.TabPane>
      </Tabs>

      <Modal title="编辑" open={isModalOpen} onOk={() => form.submit()} onCancel={() => setIsModalOpen(false)} destroyOnClose>
        <Form form={form} layout="vertical" onFinish={handleSave}>
          {modalType === 'warehouse' && (
            <>
              <Form.Item label="仓库名称" name="name" rules={[{ required: true }]}><Input /></Form.Item>
              <Form.Item label="类型" name="type"><Input /></Form.Item>
              <Form.Item label="地址" name="address"><Input /></Form.Item>
              <Form.Item label="面积" name="area"><Input type="number" /></Form.Item>
              <Form.Item label="状态" name="status"><Input /></Form.Item>
            </>
          )}
          {modalType === 'inbound' && (
            <>
              <Form.Item label="业务类型" name="type"><Input /></Form.Item>
              <Form.Item label="仓库" name="warehouse"><Input /></Form.Item>
              <Form.Item label="SKU数" name="skuCount"><Input type="number" /></Form.Item>
              <Form.Item label="总数量" name="qty"><Input type="number" /></Form.Item>
              <Form.Item label="状态" name="status"><Input /></Form.Item>
            </>
          )}
          {modalType === 'outbound' && (
            <>
              <Form.Item label="业务类型" name="type"><Input /></Form.Item>
              <Form.Item label="仓库" name="warehouse"><Input /></Form.Item>
              <Form.Item label="SKU数" name="skuCount"><Input type="number" /></Form.Item>
              <Form.Item label="总数量" name="qty"><Input type="number" /></Form.Item>
              <Form.Item label="状态" name="status"><Input /></Form.Item>
            </>
          )}
          {modalType === 'inventory' && (
            <>
              <Form.Item label="库位" name="location"><Input /></Form.Item>
              <Form.Item label="可用库存" name="available"><Input type="number" /></Form.Item>
              <Form.Item label="锁定库存" name="locked"><Input type="number" /></Form.Item>
              <Form.Item label="在途库存" name="inTransit"><Input type="number" /></Form.Item>
              <Form.Item label="冻结库存" name="frozen"><Input type="number" /></Form.Item>
              <Form.Item label="状态" name="status"><Input /></Form.Item>
            </>
          )}
        </Form>
      </Modal>
    </Card>
  )
}
