import { cookies } from "next/headers";

async function checkAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value;
  return token === process.env.ADMIN_PASS;
}

async function loginAction(formData: FormData) {
  "use server";
  const { cookies: serverCookies } = await import("next/headers");
  const { redirect } = await import("next/navigation");
  const password = formData.get("password") as string;

  if (password === process.env.ADMIN_PASS) {
    const cookieStore = await serverCookies();
    cookieStore.set("admin_token", password, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });
    redirect("/admin");
  }
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const authenticated = await checkAuth();

  if (!authenticated) {
    return (
      <html lang="it">
        <body>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              minHeight: "100vh",
              background: "#f5f5f5",
              fontFamily: "system-ui, sans-serif",
            }}
          >
            <div
              style={{
                background: "#fff",
                padding: "2rem",
                borderRadius: "8px",
                boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                width: "100%",
                maxWidth: "360px",
              }}
            >
              <h1
                style={{
                  fontSize: "1.25rem",
                  fontWeight: "bold",
                  marginBottom: "1rem",
                  textAlign: "center",
                }}
              >
                Admin Login
              </h1>
              <form action={loginAction}>
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  required
                  style={{
                    width: "100%",
                    padding: "0.5rem 0.75rem",
                    border: "1px solid #ddd",
                    borderRadius: "4px",
                    fontSize: "0.875rem",
                    marginBottom: "0.75rem",
                    boxSizing: "border-box",
                  }}
                />
                <button
                  type="submit"
                  style={{
                    width: "100%",
                    padding: "0.5rem",
                    background: "#1E3560",
                    color: "#fff",
                    border: "none",
                    borderRadius: "4px",
                    fontSize: "0.875rem",
                    fontWeight: "600",
                    cursor: "pointer",
                  }}
                >
                  Accedi
                </button>
              </form>
            </div>
          </div>
        </body>
      </html>
    );
  }

  return <>{children}</>;
}
