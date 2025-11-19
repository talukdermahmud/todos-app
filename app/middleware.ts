import { withAuth } from "next-auth/middleware";

export default withAuth(
  function middleware(req) {
    // If not authorized, next-auth will handle redirect
    // Optionally, you can add custom logic here
    console.log(
      "Middleware authorized callback, token:",
      !!req.nextauth?.token
    );
  },
  {
    callbacks: {
      authorized: ({ token }) => {
        console.log("Authorized callback, token:", !!token);
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: ["/dashboard", "/profile", "/todos", "/password-change"], // Protect these specific paths
};
