import { useState } from 'react'
import { Card, Tabs, Table, Tag, Button, Space, Input, Select, Image, Modal, Form, message } from 'antd'
import productMock from '../../../mock/product.json'

const { Option } = Select

export default function Product() {
  const [activeKey, setActiveKey] = useState('1')
  const [data, setData] = useState<any>(productMock)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalType, setModalType] = useState<'spu' | 'category' | 'brand' | 'price' | 'lifecycle'>('spu')
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
    if (modalType === 'spu') {
      next.spuList = next.spuList.map((item: any) => (item.key === editingRecord.key ? { ...item, ...values } : item))
    } else if (modalType === 'category') {
      next.categories = next.categories.map((item: any) => (item.key === editingRecord.key ? { ...item, ...values } : item))
    } else if (modalType === 'brand') {
      next.brands = next.brands.map((item: any) => (item.key === editingRecord.key ? { ...item, ...values } : item))
    } else if (modalType === 'price') {
      next.prices = next.prices.map((item: any) => (item.key === editingRecord.key ? { ...item, ...values } : item))
    } else if (modalType === 'lifecycle') {
      next.lifecycle = next.lifecycle.map((item: any) => (item.key === editingRecord.key ? { ...item, ...values } : item))
    }
    setData(next)
    message.success('保存成功')
    setIsModalOpen(false)
  }

  const spuColumns = [
    { title: 'SPU编码', dataIndex: 'spuCode' },
    { title: '商品标题', dataIndex: 'title', ellipsis: true },
    { title: '主图', dataIndex: 'image', render: (url: string) => <Image src={url} width={48} /> },
    { title: '类目', dataIndex: 'category' },
    { title: '品牌', dataIndex: 'brand' },
    { title: '状态', dataIndex: 'status', render: (s: string) => <Tag color={s === '已上架' ? 'green' : s === '待审核' ? 'orange' : 'default'}>{s}</Tag> },
    { title: '操作', key: 'action', render: (_: any, r: any) => <Space><Button type="link" onClick={() => openEdit('spu', r)}>编辑</Button><Button type="link">详情</Button></Space> },
  ]

  const skuColumns = [
    { title: 'SKU编码', dataIndex: 'skuCode' },
    { title: '规格', dataIndex: 'spec' },
    { title: '条码', dataIndex: 'barcode' },
    { title: '成本价', dataIndex: 'cost' },
    { title: '销售价', dataIndex: 'sale' },
    { title: '库存', dataIndex: 'stock' },
  ]

  const categoryColumns = [
    { title: '类目名称', dataIndex: 'name' },
    { title: '层级', dataIndex: 'level' },
    { title: '下级类目', render: (_: any, r: any) => r.children },
    { title: '操作', render: (_: any, r: any) => <Button type="link" onClick={() => openEdit('category', r)}>编辑</Button> },
  ]

  const brandColumns = [
    { title: '品牌名称', dataIndex: 'name' },
    { title: '所属国家', dataIndex: 'country' },
    { title: '经营类目', dataIndex: 'category' },
    { title: '状态', dataIndex: 'status', render: (s: string) => <Tag color={s.includes('预警') ? 'orange' : 'green'}>{s}</Tag> },
    { title: '操作', render: (_: any, r: any) => <Button type="link" onClick={() => openEdit('brand', r)}>编辑</Button> },
  ]

  const lifecycleColumns = [
    { title: 'SPU编码', dataIndex: 'spuCode' },
    { title: '商品标题', dataIndex: 'title' },
    { title: '生命周期', dataIndex: 'status', render: (s: string) => <Tag color={s === '滞销' ? 'red' : s === '爆款' ? 'green' : 'blue'}>{s}</Tag> },
    { title: '周转天数', dataIndex: 'days' },
    { title: '建议操作', render: (_: any, r: any) => <span>{r.status === '滞销' ? '降价清仓/退货供应商' : r.status === '爆款' ? '加大库存与推广' : '保持观察'}</span> },
    { title: '操作', render: (_: any, r: any) => <Button type="link" onClick={() => openEdit('lifecycle', r)}>编辑</Button> },
  ]

  const priceColumns = [
    { title: 'SKU编码', dataIndex: 'skuCode' },
    { title: '规格', dataIndex: 'spec' },
    { title: '成本价', dataIndex: 'cost' },
    { title: '日常价', dataIndex: 'sale' },
    { title: '会员价', dataIndex: 'member' },
    { title: '活动价', dataIndex: 'activity' },
    { title: '平台售价', dataIndex: 'platform' },
    { title: '同步状态', dataIndex: 'sync', render: (s: string) => <Tag color={s === '同步成功' ? 'green' : 'red'}>{s}</Tag> },
    { title: '操作', render: (_: any, r: any) => <Button type="link" onClick={() => openEdit('price', r)}>调价</Button> },
  ]

  const spuData = data?.spuList || []
  const skuData = data?.skuList || []
  const categoryData = data?.categories || []
  const brandData = data?.brands || []
  const lifecycleData = data?.lifecycle || []
  const priceData = data?.prices || []

  return (
    <Card>
      <Tabs activeKey={activeKey} onChange={setActiveKey}>
        <Tabs.TabPane tab="产品资料库" key="1">
          <Space className="mb-4">
            <Input.Search placeholder="搜索SPU/SKU/标题" allowClear style={{ width: 280 }} />
            <Select placeholder="状态" allowClear style={{ width: 120 }}>
              <Option value="all">全部</Option>
              <Option value="上架">已上架</Option>
              <Option value="下架">已下架</Option>
            </Select>
            <Button type="primary">新增SPU</Button>
            <Button>批量导入</Button>
          </Space>
          <Table columns={spuColumns} dataSource={spuData} pagination={{ pageSize: 5 }} style={{ marginTop: '12px' }} />
          <div className="mt-4">
            <h4 className="font-bold mb-2">SKU明细</h4>
            <Table columns={skuColumns} dataSource={skuData} pagination={{ pageSize: 5 }} size="small" />
          </div>
        </Tabs.TabPane>

        <Tabs.TabPane tab="类目与品牌" key="2">
          <div className="mb-4 font-bold">类目树</div>
          <Table columns={categoryColumns} dataSource={categoryData} pagination={false} childrenColumnName="subRows" />
          <div className="mt-6 mb-4 font-bold">品牌库</div>
          <Table columns={brandColumns} dataSource={brandData} pagination={false} childrenColumnName="subRows" />
        </Tabs.TabPane>

        <Tabs.TabPane tab="价格与刊登" key="3">
          <Table columns={priceColumns} dataSource={priceData} pagination={{ pageSize: 5 }} />
        </Tabs.TabPane>

        <Tabs.TabPane tab="生命周期" key="4">
          <Table columns={lifecycleColumns} dataSource={lifecycleData} pagination={false} />
        </Tabs.TabPane>
      </Tabs>

      <Modal
        title="编辑"
        open={isModalOpen}
        onOk={() => form.submit()}
        onCancel={() => setIsModalOpen(false)}
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={handleSave}>
          {modalType === 'spu' && (
            <>
              <Form.Item label="商品标题" name="title" rules={[{ required: true }]}><Input /></Form.Item>
              <Form.Item label="类目" name="category" rules={[{ required: true }]}><Input /></Form.Item>
              <Form.Item label="品牌" name="brand" rules={[{ required: true }]}><Input /></Form.Item>
              <Form.Item label="状态" name="status" rules={[{ required: true }]}>
                <Select><Option value="已上架">已上架</Option><Option value="待审核">待审核</Option><Option value="已下架">已下架</Option></Select>
              </Form.Item>
            </>
          )}
          {modalType === 'category' && (
            <>
              <Form.Item label="类目名称" name="name" rules={[{ required: true }]}><Input /></Form.Item>
              <Form.Item label="层级" name="level" rules={[{ required: true }]}><Input type="number" /></Form.Item>
              <Form.Item label="下级类目" name="children"><Input /></Form.Item>
            </>
          )}
          {modalType === 'brand' && (
            <>
              <Form.Item label="品牌名称" name="name" rules={[{ required: true }]}><Input /></Form.Item>
              <Form.Item label="所属国家" name="country"><Input /></Form.Item>
              <Form.Item label="经营类目" name="category"><Input /></Form.Item>
              <Form.Item label="状态" name="status"><Input /></Form.Item>
            </>
          )}
          {modalType === 'price' && (
            <>
              <Form.Item label="成本价" name="cost"><Input /></Form.Item>
              <Form.Item label="日常价" name="sale"><Input /></Form.Item>
              <Form.Item label="会员价" name="member"><Input /></Form.Item>
              <Form.Item label="活动价" name="activity"><Input /></Form.Item>
              <Form.Item label="平台售价" name="platform"><Input /></Form.Item>
              <Form.Item label="同步状态" name="sync">
                <Select><Option value="同步成功">同步成功</Option><Option value="同步失败">同步失败</Option></Select>
              </Form.Item>
            </>
          )}
          {modalType === 'lifecycle' && (
            <>
              <Form.Item label="商品标题" name="title" rules={[{ required: true }]}><Input /></Form.Item>
              <Form.Item label="生命周期" name="status" rules={[{ required: true }]}>
                <Select><Option value="潜力爆款">潜力爆款</Option><Option value="爆款">爆款</Option><Option value="滞销">滞销</Option><Option value="正常">正常</Option></Select>
              </Form.Item>
              <Form.Item label="周转天数" name="days" rules={[{ required: true }]}><Input type="number" /></Form.Item>
            </>
          )}
        </Form>
      </Modal>
    </Card>
  )
}
