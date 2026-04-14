import { useState } from 'react'
import { Card, Tabs, Table, Tag, Button, Space, Select, Row, Col, Modal, Form, Input, message } from 'antd'
import EChart from '@/components/EChart'
import dataCenterMock from '../../../mock/dataCenter.json'

const { Option } = Select

export default function DataCenter() {
  const [activeKey, setActiveKey] = useState('1')
  const [data, setData] = useState<any>(dataCenterMock)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalType, setModalType] = useState<'etl' | 'report' | 'export'>('etl')
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
    if (modalType === 'etl') {
      next.etlJobs = next.etlJobs.map((item: any) => (item.key === editingRecord.key ? { ...item, ...values } : item))
    } else if (modalType === 'report') {
      next.reports = next.reports.map((item: any) => (item.key === editingRecord.key ? { ...item, ...values } : item))
    } else if (modalType === 'export') {
      next.exports = next.exports.map((item: any) => (item.key === editingRecord.key ? { ...item, ...values } : item))
    }
    setData(next)
    message.success('保存成功')
    setIsModalOpen(false)
  }

  const reportColumns = [
    { title: '报表名称', dataIndex: 'name' },
    { title: '报表类型', dataIndex: 'type' },
    { title: '更新周期', dataIndex: 'cycle' },
    { title: '最近更新', dataIndex: 'lastUpdate' },
    { title: '状态', dataIndex: 'status', render: (s: string) => <Tag color={s === '正常' ? 'green' : 'red'}>{s}</Tag> },
    { title: '操作', render: (_: any, r: any) => <Space><Button type="link" onClick={() => openEdit('report', r)}>编辑</Button><Button type="link">导出</Button></Space> },
  ]

  const exportColumns = [
    { title: '导出任务', dataIndex: 'task' },
    { title: '格式', dataIndex: 'format' },
    { title: '数据量', dataIndex: 'rows' },
    { title: '创建时间', dataIndex: 'createTime' },
    { title: '状态', dataIndex: 'status', render: (s: string) => <Tag color={s === '已完成' ? 'green' : 'blue'}>{s}</Tag> },
    { title: '操作', render: (_: any, r: any) => <Space><Button type="link" onClick={() => openEdit('export', r)}>编辑</Button><Button type="link">下载</Button></Space> },
  ]

  const { etlJobs, reports, exports, funnel } = data

  const funnelOption = {
    tooltip: { trigger: 'item' as const, formatter: '{a} <br/>{b} : {c}%' },
    series: [
      {
        name: '漏斗',
        type: 'funnel' as const,
        left: '10%',
        top: 20,
        bottom: 20,
        width: '80%',
        min: 0,
        max: 100,
        minSize: '0%',
        maxSize: '100%',
        sort: 'descending' as const,
        gap: 2,
        label: { show: true, position: 'inside' },
        data: funnel.data,
      },
    ],
  }

  return (
    <Card>
      <Tabs activeKey={activeKey} onChange={setActiveKey}>
        <Tabs.TabPane tab="数据仓库与ETL" key="1">
          <div className="grid grid-cols-4 gap-4 mb-4">
            <Card size="small" title="ODS"><div className="text-blue-600 font-bold">8张表</div><div className="text-gray-500 text-sm">原始数据层</div></Card>
            <Card size="small" title="DWD"><div className="text-blue-600 font-bold">24张表</div><div className="text-gray-500 text-sm">明细数据层</div></Card>
            <Card size="small" title="DWS"><div className="text-blue-600 font-bold">16张表</div><div className="text-gray-500 text-sm">汇总数据层</div></Card>
            <Card size="small" title="ADS"><div className="text-blue-600 font-bold">12张表</div><div className="text-gray-500 text-sm">应用数据层</div></Card>
          </div>
          <Table columns={[
            { title: '任务名称', dataIndex: 'name' },
            { title: '数据源', dataIndex: 'source' },
            { title: '目标表', dataIndex: 'target' },
            { title: '调度类型', dataIndex: 'schedule' },
            { title: '上次运行', dataIndex: 'lastRun' },
            { title: '状态', dataIndex: 'status', render: (s: string) => <Tag color={s === '成功' ? 'green' : 'red'}>{s}</Tag> },
            { title: '操作', render: (_: any, r: any) => <Button type="link" onClick={() => openEdit('etl', r)}>编辑</Button> },
          ]} dataSource={etlJobs} pagination={false} />
        </Tabs.TabPane>

        <Tabs.TabPane tab="经营报表" key="2">
          <Space className="mb-4">
            <Select defaultValue="sales" style={{ width: 160 }}>
              <Option value="sales">销售报表</Option>
              <Option value="product">产品报表</Option>
              <Option value="inventory">库存报表</Option>
              <Option value="finance">财务报表</Option>
            </Select>
            <Button type="primary">新建自定义报表</Button>
          </Space>
          <Table columns={reportColumns} dataSource={reports} pagination={{ pageSize: 5 }} style={{ marginTop: '12px' }} />
        </Tabs.TabPane>

        <Tabs.TabPane tab="数据可视化" key="3">
          <Row gutter={[16, 16]}>
            <Col xs={24} lg={12}>
              <Card title="流量转化漏斗"><EChart option={funnelOption} style={{ height: 360 }} /></Card>
            </Col>
            <Col xs={24} lg={12}>
              <Card title="区域销售分布（示意）">
                <div style={{ height: 360, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999' }}>
                  地图数据需加载 ECharts 地图 JSON
                </div>
              </Card>
            </Col>
          </Row>
        </Tabs.TabPane>

        <Tabs.TabPane tab="数据导出与API" key="4">
          <Table columns={exportColumns} dataSource={exports} pagination={{ pageSize: 5 }} />
        </Tabs.TabPane>
      </Tabs>

      <Modal title="编辑" open={isModalOpen} onOk={() => form.submit()} onCancel={() => setIsModalOpen(false)} destroyOnClose>
        <Form form={form} layout="vertical" onFinish={handleSave}>
          {modalType === 'etl' && (
            <>
              <Form.Item label="任务名称" name="name" rules={[{ required: true }]}><Input /></Form.Item>
              <Form.Item label="数据源" name="source"><Input /></Form.Item>
              <Form.Item label="目标表" name="target"><Input /></Form.Item>
              <Form.Item label="调度类型" name="schedule"><Input /></Form.Item>
              <Form.Item label="状态" name="status"><Input /></Form.Item>
            </>
          )}
          {modalType === 'report' && (
            <>
              <Form.Item label="报表名称" name="name" rules={[{ required: true }]}><Input /></Form.Item>
              <Form.Item label="更新周期" name="cycle"><Input /></Form.Item>
              <Form.Item label="状态" name="status"><Input /></Form.Item>
            </>
          )}
          {modalType === 'export' && (
            <>
              <Form.Item label="导出任务" name="task" rules={[{ required: true }]}><Input /></Form.Item>
              <Form.Item label="格式" name="format"><Input /></Form.Item>
              <Form.Item label="数据量" name="rows"><Input /></Form.Item>
              <Form.Item label="状态" name="status"><Input /></Form.Item>
            </>
          )}
        </Form>
      </Modal>
    </Card>
  )
}
