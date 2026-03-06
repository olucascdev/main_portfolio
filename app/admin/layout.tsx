import { redirect } from "next/navigation"
import { isAdminAuthenticated } from "@/lib/auth"
import { AdminSidebar } from "./components/AdminSidebar"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const auth = await isAdminAuthenticated()

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex">
      {auth ? (
        <>
          <AdminSidebar />
          <main className="flex-1 ml-0 md:ml-64 min-h-screen overflow-auto">
            <div className="p-6 md:p-10 max-w-4xl">
              {children}
            </div>
          </main>
        </>
      ) : (
        <main className="flex-1">{children}</main>
      )}
    </div>
  )
}
