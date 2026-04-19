import { useState } from 'react'
import { Card, Tabs, Table, Tag, Button, Space, Input, Select, Modal, Form, message } from 'antd'
import logisticsMock from '../../../mock/logistics.json'
import { useAuthStore } from '@/store/authStore'

const { Option } = Select

export default function Logistics() {
  const [activeKey, setActiveKey] = useState('1')
  const [data, setData] = useState<any>(logisticsMock)
  const [carrierKeyword, setCarrierKeyword] = useState('')
  const [waybillKeyword, setWaybillKeyword] = useState('')
  const [waybillCarrier, setWaybillCarrier] = useState<string | undefined>(undefined)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalType, setModalType] = useState<'carrier' | 'waybill' | 'exception'>('carrier')
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

  const openAddCarrier = () => {
    setModalType('carrier')
    setEditingRecord(null)
    form.resetFields()
    setIsModalOpen(true)
  }

  const handleSave = (values: any) => {
    const next = { ...data }
    if (modalType === 'carrier') {
      if (editingRecord) {
        next.carriers = next.carriers.map((item: any) => (item.key === editingRecord.key ? { ...item, ...values } : item))
      } else {
        next.carriers.unshift({ key: Date.now(), ...values })
      }
    } else if (modalType === 'waybill') {
      next.waybills = next.waybills.map((item: any) => (item.key === editingRecord.key ? { ...item, ...values } : item))
    } else if (modalType === 'exception') {
      next.exceptions = next.exceptions.map((item: any) => (item.key === editingRecord.key ? { ...item, ...values } : item))
    }
    setData(next)
    message.success('保存成功')
    message.info('仅作演示用，页面切换或刷新将会丢失')
    setIsModalOpen(false)
  }

  const carrierColumns = [
    { title: '承运商编码', dataIndex: 'code' },
    { title: '承运商名称', dataIndex: 'name' },
    { title: '结算方式', dataIndex: 'settlement' },
    { title: '服务范围', dataIndex: 'scope' },
    { title: '状态', dataIndex: 'status', render: (s: string) => <Tag color={s === '启用' ? 'green' : 'red'}>{s}</Tag> },
    { title: '操作', render: (_: any, r: any) => <Space>{canEdit('logistics:edit') && <><Button type="link" onClick={() => openEdit('carrier', r)}>编辑</Button><Button type="link">运费模板</Button></>}</Space> },
  ]

  const waybillColumns = [
    { title: '运单号', dataIndex: 'waybillNo' },
    { title: '承运商', dataIndex: 'carrier' },
    { title: '关联订单', dataIndex: 'orderNo' },
    { title: '重量(kg)', dataIndex: 'weight' },
    { title: '运费', dataIndex: 'freight' },
    { title: '状态', dataIndex: 'status', render: (s: string) => <Tag color={s === '已签收' ? 'green' : s === '已发货' ? 'blue' : 'orange'}>{s}</Tag> },
    { title: '操作', render: (_: any, r: any) => <Space>{canEdit('logistics:edit') && <><Button type="link" onClick={() => openEdit('waybill', r)}>编辑</Button><Button type="link">打印</Button></>}</Space> },
  ]

  const exceptionColumns = [
    { title: '异常单号', dataIndex: 'excNo' },
    { title: '运单号', dataIndex: 'waybillNo' },
    { title: '异常类型', dataIndex: 'type' },
    { title: '描述', dataIndex: 'desc' },
    { title: '处理人', dataIndex: 'handler' },
    { title: '状态', dataIndex: 'status', render: (s: string) => <Tag color={s === '待处理' ? 'red' : 'green'}>{s}</Tag> },
    { title: '操作', render: (_: any, r: any) => <Space>{canEdit('logistics:edit') && <><Button type="link" onClick={() => openEdit('exception', r)}>编辑</Button><Button type="link">处理</Button></>}</Space> },
  ]

  const carrierData = (data.carriers || []).filter((item: any) => !carrierKeyword || [item.code, item.name].some((v) => String(v || '').toLowerCase().includes(carrierKeyword.toLowerCase())))
  const waybillData = (data.waybills || []).filter((item: any) => {
    const matchKeyword = !waybillKeyword || [item.waybillNo, item.orderNo].some((v) => String(v || '').toLowerCase().includes(waybillKeyword.toLowerCase()))
    const matchCarrier = !waybillCarrier || waybillCarrier === 'all' || item.carrier === waybillCarrier || (waybillCarrier === 'SF' && item.carrier.includes('顺丰')) || (waybillCarrier === 'ZTO' && item.carrier.includes('中通'))
    return matchKeyword && matchCarrier
  })

  return (
    <Card>
      <Tabs activeKey={activeKey} onChange={setActiveKey}>
        <Tabs.TabPane tab="物流渠道与规则" key="1">
          <Space className="mb-4">
            <Input.Search placeholder="承运商名称" allowClear style={{ width: 260 }} value={carrierKeyword} onChange={(e) => setCarrierKeyword(e.target.value)} />
            {canEdit('logistics:edit') && <><Button type="primary" onClick={openAddCarrier}>新增承运商</Button><Button>运费模板配置</Button></>}
          </Space>
          <Table columns={carrierColumns} dataSource={carrierData} pagination={{ pageSize: 5 }} style={{ marginTop: '12px' }} />
        </Tabs.TabPane>

        <Tabs.TabPane tab="面单与发货" key="2">
          <Space className="mb-4">
            <Input.Search placeholder="运单号/订单号" allowClear style={{ width: 260 }} value={waybillKeyword} onChange={(e) => setWaybillKeyword(e.target.value)} />
            <Select placeholder="承运商" allowClear style={{ width: 140 }} value={waybillCarrier} onChange={(v) => setWaybillCarrier(v)}>
              <Option value="all">全部</Option>
              <Option value="SF">顺丰</Option>
              <Option value="ZTO">中通</Option>
            </Select>
            {canEdit('logistics:edit') && <><Button type="primary">批量取号</Button><Button>批量打印</Button></>}
          </Space>
          <Table columns={waybillColumns} dataSource={waybillData} pagination={{ pageSize: 5 }} />
        </Tabs.TabPane>

        <Tabs.TabPane tab="物流跟踪与异常" key="3">
          <Space className="mb-4">
            {canEdit('logistics:edit') && <Button type="primary">刷新轨迹</Button>}
          </Space>
          <Table columns={exceptionColumns} dataSource={data.exceptions} pagination={{ pageSize: 5 }} />
        </Tabs.TabPane>

        <Tabs.TabPane tab="仓储作业优化" key="4">
          <div className="grid grid-cols-2 gap-4">
            <Card size="small" title="波次拣货">
              <div className="text-gray-600">当前待拣货波次：<span className="text-blue-600 font-bold">{data.warehouseStats.wavePending}</span></div>
              <div className="text-gray-600 mt-2">已完成的波次：<span className="text-green-600 font-bold">{data.warehouseStats.waveDone}</span></div>
              {canEdit('logistics:edit') && <Button className="mt-3" type="primary" size="small">生成波次</Button>}
            </Card>
            <Card size="small" title="拣货路径">
              <div className="text-gray-600">今日平均拣货时长：<span className="text-blue-600 font-bold">{data.warehouseStats.avgPickTime}</span></div>
              <div className="text-gray-600 mt-2">路径优化率：<span className="text-green-600 font-bold">{data.warehouseStats.pathOptimize}</span></div>
            </Card>
            <Card size="small" title="复核策略">
              <div className="text-gray-600">扫码复核：{data.warehouseStats.scanCheck ? '启用' : '停用'}</div>
              <div className="text-gray-600 mt-2">重量复核：{data.warehouseStats.weightCheck ? '启用' : '停用'}</div>
              <div className="text-gray-600 mt-2">图像复核：{data.warehouseStats.imageCheck ? '启用' : '试用中'}</div>
            </Card>
            <Card size="small" title="人效看板">
              <div className="text-gray-600">人均拣货件数：<span className="text-blue-600 font-bold">{data.warehouseStats.pickPerPerson}</span></div>
              <div className="text-gray-600 mt-2">发货及时率：<span className="text-green-600 font-bold">{data.warehouseStats.shipOnTimeRate}</span></div>
            </Card>
          </div>
        </Tabs.TabPane>
      </Tabs>

      <Modal title={editingRecord ? '编辑' : '新增承运商'} open={isModalOpen} onOk={() => form.submit()} onCancel={() => setIsModalOpen(false)} destroyOnClose>
        <Form form={form} layout="vertical" onFinish={handleSave}>
          {modalType === 'carrier' && (
            <>
              <Form.Item label="承运商编码" name="code" rules={[{ required: true }]}><Input /></Form.Item>
              <Form.Item label="承运商名称" name="name" rules={[{ required: true }]}><Input /></Form.Item>
              <Form.Item label="结算方式" name="settlement"><Input /></Form.Item>
              <Form.Item label="服务范围" name="scope"><Input /></Form.Item>
              <Form.Item label="状态" name="status"><Input /></Form.Item>
            </>
          )}
          {modalType === 'waybill' && (
            <>
              <Form.Item label="重量(kg)" name="weight"><Input type="number" /></Form.Item>
              <Form.Item label="运费" name="freight"><Input /></Form.Item>
              <Form.Item label="状态" name="status"><Input /></Form.Item>
            </>
          )}
          {modalType === 'exception' && (
            <>
              <Form.Item label="异常类型" name="type"><Input /></Form.Item>
              <Form.Item label="描述" name="desc"><Input /></Form.Item>
              <Form.Item label="处理人" name="handler"><Input /></Form.Item>
              <Form.Item label="状态" name="status"><Input /></Form.Item>
            </>
          )}
        </Form>
      </Modal>
    </Card>
  )
}
