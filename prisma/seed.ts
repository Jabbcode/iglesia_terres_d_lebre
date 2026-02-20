import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  console.log("Seeding database...")

  // Create admin user
  const hashedPassword = await bcrypt.hash("admin123", 12)
  const admin = await prisma.user.upsert({
    where: { email: "admin@iglesia.es" },
    update: {},
    create: {
      email: "admin@iglesia.es",
      password: hashedPassword,
      name: "Administrador",
      role: "ADMIN",
    },
  })
  console.log("Created admin user:", admin.email)

  // Create site config
  const config = await prisma.configSitio.upsert({
    where: { id: "default" },
    update: {},
    create: {
      id: "default",
      nombreIglesia: "Iglesia Biblica Terres de l'Ebre",
      descripcion: "Somos una familia de fe en Terres de l'Ebre. Un lugar donde cada persona es bienvenida tal como es.",
      instagram: "https://instagram.com/iglesiabiblica",
      facebook: "https://facebook.com/iglesiabiblica",
      youtube: "https://youtube.com/@iglesiabiblica",
      direccion: "Calle Ejemplo 123\nTortosa, Tarragona 43500",
      telefono: "+34 600 000 000",
      email: "info@iglesiabiblica.es",
      horarioAtencion: "Lun-Vie, 9:00-17:00",
      googleMapsUrl: "https://maps.google.com/?q=Tortosa",
      googleMapsEmbed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2987.123456789!2d0.5216!3d40.8125",
    },
  })
  console.log("Created site config")

  // Create horarios
  const horarios = [
    { titulo: "Culto de Adoracion", dia: "Domingos", hora: "11:00h", icono: "Church", order: 1 },
    { titulo: "Reunion de Oracion", dia: "Miercoles", hora: "20:00h", icono: "HeartHandshake", order: 2 },
    { titulo: "Reunion de Jovenes", dia: "Sabados", hora: "18:00h", icono: "Users", order: 3 },
    { titulo: "Estudio Biblico", dia: "Miercoles", hora: "20:00h", icono: "BookOpen", order: 4 },
    { titulo: "Escuela Dominical", dia: "Domingos", hora: "11:00h", icono: "Smile", order: 5 },
  ]

  for (const h of horarios) {
    await prisma.horario.upsert({
      where: { id: h.titulo.toLowerCase().replace(/\s/g, "-") },
      update: {},
      create: {
        id: h.titulo.toLowerCase().replace(/\s/g, "-"),
        ...h,
      },
    })
  }
  console.log("Created", horarios.length, "horarios")

  // Create sample images
  const imagenes = [
    { src: "https://images.unsplash.com/photo-1438232992991-995b7058bbb3?q=80&w=800", alt: "Interior de la iglesia", span: "tall" as const },
    { src: "https://images.unsplash.com/photo-1504052434569-70ad5836ab65?q=80&w=800", alt: "Biblia abierta", span: "normal" as const },
    { src: "https://images.unsplash.com/photo-1507692049790-de58290a4334?q=80&w=800", alt: "Momento de oracion", span: "normal" as const },
    { src: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=800", alt: "Grupo de vida reunido", span: "wide" as const },
    { src: "https://images.unsplash.com/photo-1511895426328-dc8714191300?q=80&w=800", alt: "Familias en comunidad", span: "tall" as const },
    { src: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?q=80&w=800", alt: "Servicio comunitario", span: "normal" as const },
  ]

  for (let i = 0; i < imagenes.length; i++) {
    await prisma.imagen.create({
      data: {
        ...imagenes[i],
        order: i,
      },
    })
  }
  console.log("Created", imagenes.length, "images")

  // Create sample events
  const now = new Date()
  const nextSaturday = new Date(now)
  nextSaturday.setDate(now.getDate() + ((6 - now.getDay() + 7) % 7 || 7))

  const nextFriday = new Date(now)
  nextFriday.setDate(now.getDate() + ((5 - now.getDay() + 7) % 7 || 7))

  const eventos = [
    {
      nombre: "Retiro de Jovenes",
      descripcion: "Un fin de semana de comunion, alabanza y crecimiento espiritual para jovenes de 15 a 25 anos.",
      fecha: nextSaturday,
      horaInicio: "18:00",
      ubicacion: "Centro de Retiros Montcaro",
    },
    {
      nombre: "Cena de Comunidad",
      descripcion: "Ven a compartir una cena especial con toda la familia de la iglesia.",
      fecha: nextFriday,
      horaInicio: "20:00",
      ubicacion: "Salon principal de la iglesia",
    },
  ]

  for (const e of eventos) {
    await prisma.evento.create({ data: e })
  }
  console.log("Created", eventos.length, "events")

  console.log("Seeding completed!")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
