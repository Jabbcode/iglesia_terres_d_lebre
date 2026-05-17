import {
  BookOpen,
  Triangle,
  Users,
  Church,
  Cross,
  Flame,
  Gift,
  Sunset,
  Wine,
  Heart,
  CloudSun,
  type LucideIcon,
  HeartHandshake,
} from "lucide-react"

export interface Creencia {
  id: string
  icon: LucideIcon
  title: string
  subtitle?: string
  shortDescription: string
  longDescription: string
  image: string
  imageAlt: string
  mostrarDetalle: boolean
}

export const creenciasBase: Creencia[] = [
  {
    id: "biblia",
    icon: BookOpen,
    title: "La Biblia",
    subtitle: "Nuestra base",
    shortDescription: "Nuestra base",
    longDescription:
      "Creemos que la Biblia es el mensaje de Dios para la humanidad. Tanto el Antiguo como el Nuevo Testamento fueron inspirados por Él y no contienen errores en sus escritos originales. Es la revelación completa de Su voluntad para salvarnos y la autoridad final que guía nuestra vida, nuestra fe y nuestra conducta. Por eso, creemos que su mensaje está cerrado: no se le puede quitar ni añadir nada.",
    image:
      "https://nngrjxgeovdvnawvfrmj.supabase.co/storage/v1/object/public/images/creencias/biblia.jpeg",
    imageAlt: "Biblia abierta",
    mostrarDetalle: true,
  },
  {
    id: "trinidad",
    icon: Triangle,
    title: "Dios",
    subtitle: "Uno en tres personas",
    shortDescription: "Padre, Hijo y Espíritu Santo",
    longDescription:
      "Creemos en un solo Dios eterno que existe en tres personas: el Padre, el Hijo y el Espíritu Santo. Aunque son tres, son un solo Dios con la misma naturaleza, los mismos atributos y la misma perfección. Por lo tanto, los tres merecen el mismo respeto, confianza y obediencia de nuestra parte.",
    image:
      "https://nngrjxgeovdvnawvfrmj.supabase.co/storage/v1/object/public/images/creencias/dios.jpg",
    imageAlt: "Luz divina",
    mostrarDetalle: true,
  },
  {
    id: "jesucristo",
    icon: Cross,
    title: "Jesucristo",
    subtitle: "Dios hecho hombre",
    shortDescription: "Plenamente Dios y hombre",
    longDescription:
      "Creemos que Jesucristo es plenamente Dios y plenamente hombre a la vez. Él ya existía desde siempre como Dios, pero se hizo hombre al ser concebido por el Espíritu Santo y nacer de una virgen, sin dejar de ser divino. Murió en la cruz como el sacrificio perfecto en nuestro lugar, resucitó al tercer día y ascendió al cielo. Hoy, desde allí, actúa como nuestro defensor y representante ante Dios mientras esperamos Su regreso.",
    image:
      "https://nngrjxgeovdvnawvfrmj.supabase.co/storage/v1/object/public/images/creencias/jesus.jpg",
    imageAlt: "Cruz al atardecer",
    mostrarDetalle: true,
  },
  {
    id: "espiritu-santo",
    icon: Flame,
    title: "El Espíritu Santo",
    subtitle: "Nuestra guía",
    shortDescription: "Mora en los creyentes",
    longDescription:
      "Creemos que el Espíritu Santo es la tercera persona de la Trinidad. Su labor es darle la gloria a Jesús y ayudar a las personas a reconocer su pecado y su necesidad de Dios. Cuando alguien confía en Jesús, el Espíritu lo transforma y lo une a la Iglesia en ese mismo instante. Además, vive en el creyente para guiarlo, enseñarle y darle las fuerzas para vivir una vida que agrade a Dios.",
    image:
      "https://nngrjxgeovdvnawvfrmj.supabase.co/storage/v1/object/public/images/creencias/espiritu_santo.jpg",
    imageAlt: "Luz y espiritualidad",
    mostrarDetalle: true,
  },
  {
    id: "salvacion",
    icon: Gift,
    title: "La Salvación",
    subtitle: "Un regalo eterno",
    shortDescription: "Por gracia mediante la fe",
    longDescription:
      "Creemos que cuando alguien confía en el Señor Jesucristo y en Su obra, pasa de inmediato de la muerte espiritual a la vida. En ese momento, Dios lo acepta y lo declara <em><strong>justo</strong></em>, tal como acepta a Jesús mismo. Esta unión con Cristo es para siempre. Somos salvos únicamente por Su sacrificio en la cruz. Al creer, somos <em><strong>nacidos de nuevo</strong></em> y sellados por el Espíritu Santo, confiando en que Dios siempre cumple Sus promesas.",
    image:
      "https://nngrjxgeovdvnawvfrmj.supabase.co/storage/v1/object/public/images/creencias/salvacion.jpg",
    imageAlt: "Luz de esperanza",
    mostrarDetalle: true,
  },
  {
    id: "humanidad",
    icon: Users,
    title: "El Ser Humano",
    subtitle: "Nuestra condición",
    shortDescription: "Creado a imagen de Dios",
    longDescription:
      "Creemos que fuimos creados a imagen de Dios, pero el pecado nos separó de Él. Como resultado, la humanidad perdió su conexión espiritual con Dios y quedó bajo una <em><strong>depravación total</strong></em>, lo que significa que estamos espiritualmente incapacitados para salvarnos por nosotros mismos. Esta condición se transmite a toda la raza humana, siendo Jesucristo la única excepción.",
    image:
      "https://nngrjxgeovdvnawvfrmj.supabase.co/storage/v1/object/public/images/creencias/ser_humano.jpg",
    imageAlt: "Comunidad de personas",
    mostrarDetalle: true,
  },
  {
    id: "regreso-cristo",
    icon: Sunset,
    title: "El Regreso de Cristo",
    subtitle: "Nuestra esperanza",
    shortDescription: "Segunda venida de Cristo",
    longDescription:
      "Creemos que después de un tiempo de gran dificultad en el mundo (la gran tribulación), el Señor Jesucristo regresará de forma física y personal. Vendrá con todo Su poder y gloria para establecer Su reino de mil años (el Milenio), derrotar el mal, restaurar la Creación de su actual sufrimiento, cumplir Sus promesas con Israel y ser reconocido por todo el mundo como Dios.",
    image:
      "https://nngrjxgeovdvnawvfrmj.supabase.co/storage/v1/object/public/images/creencias/regreso_cristo.jpg",
    imageAlt: "Regreso de Cristo",
    mostrarDetalle: true,
  },
  {
    id: "resurreccion",
    icon: CloudSun,
    title: "La Resurrección",
    subtitle: "El futuro eterno",
    shortDescription: "El futuro eterno",
    longDescription:
      "Creemos que todas las personas que han muerto volverán a vivir físicamente. Quienes confiaron en Dios resucitarán para vivir en una alegría eterna junto a Él. Por otro lado, quienes rechazaron Su amor resucitarán para enfrentar un juicio y una separación consciente y eterna de Dios.",
    image:
      "https://nngrjxgeovdvnawvfrmj.supabase.co/storage/v1/object/public/images/creencias/resureccion.jpg",
    imageAlt: "Resurrección de los muertos",
    mostrarDetalle: true,
  },
  {
    id: "iglesia",
    icon: Church,
    title: "La Iglesia",
    subtitle: "Una familia unida",
    shortDescription: "El cuerpo de Cristo",
    longDescription:
      "Creemos que la Iglesia no es un lugar, sino la unión de todas las personas que han sido transformadas por el Espíritu Santo mediante la fe. En el momento en que alguien recibe a Cristo en su corazón, pasa a formar parte de esta gran familia espiritual que llamamos la 'iglesia universal'.",
    image:
      "https://nngrjxgeovdvnawvfrmj.supabase.co/storage/v1/object/public/images/creencias/iglesia.png",
    imageAlt: "Iglesia reunida",
    mostrarDetalle: true,
  },
  {
    id: "bautismo-santa-cena",
    icon: Wine,
    title: "El Bautismo",
    subtitle: "y la Santa Cena",
    shortDescription: "Bautismo y Santa Cena",
    longDescription:
      "Creemos que Jesús nos dejó dos ceremonias especiales: el Bautismo en agua y la Santa Cena. Queremos ser claros: participar en ellas no nos salva, pero son medios muy importantes para dar testimonio público de nuestra fe y recordar el sacrificio de Jesús por nosotros.",
    image:
      "https://nngrjxgeovdvnawvfrmj.supabase.co/storage/v1/object/public/images/creencias/bautismo.jpeg",
    imageAlt: "Bautismo y Santa Cena",
    mostrarDetalle: true,
  },
  {
    id: "matrimonio",
    icon: HeartHandshake,
    title: "El Matrimonio",
    subtitle: "El diseño de Dios",
    shortDescription: "El diseño de Dios",
    longDescription:
      "Creemos que el matrimonio es una institución sagrada creada por Dios desde el principio. Según lo que Él demanda en la Biblia, el matrimonio es la unión exclusiva y fiel entre un hombre y una mujer. Este diseño divino tiene como propósito reflejar el amor de Cristo por Su Iglesia, proporcionar compañía mutua y ser la base para la familia.",
    image:
      "https://nngrjxgeovdvnawvfrmj.supabase.co/storage/v1/object/public/images/creencias/matrimonio_3.jpeg",
    imageAlt: "Matrimonio cristiano",
    mostrarDetalle: true,
  },
  {
    id: "estilo-vida-cristiana",
    icon: Heart,
    title: "Una vida santa",
    subtitle: "El estilo de vida cristiano",
    shortDescription: "El Estilo de Vida Cristiano",
    longDescription:
      "Creemos que hemos sido llamados a vivir de una manera santa, guiados por el Espíritu de Dios y no por nuestros impulsos egoístas. Aunque mientras estemos en este mundo seguiremos luchando con nuestra naturaleza humana (la carne), nuestra meta es someter cada área de nuestra vida al control de Cristo con la ayuda del Espíritu Santo.",
    image:
      "https://nngrjxgeovdvnawvfrmj.supabase.co/storage/v1/object/public/images/creencias/vida_santa.jpg",
    imageAlt: "Vida cristiana",
    mostrarDetalle: true,
  },
]
