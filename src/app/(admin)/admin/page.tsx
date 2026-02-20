export default function AdminDashboard() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="mt-1 text-muted-foreground">
          Bienvenido al panel de administracion
        </p>
      </div>

      <div className="rounded-xl border border-border/50 bg-white p-6 shadow-sm">
        <p className="text-muted-foreground">
          Las estadisticas estaran disponibles proximamente.
        </p>
      </div>
    </div>
  )
}
