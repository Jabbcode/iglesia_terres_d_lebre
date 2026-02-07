import type { Metadata } from "next";
import { Beliefs } from "@/components/sections/beliefs";

export const metadata: Metadata = {
  title: "Creencias | Comunidad Cristiana Terres de l'Ebre",
  description:
    "Conoce nuestras creencias fundamentales. Fundamentamos nuestra fe en la Palabra de Dios, en Jesucristo como Salvador y en el Espíritu Santo.",
};

export default function BeliefsPage() {
  return <Beliefs />;
}
