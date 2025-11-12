// middleware.ts (最终、最简、最稳定版)
import { NextResponse, type NextRequest } from "next/server";
import { verifyJwt } from "@/src/utils/jwt";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("token")?.value;

  // 1. 定义所有人都能访问的公开路径
  const publicPaths = ["/auth/signin", "/api/auth/login", "/api/auth/register"];

  // 2. 如果访问的是公开路径，直接放行
  if (publicPaths.some(path => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // 3. 所有其他路径都是受保护的，现在检查 Token
  if (token) {
    try {
      // 直接验证 Token。如果无效或过期，这里会抛出错误
      verifyJwt(token);
      // 如果代码能走到这里，说明 Token 有效，放行
      return NextResponse.next();
    } catch (error) {
      // Token 无效（比如过期了），会进入 catch 块
      // 我们不用做任何事，让它继续往下走到最后的重定向逻辑
      if (error instanceof Error) {
        console.error("Invalid token, redirecting to login:", error.message);
      } else {
        console.error("Invalid token, redirecting to login:", error);
      }    
    }
  }
  
  // 4. 如果代码走到了这里，说明：
  //    - 根本没有 Token
  //    - 或者 Token 验证失败了
  // 无论哪种情况，都重定向到登录页
  const loginUrl = new URL("/auth/signin", request.url);
  loginUrl.searchParams.set("callbackUrl", pathname);
  const response = NextResponse.redirect(loginUrl);
  // 清除可能存在的无效cookie
  response.cookies.delete("token");
  return response;
}

export const config = {
  // 排除所有静态资源和图片等，只对页面和 API 进行检查
  matcher: ["/((?!_next/static|_next/image|favicon.ico|background.png).*)"],
};

export const runtime = 'nodejs';
