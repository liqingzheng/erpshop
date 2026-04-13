import ErrorPage from './index'

export default function NotFound() {
  return (
    <ErrorPage
      code="404"
      title="页面走失了"
      desc="您访问的页面似乎不存在，或者已经被转移到其他星系。"
    />
  )
}
