import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const { password } = await request.json()

  // Debug logging (remove in production after fixing)
  console.log('Login attempt:', {
    providedPassword: password,
    envPassword: process.env.DASHBOARD_PASSWORD,
    match: password === process.env.DASHBOARD_PASSWORD,
  })

  if (password === process.env.DASHBOARD_PASSWORD) {
    const response = NextResponse.json({ success: true })
    response.cookies.set('dashboard_password', password, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 días
    })
    return response
  }

  return NextResponse.json({
    error: 'Invalid password',
    debug: process.env.NODE_ENV === 'development' ? {
      provided: password,
      expected: process.env.DASHBOARD_PASSWORD
    } : undefined
  }, { status: 401 })
}
