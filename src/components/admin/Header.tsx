"use client"

import { useRouter } from "next/navigation"
import { useAdmin } from "./AdminContext"
import { Menu, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Header() {
  const router = useRouter()
  const { toggleSidebar } = useAdmin()

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" })
    router.push("/admin/login")
    router.refresh()
  }

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-border/50 bg-white px-4 lg:px-6">
      {/* Mobile hamburger */}
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden"
        onClick={toggleSidebar}
      >
        <Menu className="size-6" />
        <span className="sr-only">Abrir menu</span>
      </Button>

      {/* Spacer for desktop */}
      <div className="hidden lg:block" />

      {/* Logout button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={handleLogout}
        className="gap-2 text-muted-foreground hover:text-foreground"
      >
        <LogOut className="size-4" />
        <span className="hidden sm:inline">Cerrar sesion</span>
      </Button>
    </header>
  )
}
