import type { NextPageContext } from 'next'

interface ErrorProps {
  statusCode: number
}

export default function ErrorPage({ statusCode }: ErrorProps) {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#0A0A14',
        color: '#8A8595',
        fontFamily: 'system-ui, sans-serif',
        fontSize: '0.875rem',
      }}
    >
      {statusCode
        ? `오류가 발생했습니다 (${statusCode})`
        : '오류가 발생했습니다.'}
    </div>
  )
}

ErrorPage.getInitialProps = ({ res, err }: NextPageContext) => {
  const statusCode = res?.statusCode ?? err?.statusCode ?? 404
  return { statusCode }
}
