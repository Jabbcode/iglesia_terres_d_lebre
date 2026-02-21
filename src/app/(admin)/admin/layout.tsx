"use client"

import { AdminProvider } from "@/components/admin/AdminContext"
import { ConfirmDialogProvider } from "@/components/admin/confirm-dialog"
import { Sidebar } from "@/components/admin/Sidebar"
import { Header } from "@/components/admin/Header"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AdminProvider>
      <ConfirmDialogProvider>
        <div className="bg-cream flex min-h-screen">
          <Sidebar />
          <div className="flex flex-1 flex-col">
            <Header />
            <main className="flex-1 p-4 lg:p-6">{children}</main>
          </div>
        </div>
      </ConfirmDialogProvider>
    </AdminProvider>
  )
}
