import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export function CtaNew() {
  return (
    <aside
      id="nuevos"
      aria-label="Llamada a la acción para nuevos visitantes"
      className="pb-16"
    >
      <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
        <Button
          asChild
          className="bg-amber shadow-amber/25 hover:bg-amber-dark hover:shadow-amber/30 h-14 rounded-full px-10 text-sm font-bold tracking-wider text-white shadow-lg hover:shadow-xl"
          size={"lg"}
        >
          <Link href="/creencias" className="gap-3">
            Conócenos un poco más
            <ChevronRight className="size-4" aria-hidden="true" />
          </Link>
        </Button>
      </div>
    </aside>
  )
}
