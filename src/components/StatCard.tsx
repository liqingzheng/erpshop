import { Card, Statistic } from 'antd'

interface StatCardProps {
  title: string
  value: number | string
  prefix?: React.ReactNode
  suffix?: string
  color?: string
  iconClass?: string
}

export default function StatCard({ title, value, prefix, suffix, color = '#1677ff', iconClass }: StatCardProps) {
  return (
    <Card bordered={false} className="shadow-sm">
      <div className="flex items-center gap-4">
        {iconClass && (
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center text-white text-xl"
            style={{ background: color }}
          >
            <i className={iconClass}></i>
          </div>
        )}
        <Statistic title={title} value={value} prefix={prefix} suffix={suffix} />
      </div>
    </Card>
  )
}
