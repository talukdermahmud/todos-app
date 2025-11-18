import { withAuth } from "next-auth/middleware";

export default withAuth(
  function middleware(req) {
    // If not authorized, next-auth will handle redirect
    // Optionally, you can add custom logic here
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: ["/dashboard", "/profile", "/todos", "/password-change"], // Protect these specific paths
};
