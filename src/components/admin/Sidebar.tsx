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
} from "lucide-react"

interface NavItem {
  href: string
  label: string
  icon: LucideIcon
}

const navItems: NavItem[] = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/galeria", label: "Galeria", icon: Image },
  { href: "/admin/eventos", label: "Eventos", icon: Calendar },
  { href: "/admin/horarios", label: "Horarios", icon: Clock },
  { href: "/admin/configuracion", label: "Configuracion", icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()
  const { sidebarOpen, closeSidebar } = useAdmin()

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
        className={`
          fixed inset-y-0 left-0 z-30 w-64 transform bg-foreground text-white
          transition-transform duration-300 ease-in-out
          lg:static lg:translate-x-0
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="p-6">
            <Link href="/admin" className="block" onClick={closeSidebar}>
              <h1 className="text-xl font-bold text-amber">
                Iglesia Admin
              </h1>
              <p className="text-sm text-white/60">Panel de Administracion</p>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="mt-6 flex-1">
            {navItems.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== "/admin" && pathname.startsWith(item.href))
              const Icon = item.icon

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={closeSidebar}
                  className={`
                    flex items-center gap-3 px-6 py-3 text-sm transition-colors
                    ${
                      isActive
                        ? "bg-amber text-white"
                        : "text-white/70 hover:bg-white/10 hover:text-white"
                    }
                  `}
                >
                  <Icon className="size-5" />
                  {item.label}
                </Link>
              )
            })}
          </nav>

          {/* Back to site */}
          <div className="p-4">
            <Link
              href="/"
              className="block rounded-lg bg-white/10 px-4 py-2 text-center text-sm text-white/80 transition-colors hover:bg-white/20"
            >
              Volver al sitio
            </Link>
          </div>
        </div>
      </aside>
    </>
  )
}
