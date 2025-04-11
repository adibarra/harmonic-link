// import { NextResponse } from 'next/server';
// import { createClient } from '@/utils/supabase/server';

// export async function GET(request: Request) {
//   const { searchParams } = new URL(request.url);
//   const code = searchParams.get('code');
//   const next = searchParams.get('next') ?? '/';

//   if (code) {
//     const supabase = await createClient();
//     const { error } = await supabase.auth.exchangeCodeForSession(code);

//     if (!error) {
//       const isLocalEnv = process.env.NODE_ENV === 'development';
//       const forwardedHost = request.headers.get('x-forwarded-host');

//       const redirectBase = isLocalEnv
//         ? 'http://localhost:3000/'
//         : forwardedHost
//         ? `http://${forwardedHost}`
//         : new URL(request.url).origin;

//       return NextResponse.redirect(`${redirectBase}${next}`);
//     }
//   }

//   // fallback to error page with forced HTTP in dev
//   const isLocalEnv = process.env.NODE_ENV === 'development';
//   const fallbackOrigin = isLocalEnv
//     ? 'http://localhost:3000/'
//     : new URL(request.url).origin;

//   return NextResponse.redirect(`${fallbackOrigin}/auth/auth-code-error`);
// }

import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/'

if (code) {
  const supabase = await createClient()
  const { error } = await supabase.auth.exchangeCodeForSession(code)

  if (!error) {

  const isLocalEnv = process.env.NODE_ENV === 'development'
const forwardedHost = request.headers.get('x-forwarded-host')


const redirectBase = isLocalEnv
? 'http://localhost:3000/'
: forwardedHost
? `http://${forwardedHost}`
: new URL(request.url).origin
console.log('🚀 Redirecting to:', `${redirectBase}${next}`)
return NextResponse.redirect(`${redirectBase}${next}`)
}
}

const isLocalEnv = process.env.NODE_ENV === 'development'
const fallbackOrigin = isLocalEnv ? 'http://localhost:3000/' : new URL(request.url).origin
return NextResponse.redirect(`${fallbackOrigin}/auth/auth-code-error`)
}
