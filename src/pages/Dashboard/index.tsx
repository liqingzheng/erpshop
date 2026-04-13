import { Row, Col, Card, Table, Tag, Button, List } from 'antd'
import { useNavigate } from 'react-router-dom'
import EChart from '@/components/EChart'
import dashboardMock from '../../../mock/dashboard.json'
import './dashboard.scss'

const statusColors: any = { '待审核': 'orange', '待发货': 'blue', '已发货': 'cyan', '售后中': 'red', '已完成': 'green' }

const kpiList = [
  { title: '今日GMV', value: '¥ 124,580', icon: 'bi-currency-yen', color: 'linear-gradient(135deg,#667eea,#764ba2)', trend: '+12.5%', up: true },
  { title: '今日订单', value: '1,245', icon: 'bi-cart-check', color: 'linear-gradient(135deg,#42a5f5,#478ed1)', trend: '+8.2%', up: true },
  { title: '今日访客', value: '3,842', icon: 'bi-people', color: 'linear-gradient(135deg,#26c6da,#0097a7)', trend: '-2.1%', up: false },
  { title: '今日利润', value: '¥ 18,650', icon: 'bi-graph-up-arrow', color: 'linear-gradient(135deg,#66bb6a,#43a047)', trend: '+15.3%', up: true },
  { title: '待发货', value: '86', icon: 'bi-box-seam', color: 'linear-gradient(135deg,#ffa726,#fb8c00)', trend: '-5 单', up: true },
  { title: '库存预警', value: '12 SKU', icon: 'bi-exclamation-triangle', color: 'linear-gradient(135deg,#ef5350,#e53935)', trend: '需补货', up: false },
]

export default function Dashboard() {
  const navigate = useNavigate()
  const { salesTrend, todayRealtime, categoryPie, profitPie, warehouseBar, todo, latestOrders, operations } = dashboardMock as any

  const salesOption = {
    tooltip: { trigger: 'axis' as const },
    grid: { left: '2%', right: '3%', bottom: '2%', top: '10%', containLabel: true },
    xAxis: { type: 'category' as const, data: salesTrend.xAxis, axisLine: { lineStyle: { color: '#cbd5e1' } }, axisLabel: { color: '#64748b' } },
    yAxis: { type: 'value' as const, splitLine: { lineStyle: { color: '#f1f5f9' } }, axisLabel: { color: '#64748b' } },
    series: [
      {
        name: '销售额',
        type: 'bar' as const,
        barWidth: 16,
        itemStyle: { borderRadius: [4, 4, 0, 0], color: { type: 'linear', x: 0, y: 0, x2: 0, y2: 1, colorStops: [{ offset: 0, color: '#60a5fa' }, { offset: 1, color: '#3b82f6' }] } },
        data: salesTrend.sales,
      },
      {
        name: '订单量',
        type: 'line' as const,
        smooth: true,
        symbol: 'circle',
        symbolSize: 6,
        itemStyle: { color: '#22d3ee' },
        lineStyle: { width: 3 },
        data: salesTrend.orders,
      },
    ],
  }

  const realtimeOption = {
    tooltip: { trigger: 'axis' as const },
    grid: { left: '2%', right: '3%', bottom: '2%', top: '10%', containLabel: true },
    xAxis: { type: 'category' as const, boundaryGap: false, data: todayRealtime.hours, axisLine: { lineStyle: { color: '#cbd5e1' } }, axisLabel: { color: '#64748b' } },
    yAxis: [
      { type: 'value' as const, name: 'GMV', position: 'left', splitLine: { lineStyle: { color: '#f1f5f9' } }, axisLabel: { color: '#64748b' } },
      { type: 'value' as const, name: '订单', position: 'right', splitLine: { show: false }, axisLabel: { color: '#64748b' } },
    ],
    series: [
      {
        name: '今日GMV',
        type: 'line' as const,
        smooth: true,
        yAxisIndex: 0,
        showSymbol: false,
        lineStyle: { width: 3, color: '#f43f5e' },
        areaStyle: {
          color: { type: 'linear', x: 0, y: 0, x2: 0, y2: 1, colorStops: [{ offset: 0, color: 'rgba(244,63,94,0.35)' }, { offset: 1, color: 'rgba(244,63,94,0.02)' }] },
        },
        data: todayRealtime.gmv,
      },
      {
        name: '今日订单',
        type: 'line' as const,
        smooth: true,
        yAxisIndex: 1,
        showSymbol: false,
        lineStyle: { width: 3, color: '#0ea5e9' },
        areaStyle: {
          color: { type: 'linear', x: 0, y: 0, x2: 0, y2: 1, colorStops: [{ offset: 0, color: 'rgba(14,165,233,0.35)' }, { offset: 1, color: 'rgba(14,165,233,0.02)' }] },
        },
        data: todayRealtime.orders,
      },
    ],
  }

  const pieOption = {
    color: ['#60a5fa', '#34d399', '#fbbf24', '#f87171', '#a78bfa'],
    tooltip: { trigger: 'item' as const },
    legend: {
      orient: 'vertical',
      right: '2%',
      top: 'center',
      itemGap: 16,
      icon: 'circle',
      itemWidth: 10,
      itemHeight: 10,
      textStyle: { color: '#64748b' }
    },
    series: [
      {
        name: '品类占比',
        type: 'pie' as const,
        radius: ['50%', '72%'],
        center: ['38%', '50%'],
        avoidLabelOverlap: false,
        itemStyle: { borderRadius: 8, borderColor: '#fff', borderWidth: 2 },
        label: { show: false },
        emphasis: { label: { show: true, fontSize: 14, fontWeight: 'bold' } },
        data: categoryPie,
      },
    ],
  }

  const profitOption = {
    color: ['#22c55e', '#f87171', '#3b82f6'],
    tooltip: { trigger: 'item' as const, formatter: '{b}: {d}%' },
    legend: { show: false },
    series: [
      {
        name: '利润结构',
        type: 'pie' as const,
        radius: '68%',
        center: ['50%', '50%'],
        itemStyle: { borderRadius: 8, borderColor: '#fff', borderWidth: 2 },
        label: { show: true, formatter: '{b}\n{d}%', color: '#475569' },
        data: profitPie,
      },
    ],
  }

  const barOption = {
    tooltip: { trigger: 'axis' as const, axisPointer: { type: 'shadow' as const } },
    grid: { left: '2%', right: '4%', bottom: '2%', top: '8%', containLabel: true },
    xAxis: { type: 'category' as const, data: warehouseBar.xAxis, axisLine: { lineStyle: { color: '#cbd5e1' } }, axisLabel: { color: '#64748b' } },
    yAxis: { type: 'value' as const, splitLine: { lineStyle: { color: '#f1f5f9' } }, axisLabel: { color: '#64748b' } },
    series: [{
      data: warehouseBar.data,
      type: 'bar' as const,
      barWidth: 18,
      showBackground: true,
      backgroundStyle: { color: '#f1f5f9', borderRadius: [4, 4, 0, 0] },
      itemStyle: { borderRadius: [4, 4, 0, 0], color: { type: 'linear', x: 0, y: 0, x2: 0, y2: 1, colorStops: [{ offset: 0, color: '#a78bfa' }, { offset: 1, color: '#8b5cf6' }] } },
    }],
  }

  const orderColumns = [
    { title: '订单号', dataIndex: 'orderNo', width: 140 },
    { title: '店铺', dataIndex: 'shop', ellipsis: true },
    { title: '金额', dataIndex: 'amount' },
    { title: '状态', dataIndex: 'status', render: (s: string) => <Tag color={statusColors[s]} style={{ borderRadius: 10 }}>{s}</Tag> },
  ]

  const topProducts = [
    { name: '智能降噪蓝牙耳机', value: '¥ 45,200' },
    { name: '纯棉休闲短袖T恤', value: '¥ 28,400' },
    { name: '玻尿酸补水面膜', value: '¥ 19,800' },
    { name: '即食燕麦片', value: '¥ 12,600' },
    { name: '多功能厨房置物架', value: '¥ 8,900' },
    { name: '复古胶片相机', value: '¥ 6,500' },
  ]

  return (
    <div className="dashboard-modern">
      {/* KPI */}
      <Row gutter={[16, 16]}>
        {kpiList.map((kpi, idx) => (
          <Col key={idx} xs={24} sm={12} lg={8} xl={4}>
            <div className="db-kpi-card">
              <div className="kpi-icon" style={{ background: kpi.color }}>
                <i className={`bi ${kpi.icon}`}></i>
              </div>
              <div className="kpi-info">
                <div className="kpi-title">{kpi.title}</div>
                <div className="kpi-value">{kpi.value}</div>
                <div className={`kpi-trend ${kpi.up ? 'up' : 'down'}`}>
                  {kpi.up ? '▲' : '▼'} {kpi.trend}
                </div>
              </div>
            </div>
          </Col>
        ))}
      </Row>

      {/* 主图表区 */}
      <Row gutter={[16, 16]} className="db-section">
        <Col xs={24} lg={16}>
          <Card title="销售趋势（近7天）" className="db-card h-full">
            <EChart option={salesOption} style={{ height: '100%' }} />
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title="运营作战室" className="db-card h-full">
            <div className="db-mini-title">核心指标</div>
            <div className="db-list-item">
              <span className="db-list-label">流量转化率</span>
              <span className="db-list-value" style={{ color: '#22c55e' }}>{operations.conversionRate}</span>
            </div>
            <div className="db-list-item">
              <span className="db-list-label">客单价</span>
              <span className="db-list-value">{operations.avgOrderValue}</span>
            </div>
            <div className="db-list-item">
              <span className="db-list-label">退货率</span>
              <span className="db-list-value" style={{ color: '#ef4444' }}>{operations.returnRate}</span>
            </div>
            <div className="db-list-item">
              <span className="db-list-label">推广ROI</span>
              <span className="db-list-value" style={{ color: '#3b82f6' }}>{operations.roi}</span>
            </div>

            <div className="db-mini-title">目标完成度</div>
            <div className="db-progress-wrap">
              <div className="db-progress-header"><span>月度销售目标</span><span>86%</span></div>
              <div className="db-progress-bar"><div className="db-progress-inner" style={{ width: '86%' }} /></div>
            </div>
            <div className="db-progress-wrap">
              <div className="db-progress-header"><span>库存周转目标</span><span>72%</span></div>
              <div className="db-progress-bar"><div className="db-progress-inner" style={{ width: '72%' }} /></div>
            </div>
            <div className="db-progress-wrap">
              <div className="db-progress-header"><span>利润目标</span><span>64%</span></div>
              <div className="db-progress-bar"><div className="db-progress-inner" style={{ width: '64%' }} /></div>
            </div>
            <div className="db-progress-wrap">
              <div className="db-progress-header"><span>客户满意度</span><span>92%</span></div>
              <div className="db-progress-bar"><div className="db-progress-inner" style={{ width: '92%', background: 'linear-gradient(90deg,#34d399,#10b981)' }} /></div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* 第二排 */}
      <Row gutter={[16, 16]} className="db-section">
        <Col xs={24} md={12} lg={8}>
          <Card title="品类销售占比" className="db-card h-full">
            <EChart option={pieOption} style={{ height: '100%' }} />
          </Card>
        </Col>
        <Col xs={24} md={12} lg={8}>
          <Card title="今日实时走势" className="db-card h-full">
            <EChart option={realtimeOption} style={{ height: '100%' }} />
          </Card>
        </Col>
        <Col xs={24} md={24} lg={8}>
          <Card title="仓库库存分布" className="db-card h-full">
            <EChart option={barOption} style={{ height: 160 }} />
            <div className="db-mini-title">待办事项</div>
            <List
              size="small"
              dataSource={todo}
              renderItem={(item: any) => (
                <List.Item
                  className="px-0"
                  actions={[<Button type="link" size="small" onClick={() => navigate(item.link)}>去处理</Button>]}
                >
                  <List.Item.Meta
                    title={<span style={{ fontSize: 13 }}>{item.title}</span>}
                    description={<span style={{ fontSize: 12, color: '#64748b' }}>{item.count} 项待处理</span>}
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>

      {/* 底部 */}
      <Row gutter={[16, 16]} className="db-section">
        <Col xs={24} lg={12}>
          <Card title="实时订单流" extra={<Button type="link" onClick={() => navigate('/order')}>查看全部</Button>} className="db-card h-full">
            <Table columns={orderColumns} dataSource={latestOrders} pagination={false} size="small" />
          </Card>
        </Col>
        <Col xs={24} lg={6}>
          <Card title="利润结构" className="db-card h-full">
            <EChart option={profitOption} style={{ height: '100%' }} />
          </Card>
        </Col>
        <Col xs={24} lg={6}>
          <Card title="TOP 热销商品" className="db-card h-full">
            {topProducts.map((p, i) => (
              <div key={i} className="db-rank-item">
                <div className={`rank-num ${i < 3 ? 'top' : ''}`}>{i + 1}</div>
                <div className="rank-name">{p.name}</div>
                <div className="rank-value">{p.value}</div>
              </div>
            ))}
          </Card>
        </Col>
      </Row>
    </div>
  )
}
