"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAdmin } from "./AdminContext"
import {
  LayoutDashboard,
  Settings,
  Image,
  Calendar,
  Clock,
  LucideIcon,
  MessageCircle,
  Users,
  ExternalLink,
} from "lucide-react"

interface NavItem {
  href: string
  label: string
  icon: LucideIcon
}

const navItems: NavItem[] = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/galeria", label: "Galeria", icon: Image },
  { href: "/admin/horarios", label: "Horarios", icon: Clock },
  { href: "/admin/eventos", label: "Eventos", icon: Calendar },
  { href: "/admin/testimonios", label: "Testimonios", icon: MessageCircle },
  { href: "/admin/configuracion", label: "Configuracion", icon: Settings },
]

const adminOnlyItems: NavItem[] = [
  { href: "/admin/usuarios", label: "Usuarios", icon: Users },
]

export function Sidebar() {
  const pathname = usePathname()
  const { sidebarOpen, closeSidebar, collapsed, role } = useAdmin()
  const visibleItems = [
    ...navItems,
    ...(role === "ADMIN" ? adminOnlyItems : []),
  ]

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/50 lg:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`bg-foreground fixed inset-y-0 left-0 z-30 w-64 transform text-white transition-all duration-300 ease-in-out lg:static lg:translate-x-0 ${
          collapsed ? "lg:w-16" : "lg:w-64"
        } ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div
            className={`flex h-16 items-center ${collapsed ? "justify-center px-2" : "px-6"}`}
          >
            <Link
              href="/admin"
              onClick={closeSidebar}
              title={collapsed ? "Dashboard" : undefined}
              className="flex items-center gap-2 overflow-hidden"
            >
              <span className="text-amber text-xl font-bold leading-none shrink-0">
                I
              </span>
              {!collapsed && (
                <div>
                  <p className="text-amber text-sm font-bold leading-tight">
                    Iglesia Admin
                  </p>
                  <p className="text-xs text-white/60 leading-tight">
                    Panel de Administracion
                  </p>
                </div>
              )}
            </Link>
          </div>

          {/* Navigation */}
          <nav className="mt-2 flex-1">
            {visibleItems.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== "/admin" && pathname.startsWith(item.href))
              const Icon = item.icon

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={closeSidebar}
                  title={collapsed ? item.label : undefined}
                  className={`flex items-center py-3 text-sm transition-colors ${
                    collapsed ? "justify-center px-0" : "gap-3 px-6"
                  } ${
                    isActive
                      ? "bg-amber text-white"
                      : "text-white/70 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <Icon className="size-5 shrink-0" />
                  {!collapsed && item.label}
                </Link>
              )
            })}
          </nav>

          {/* Back to site */}
          <div className={`p-3 ${collapsed ? "flex justify-center" : ""}`}>
            <Link
              href="/"
              title={collapsed ? "Volver al sitio" : undefined}
              className={`flex items-center rounded-lg bg-white/10 text-sm text-white/80 transition-colors hover:bg-white/20 ${
                collapsed ? "p-2 justify-center" : "gap-2 px-4 py-2"
              }`}
            >
              <ExternalLink className="size-4 shrink-0" />
              {!collapsed && "Volver al sitio"}
            </Link>
          </div>
        </div>
      </aside>
    </>
  )
}
