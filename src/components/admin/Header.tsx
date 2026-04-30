"use client"

import { useRouter } from "next/navigation"
import { useAdmin } from "./AdminContext"
import { Menu, LogOut, PanelLeftClose, PanelLeftOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { api } from "@/shared/api"

export function Header() {
  const router = useRouter()
  const { toggleSidebar, collapsed, toggleCollapsed } = useAdmin()

  const handleLogout = async () => {
    await api.post("/api/auth/logout", {})
    router.push("/login")
    router.refresh()
  }

  return (
    <header className="border-border/50 sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-white px-4 lg:px-6">
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

      {/* Desktop collapse toggle */}
      <Button
        variant="ghost"
        size="icon"
        className="hidden lg:flex"
        onClick={toggleCollapsed}
        title={collapsed ? "Expandir menu" : "Colapsar menu"}
      >
        {collapsed ? (
          <PanelLeftOpen className="size-5" />
        ) : (
          <PanelLeftClose className="size-5" />
        )}
      </Button>

      {/* Logout button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={handleLogout}
        className="text-muted-foreground hover:text-foreground gap-2"
      >
        <LogOut className="size-4" />
        <span className="hidden sm:inline">Cerrar sesion</span>
      </Button>
    </header>
  )
}
