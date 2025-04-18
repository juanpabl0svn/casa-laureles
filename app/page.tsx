"use client";

import type React from "react";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Phone,
  Mail,
  MapPin,
  Home,
  Ruler,
  ArrowRight,
  X,
  ChevronLeft,
  ChevronRight,
  MessageCircle,
} from "lucide-react";

import { AnimatePresence, motion } from "framer-motion";

import { EMAIL, PHONE, URL, WHATSAPP_URL } from "@/lib/utils";
import Link from "next/link";
import { sendMail } from "@/lib/action";
import { useSearchParams } from "next/navigation";

// Definir las secciones para la navegación
type Section =  "detalles" | "galeria" | "contacto";

export default function PropertyLanding() {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [activeSection, setActiveSection] = useState<Section>("detalles");

  const searchParams = useSearchParams();

  const messageSend = searchParams.get("messageState");

  // Referencias para las secciones
  const detallesRef = useRef<HTMLElement>(null);
  const galeriaRef = useRef<HTMLElement>(null);
  const contactoRef = useRef<HTMLElement>(null);

  // Imágenes de ejemplo con diferentes proporciones
  const images = [
    {
      id: 1,
      src: "/wp-content/uploads/2025/03/frente-casa-1.jpg",
      alt: "Vista frontal de la propiedad",
      aspectRatio: "3/4",
    },
    {
      id: 2,
      src: "/wp-content/uploads/2025/03/IMG-20240623-WA0012-1.jpg",
      alt: "Sala de estar",
      aspectRatio: "4/3",
    },
    {
      id: 3,
      src: "/wp-content/uploads/2025/03/IMG-20250328-WA0053-1024x576.jpg",
      alt: "Jardín trasero",
      aspectRatio: "1/1",
    },
    {
      id: 4,
      src: "/wp-content/uploads/2025/04/IMG-20240623-WA0028-1024x576.jpg",
      alt: "Cocina",
      aspectRatio: "3/2",
    },
    {
      id: 5,
      src: "/wp-content/uploads/2025/04/IMG-20240623-WA0018-1024x576.jpg",
      alt: "Dormitorio principal",
      aspectRatio: "2/3",
    },
    {
      id: 6,
      src: "/wp-content/uploads/2025/03/6de0514afcaf779966593e9b7eed96502c8d5732-1-576x1024.jpg",
      alt: "Vista aérea",
      aspectRatio: "16/9",
    },
    {
      id: 7,
      src: "/wp-content/uploads/2025/04/IMG-20240623-WA0016-1024x576.jpg",
      alt: "Baño principal",
      aspectRatio: "1/1",
    },
    {
      id: 8,
      src: "/wp-content/uploads/2025/03/IMG-20240326-WA0040-576x1024.jpg",
      alt: "Terraza",
      aspectRatio: "3/2",
    },
    {
      id: 9,
      src: "/wp-content/uploads/2025/03/IMG-20240326-WA0044-576x1024.jpg",
      alt: "Detalles arquitectónicos",
      aspectRatio: "4/5",
    },
  ];

  // Configurar Intersection Observer para detectar la sección activa
  useEffect(() => {
    const options = {
      root: null, // viewport
      rootMargin: "-50% 0px", // Considerar el elemento visible cuando está a la mitad de la pantalla
      threshold: 0, // Cualquier parte visible
    };

    const handleIntersect = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.id as Section;
          setActiveSection(id as Section);
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersect, options);

    // Observar todas las secciones
    if (detallesRef.current) observer.observe(detallesRef.current);
    if (galeriaRef.current) observer.observe(galeriaRef.current);
    if (contactoRef.current) observer.observe(contactoRef.current);

    return () => {
      observer.disconnect();
    };
  }, []);

  const openModal = (id: number) => {
    setSelectedImage(id);
    document.body.style.overflow = "hidden"; // Prevenir scroll cuando el modal está abierto
  };

  const closeModal = () => {
    setSelectedImage(null);
    document.body.style.overflow = "auto"; // Restaurar scroll
  };

  const navigateImage = (direction: "prev" | "next") => {
    if (selectedImage === null) return;

    const currentIndex = images.findIndex((img) => img.id === selectedImage);
    let newIndex;

    if (direction === "prev") {
      newIndex = currentIndex > 0 ? currentIndex - 1 : images.length - 1;
    } else {
      newIndex = currentIndex < images.length - 1 ? currentIndex + 1 : 0;
    }

    setSelectedImage(images[newIndex].id);
  };

  // Prevenir que el clic en la imagen cierre el modal
  const handleImageClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  // Función para determinar si un enlace está activo
  const isActive = (section: Section) => activeSection === section;

  return (
    <div className="min-h-screen bg-[#f9f7f5]">
      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b border-[#e8e0d8] bg-[#f9f7f5]/80 backdrop-blur-sm">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Home className="h-6 w-6 text-[#8b6e4e]" />
            <a
              href="#"
              className="text-xl font-semibold text-[#5d4b35] hover:text-[#8b6e4e] transition-colors"
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            >
              Casa/Lote Laureles
            </a>
          </div>
          <nav className="hidden md:flex gap-6">
            <a
              href="#detalles"
              className={`relative transition-colors ${
                isActive("detalles")
                  ? "text-[#8b6e4e] font-medium"
                  : "text-[#5d4b35] hover:text-[#8b6e4e]"
              }`}
            >
              Detalles
              {isActive("detalles") && (
                <motion.span
                  className="absolute -bottom-1.5 left-0 right-0 h-0.5 bg-[#8b6e4e] rounded-full"
                  layoutId="activeSection"
                  transition={{ type: "spring", stiffness: 350, damping: 30 }}
                />
              )}
            </a>
            <a
              href="#galeria"
              className={`relative transition-colors ${
                isActive("galeria")
                  ? "text-[#8b6e4e] font-medium"
                  : "text-[#5d4b35] hover:text-[#8b6e4e]"
              }`}
            >
              Galería
              {isActive("galeria") && (
                <motion.span
                  className="absolute -bottom-1.5 left-0 right-0 h-0.5 bg-[#8b6e4e] rounded-full"
                  layoutId="activeSection"
                  transition={{ type: "spring", stiffness: 350, damping: 30 }}
                />
              )}
            </a>
            <a
              href="#contacto"
              className={`relative transition-colors ${
                isActive("contacto")
                  ? "text-[#8b6e4e] font-medium"
                  : "text-[#5d4b35] hover:text-[#8b6e4e]"
              }`}
            >
              Contacto
              {isActive("contacto") && (
                <motion.span
                  className="absolute -bottom-1.5 left-0 right-0 h-0.5 bg-[#8b6e4e] rounded-full"
                  layoutId="activeSection"
                  transition={{ type: "spring", stiffness: 350, damping: 30 }}
                />
              )}
            </a>
          </nav>
          <Link href={"#contacto"}>
            <Button className="bg-[#8b6e4e] hover:bg-[#6d563d] text-white">
              Agendar Visita
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <motion.section
        className="relative h-[70vh]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <Image
          src={URL + "/wp-content/uploads/2025/03/frente-casa-1.jpg"}
          alt="Casa/Lote en Laureles"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/40 flex items-end">
          <div className="container pb-12">
            <motion.h1
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Casa/Lote Laureles
            </motion.h1>
            <motion.p
              className="text-xl text-white/90 max-w-2xl"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              Exclusiva propiedad ubicada en el prestigioso barrio Laureles,
              ideal para vivienda o desarrollo inmobiliario.
            </motion.p>
          </div>
        </div>
      </motion.section>

      {/* Property Details */}
      <section ref={detallesRef} id="detalles" className="py-16 bg-white">
        <div className="container">
          <motion.h2
            className="text-3xl font-bold text-[#5d4b35] mb-10 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Detalles de la Propiedad
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <motion.div
              className="bg-[#f9f7f5] p-8 rounded-lg border border-[#e8e0d8]"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-full bg-[#8b6e4e]/10">
                  <Ruler className="h-6 w-6 text-[#8b6e4e]" />
                </div>
                <h3 className="text-xl font-semibold text-[#5d4b35]">
                  Dimensiones
                </h3>
              </div>
              <ul className="space-y-4">
                <li className="flex justify-between">
                  <span className="text-[#5d4b35] font-medium">
                    Área Total:
                  </span>
                  <span className="text-[#8b6e4e] font-bold">424 metros</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-[#5d4b35] font-medium">
                    Área Construida:
                  </span>
                  <span className="text-[#8b6e4e] font-bold">331 m</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-[#5d4b35] font-medium">Frente:</span>
                  <span className="text-[#8b6e4e] font-bold">10,9 metros</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-[#5d4b35] font-medium">Fondo:</span>
                  <span className="text-[#8b6e4e] font-bold">44,05 metros</span>
                </li>
              </ul>
            </motion.div>

            <motion.div
              className="bg-[#f9f7f5] p-8 rounded-lg border border-[#e8e0d8]"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-full bg-[#8b6e4e]/10">
                  <MapPin className="h-6 w-6 text-[#8b6e4e]" />
                </div>
                <h3 className="text-xl font-semibold text-[#5d4b35]">
                  Ubicación
                </h3>
              </div>
              <ul className="space-y-4">
                <li className="flex justify-between">
                  <span className="text-[#5d4b35] font-medium">Barrio:</span>
                  <span className="text-[#8b6e4e] font-bold">Laureles</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-[#5d4b35] font-medium">Estrato:</span>
                  <span className="text-[#8b6e4e] font-bold">5</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-[#5d4b35] font-medium">Ciudad:</span>
                  <span className="text-[#8b6e4e] font-bold">Medellín</span>
                </li>
              </ul>
            </motion.div>

            <motion.div
              className="bg-[#f9f7f5] p-8 rounded-lg border border-[#e8e0d8]"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-full bg-[#8b6e4e]/10">
                  <Home className="h-6 w-6 text-[#8b6e4e]" />
                </div>
                <h3 className="text-xl font-semibold text-[#5d4b35]">
                  Características
                </h3>
              </div>
              <ul className="space-y-4">
                <li className="flex items-center gap-2">
                  <ArrowRight className="h-4 w-4 text-[#8b6e4e]" />
                  <span className="text-[#5d4b35]">Excelente ubicación</span>
                </li>
                <li className="flex items-center gap-2">
                  <ArrowRight className="h-4 w-4 text-[#8b6e4e]" />
                  <span className="text-[#5d4b35]">
                    Potencial para desarrollo
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <ArrowRight className="h-4 w-4 text-[#8b6e4e]" />
                  <span className="text-[#5d4b35]">
                    Cerca a zonas comerciales
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <ArrowRight className="h-4 w-4 text-[#8b6e4e]" />
                  <span className="text-[#5d4b35]">
                    Acceso a transporte público
                  </span>
                </li>
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section ref={galeriaRef} id="galeria" className="py-16 bg-[#f9f7f5]">
        <div className="container">
          <motion.h2
            className="text-3xl font-bold text-[#5d4b35] mb-10 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Galería de Imágenes
          </motion.h2>

          <div className="columns-1 sm:columns-2 md:columns-3 gap-4 space-y-4">
            {images.map((image, index) => (
              <motion.div
                key={image.id}
                className="break-inside-avoid mb-4 overflow-hidden rounded-lg group cursor-pointer relative"
                onClick={() => openModal(image.id)}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: (index * 0.1) % 0.5 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div
                  className="relative w-full"
                  style={{
                    aspectRatio: image.aspectRatio,
                    paddingBottom:
                      image.aspectRatio === "1/1"
                        ? "100%"
                        : image.aspectRatio === "3/4"
                        ? "133.33%"
                        : image.aspectRatio === "4/3"
                        ? "75%"
                        : image.aspectRatio === "16/9"
                        ? "56.25%"
                        : image.aspectRatio === "3/2"
                        ? "66.67%"
                        : image.aspectRatio === "2/3"
                        ? "150%"
                        : image.aspectRatio === "4/5"
                        ? "125%"
                        : "100%",
                  }}
                >
                  <Image
                    src={URL + image.src}
                    alt={image.alt}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-110"
                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                  <div className="p-4 text-white">
                    <p className="font-medium">{image.alt}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section ref={contactoRef} id="contacto" className="py-16 bg-white">
        <div className="container">
          <motion.h2
            className="text-3xl font-bold text-[#5d4b35] mb-10 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Contáctenos
          </motion.h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <motion.div
              className="space-y-8"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h3 className="text-2xl font-semibold text-[#5d4b35]">
                ¿Interesado en esta propiedad?
              </h3>
              <p className="text-[#5d4b35]/80">
                Complete el formulario y nos pondremos en contacto con usted a
                la brevedad para brindarle más información o agendar una visita
                a la propiedad.
              </p>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-[#8b6e4e]/10">
                    <Phone className="h-5 w-5 text-[#8b6e4e]" />
                  </div>
                  <span className="text-[#5d4b35]">{PHONE}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-[#8b6e4e]/10">
                    <Mail className="h-5 w-5 text-[#8b6e4e]" />
                  </div>
                  <span className="text-[#5d4b35]">{EMAIL}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-[#8b6e4e]/10">
                    <MapPin className="h-5 w-5 text-[#8b6e4e]" />
                  </div>
                  <span className="text-[#5d4b35]">
                    Barrio Laureles, Medellín, Colombia
                  </span>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="bg-[#f9f7f5] p-8 rounded-lg border border-[#e8e0d8]"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <form className="space-y-4" action={sendMail}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label
                      htmlFor="nombre"
                      className="text-sm font-medium text-[#5d4b35]"
                    >
                      Nombre
                    </label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="Su nombre"
                      className="border-[#e8e0d8] focus-visible:ring-[#8b6e4e]"
                    />
                  </div>
                  <div className="space-y-2">
                    <label
                      htmlFor="apellido"
                      className="text-sm font-medium text-[#5d4b35]"
                    >
                      Apellido
                    </label>
                    <Input
                      id="surname"
                      name="surname"
                      placeholder="Su apellido"
                      className="border-[#e8e0d8] focus-visible:ring-[#8b6e4e]"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="email"
                    className="text-sm font-medium text-[#5d4b35]"
                  >
                    Correo Electrónico
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Su correo electrónico"
                    className="border-[#e8e0d8] focus-visible:ring-[#8b6e4e]"
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="telefono"
                    className="text-sm font-medium text-[#5d4b35]"
                  >
                    Teléfono
                  </label>
                  <Input
                    id="phone"
                    name="phone"
                    placeholder="Su número de teléfono"
                    className="border-[#e8e0d8] focus-visible:ring-[#8b6e4e]"
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="mensaje"
                    className="text-sm font-medium text-[#5d4b35]"
                  >
                    Mensaje
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    placeholder="Escriba su mensaje o consulta aquí"
                    className="min-h-[120px] border-[#e8e0d8] focus-visible:ring-[#8b6e4e]"
                  />
                </div>

                <Button className="w-full bg-[#8b6e4e] hover:bg-[#6d563d] text-white">
                  Enviar Mensaje
                </Button>
              </form>
            </motion.div>
            {messageSend && <span>{messageSend}</span>}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-[#5d4b35] text-white/80">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <Home className="h-5 w-5 text-white" />
              <span className="text-lg font-medium text-white">
                Casa/Lote Laureles
              </span>
            </div>

            <div className="text-sm">
              © {new Date().getFullYear()} Casa/Lote Laureles. Todos los
              derechos reservados.
            </div>
          </div>
        </div>
      </footer>

      <Link
        href={WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-5 right-5 w-10 h-10 p-2 bg-[#8b6e4e] hover:opacity-80 rounded-lg transition-all ease-in-out duration-300 shadow-lg shadow-black/30 flex items-center justify-center z-50"
      >
        <MessageCircle className="text-[#4e3923]" />
      </Link>

      {/* Modal para ver imágenes en grande */}
      <AnimatePresence>
        {selectedImage !== null && (
          <motion.div
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 md:p-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
          >
            <motion.div
              className="absolute top-4 right-4 z-10"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <button
                onClick={closeModal}
                className="bg-white/10 hover:bg-white/20 rounded-full p-2 text-white transition-colors"
              >
                <X className="h-6 w-6" />
                <span className="sr-only">Cerrar</span>
              </button>
            </motion.div>

            <motion.div
              className="absolute left-4 top-1/2 -translate-y-1/2 z-10"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigateImage("prev");
                }}
                className="bg-white/10 hover:bg-white/20 rounded-full p-2 text-white transition-colors"
              >
                <ChevronLeft className="h-6 w-6" />
                <span className="sr-only">Anterior</span>
              </button>
            </motion.div>

            <motion.div
              className="absolute right-4 top-1/2 -translate-y-1/2 z-10"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigateImage("next");
                }}
                className="bg-white/10 hover:bg-white/20 rounded-full p-2 text-white transition-colors"
              >
                <ChevronRight className="h-6 w-6" />
                <span className="sr-only">Siguiente</span>
              </button>
            </motion.div>

            {images.map(
              (image) =>
                image.id === selectedImage && (
                  <motion.div
                    key={`modal-${image.id}`}
                    className="relative w-[50vw] min-w-[300px] max-w-5xl max-h-[85vh] flex items-center justify-center"
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    transition={{ type: "spring", damping: 25, stiffness: 300 }}
                    onClick={handleImageClick}
                  >
                    <div
                      className="relative w-full h-auto max-h-[85vh]"
                      style={{ aspectRatio: image.aspectRatio }}
                    >
                      <Image
                        src={URL + image.src}
                        alt={image.alt}
                        fill
                        className="object-contain"
                        sizes="(max-width: 1024px) 100vw, 1024px"
                      />
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-4 text-center">
                      <p className="font-medium">{image.alt}</p>
                    </div>
                  </motion.div>
                )
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
