import { useNavigate } from 'react-router-dom'
import './error.scss'

interface ErrorPageProps {
  code: string
  title: string
  desc: string
}

export default function ErrorPage({ code, title, desc }: ErrorPageProps) {
  const navigate = useNavigate()

  return (
    <div className="error-page">
      <div className="scanline" />
      <div className="shape shape-1" />
      <div className="shape shape-2" />
      <div className="shape shape-3" />
      <div className="shape shape-4" />

      <div className="error-content">
        <div className="glitch">{code}</div>
        <div className="error-title">{title}</div>
        <div className="error-desc">{desc}</div>
        <button className="neon-btn" onClick={() => navigate(-1)}>
          返回上一页
        </button>
        <button className="neon-btn" style={{ marginLeft: 16, borderColor: '#ff00cc', color: '#ff00cc' }} onClick={() => navigate('/')}>
          回到首页
        </button>
      </div>
    </div>
  )
}
