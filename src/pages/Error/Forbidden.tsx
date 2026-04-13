import ErrorPage from './index'

export default function Forbidden() {
  return (
    <ErrorPage
      code="403"
      title="禁止访问"
      desc="您没有权限进入这片区域，请联系管理员获取通行证。"
    />
  )
}
