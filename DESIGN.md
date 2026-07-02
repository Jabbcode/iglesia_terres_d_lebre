---
name: Iglesia Bíblica Terres de l'Ebre
description: Sitio de una comunidad cristiana en Tortosa — cálido, contemporáneo, accesible para toda edad
colors:
  warm-amber: "#e8913a"
  amber-dark: "#d07a2b"
  soft-cream: "#faf7f2"
  sage-green: "#f0f5f0"
  deep-ink: "#1a1a1a"
  warm-grey: "#54606e"
  pure-white: "#ffffff"
  border-mist: "#e5e7eb"
  destructive-red: "#ef4444"
typography:
  display:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "clamp(3rem, 6vw, 4.5rem)"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "normal"
  accent-serif:
    fontFamily: "Playfair Display, Georgia, serif"
    fontSize: "inherit"
    fontWeight: 400
    lineHeight: "inherit"
    letterSpacing: "normal"
  headline:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "clamp(1.875rem, 4vw, 2.25rem)"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "normal"
  title:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 700
    lineHeight: 1.3
    letterSpacing: "normal"
  body:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "normal"
  label:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "0.2em"
rounded:
  sm: "6px"
  md: "8px"
  lg: "10px"
  xl: "14px"
  2xl: "18px"
  full: "9999px"
spacing:
  section-y: "5rem"
  container-x: "1rem"
  gap-lg: "3rem"
components:
  button-primary:
    backgroundColor: "{colors.warm-amber}"
    textColor: "{colors.pure-white}"
    rounded: "{rounded.full}"
    padding: "12px 32px"
  button-primary-hover:
    backgroundColor: "{colors.amber-dark}"
    textColor: "{colors.pure-white}"
    rounded: "{rounded.full}"
    padding: "12px 32px"
  button-outline:
    backgroundColor: "transparent"
    textColor: "{colors.deep-ink}"
    rounded: "{rounded.md}"
    padding: "8px 16px"
  card:
    backgroundColor: "{colors.pure-white}"
    textColor: "{colors.deep-ink}"
    rounded: "{rounded.xl}"
    padding: "24px"
  input:
    backgroundColor: "transparent"
    textColor: "{colors.deep-ink}"
    rounded: "{rounded.md}"
    padding: "4px 12px"
  badge-label:
    backgroundColor: "transparent"
    textColor: "{colors.warm-amber}"
    rounded: "{rounded.sm}"
    padding: "0"
  icon-circle:
    backgroundColor: "{colors.warm-amber}"
    textColor: "{colors.warm-amber}"
    rounded: "{rounded.full}"
    size: "64px"
---

# Design System: Iglesia Bíblica Terres de l'Ebre

## 1. Overview

**Creative North Star: "La Bienvenida Cálida"**

El sistema traduce la hospitalidad de una comunidad real en interfaz: una base neutra
clara (crema, blanco, tinta) que deja respirar el contenido, y un único acento —el ámbar
cálido— reservado para lo que merece atención (llamadas a la acción, estado activo,
la palabra que da énfasis a un titular). El serif itálico (Playfair Display) aparece
solo como gesto puntual dentro de titulares en sans bold, nunca como voz tipográfica
completa: es la firma personal dentro de una composición por lo demás contemporánea.

Este sistema rechaza explícitamente la estética "iglesia antigua": nada de vitrales,
tipografía gótica/blackletter ni maquetación estática de sitios de los 2000. La calidez
se transmite por color y tono editorial, no por imaginería religiosa genérica ni
solemnidad visual.

**Key Characteristics:**
- Base neutra luminosa (crema/blanco/tinta) con un único acento saturado
- Un acento serif itálico por titular, nunca un párrafo completo
- Superficies planas por defecto; sombra reservada a fotografía enmarcada
- CTA principal en píldora (rounded-full), UI funcional en esquinas moderadas (rounded-md)

## 2. Colors

Paleta cálida y natural: pocos colores, uso deliberado, contraste alto para legibilidad
en todas las edades.

### Primary
- **Ámbar Cálido** (#e8913a): color de marca. CTAs principales, estado de navegación
  activo, iconografía de acento, la palabra de énfasis serif dentro de titulares.
- **Ámbar Oscuro** (#d07a2b): estado hover/pressed del ámbar cálido — nunca un color
  independiente, solo su variante de interacción.

### Neutral
- **Crema Suave** (#faf7f2): fondo de página y secciones de respiro (hero secundario,
  bloques de misión/valores). El fondo por defecto del sitio.
- **Blanco Puro** (#ffffff): fondo de cards, franjas de sección alternas, marcos de foto.
- **Verde Salvia** (#f0f5f0): tinte secundario/accent muy sutil, casi neutro — variación
  de fondo cuando crema y blanco ya se usaron en secciones adyacentes.
- **Tinta Profunda** (#1a1a1a): texto principal y titulares.
- **Gris Cálido** (#54606e): texto secundario/descripciones (`text-muted-foreground`).
- **Niebla** (#e5e7eb): bordes de cards, inputs y separadores de sección.

### Named Rules
**La Regla del Acento Único.** El ámbar es el único color saturado del sistema. Todo lo
demás es neutro (crema, blanco, tinta, gris). Se usa con moderación: CTA, estado activo,
iconos puntuales, la etiqueta en mayúsculas sobre un titular — nunca como fondo extenso
de sección.

**Excepción de contraste conocida.** #e8913a da ~2.58:1 sobre blanco/crema como texto o
relleno de botón — por debajo de WCAG AA 4.5:1. Es una decisión de marca deliberada
(preferencia visual sobre cumplimiento estricto); no "arreglar" oscureciéndolo sin
consultar primero, ya que rompería la identidad de color actual.

## 3. Typography

**Display Font:** Inter (con system-ui, sans-serif de respaldo)
**Accent Font:** Playfair Display italic (con Georgia, serif de respaldo)

**Character:** Sans bold como voz dominante — clara, contemporánea, legible a cualquier
edad — puntuada por una sola palabra en serif itálica ámbar por titular, como una firma
manuscrita dentro de un documento por lo demás moderno.

### Hierarchy
- **Display** (700, `clamp(3rem, 6vw, 4.5rem)`, line-height 1.1): titular de hero (h1),
  siempre en Inter bold sobre fondo oscuro o crema.
- **Accent** (400 italic, hereda tamaño del contexto): la palabra o frase corta de
  énfasis dentro de un Display/Headline, en Playfair Display itálica y color ámbar.
- **Headline** (700, `clamp(1.875rem, 4vw, 2.25rem)`, line-height 1.2): títulos de
  sección (h2).
- **Title** (700, 1.25rem, line-height 1.3): títulos de card/bloque (h3).
- **Body** (400, 1rem, line-height 1.6, color gris cálido): párrafos descriptivos,
  máximo ~70ch de ancho de línea.
- **Label** (700, 0.75rem, letter-spacing 0.2em, uppercase, color ámbar): etiquetas
  cortas sobre un bloque de contenido (badges de sección).

### Named Rules
**La Regla de la Palabra de Acento.** Exactamente una palabra o frase corta por titular
se convierte en Playfair Display itálica ámbar; el resto permanece en Inter bold. Nunca
un titular completo en serif.

## 4. Elevation

Sistema mayormente plano. Las secciones se separan por color de fondo (crema/blanco
alternos) o un borde superior sutil (`border-border`), no por sombra. La sombra existe
como acento puntual, no como lenguaje estructural de profundidad.

### Shadow Vocabulary
- **Card sutil** (`box-shadow: 0 1px 2px rgba(0,0,0,0.05)` — `shadow-sm`): cards de
  contenido (misión, valores, testimonios).
- **Foto protagonista** (`box-shadow: 0 20px 25px rgba(0,0,0,0.15)` — `shadow-xl`):
  marcos de fotografía e imágenes destacadas; la sombra da peso físico a la foto, no a
  la interfaz.

### Named Rules
**La Regla del Peso Fotográfico.** La sombra pronunciada (`shadow-xl`) se reserva para
fotografía enmarcada. El resto de la interfaz —cards, nav, inputs— permanece plana o
con sombra apenas perceptible (`shadow-sm`).

## 5. Components

### Buttons
- **Shape:** el CTA principal es píldora completa (`rounded-full`, 9999px); el resto de
  la UI funcional (formularios, admin) usa esquinas moderadas (`rounded-md`, 8px).
- **Primary:** fondo ámbar cálido (#e8913a), texto blanco, padding `12px 32px`, sombra
  cálida sutil (`shadow-amber/25`).
- **Hover / Focus:** fondo pasa a ámbar oscuro (#d07a2b); focus visible con anillo de 3px
  en el color de foco del tema.
- **Outline / Ghost:** fondo transparente, borde o fondo de acento en hover — para
  acciones secundarias, nunca para el CTA principal de una sección.

### Cards
- **Corner Style:** 14px (`rounded-xl`) para cards de contenido; 18px (`rounded-2xl`)
  para bloques de misión/visión.
- **Background:** blanco puro sobre fondo crema, o crema sobre fondo blanco — siempre
  alternando con la sección que lo envuelve.
- **Shadow Strategy:** `shadow-sm` como máximo (ver Elevation). Sin borde visible salvo
  que la card esté sobre un fondo del mismo tono.
- **Internal Padding:** 24-40px según densidad de contenido.

### Inputs / Fields
- **Style:** borde de 1px en niebla (#e5e7eb), fondo transparente, esquinas de 8px,
  sombra `shadow-xs`.
- **Focus:** el borde cambia a color de foco del tema y aparece un anillo de 3px de
  opacidad reducida.
- **Error:** borde y anillo pasan a rojo destructivo (#ef4444).

### Navigation
- **Style:** barra fija superior, fondo blanco a 80% de opacidad con `backdrop-blur-md`,
  borde inferior sutil en niebla. Enlaces en Inter bold, tracking amplio, minúsculas
  reales en mayúsculas de marca (`INICIO`, `CREENCIAS`…). Estado activo en ámbar; resto
  en tinta atenuada con hover a tinta plena.
- **Mobile:** menú lateral (`Sheet`) de 288px, mismos enlaces en columna, mismo código
  de color activo/hover.

### Icon Circle (signature component)
Círculo de 64-80px con fondo ámbar al 10% de opacidad e icono ámbar sólido centrado.
Patrón recurrente para ilustrar misión/visión/valores sin usar fotografía ni ilustración
custom — el acento de color hace todo el trabajo visual.

### Badge / Label
Texto corto en mayúsculas, Inter bold, `letter-spacing: 0.2em`, color ámbar, sin fondo
ni borde — se posiciona siempre inmediatamente encima de un H2 de sección.

## 6. Do's and Don'ts

### Do:
- **Do** reservar el ámbar (#e8913a) para un único elemento de foco por vista: el CTA,
  el estado activo, o la palabra de énfasis — nunca como fondo extenso.
- **Do** usar Playfair Display itálica solo para una palabra o frase corta dentro de un
  titular Inter bold.
- **Do** mantener las superficies planas por defecto; usar `shadow-xl` únicamente en
  fotografía enmarcada.
- **Do** verificar contraste de `text-muted-foreground` (#54606e) sobre crema/blanco —
  es el texto de cuerpo por defecto y debe seguir siendo legible para público mayor.

### Don't:
- **Don't** usar vitrales, iconografía religiosa genérica, o cualquier motivo que evoque
  una "iglesia antigua".
- **Don't** usar tipografía gótica/blackletter en ningún contexto.
- **Don't** maquetar como un sitio estático estilo años 2000 (bloques rígidos, sin
  espaciado, sin jerarquía tipográfica).
- **Don't** convertir un titular completo a serif itálica — el acento es de una palabra,
  no de la frase entera.
- **Don't** introducir un segundo color saturado junto al ámbar; si se necesita un
  segundo acento, resolverlo con una variación tonal del ámbar, no un color nuevo.
- **Don't** repetir la etiqueta en mayúsculas (eyebrow) en más de una sección por
  página. Un único kicker por página es voz; el resto de fronteras de sección usan el
  divisor de regla ámbar (`h-1 w-16/20 rounded-full`, ver Community/Leadership).
