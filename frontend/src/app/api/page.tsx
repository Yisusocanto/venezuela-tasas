import { Card, buttonVariants } from "@heroui/react";
import { Globe, Shield, Code2, Terminal, BookOpen, Github } from "lucide-react";
import Image from "next/image";
import FeatureCard from "@/components/FeatureCard";
import Link from "next/link";

function Api() {
  const slots = buttonVariants();
  const features = [
    {
      title: "Empezando",
      icon: <Terminal size={20} className="text-accent" />,
      linkName: "Documentación",
      linkHref: "",
      content:
        "Para comenzar a usar la API no necesitas API keys ni configuraciones complejas, solo empezar a hacer peticiones a los endpoints. El diseño se enfoca en la simplicidad.",
    },
    {
      title: "Cómo funciona",
      icon: <Shield size={20} className="text-accent" />,
      linkName: "Documentación",
      linkHref: "",
      content:
        "Los datos se sincronizan diariamente con la tasa oficial del BCV. Incluye validaciones robustas y reintentos automáticos para garantizar información siempre precisa.",
    },
    {
      title: "Colaborar",
      icon: <Globe size={20} className="text-accent" />,
      linkName: "Repositorio de Github",
      linkHref: "",
      content:
        "El código abierto es el corazón del proyecto. Contribuye al proyecto, reporta problemas o sugiere características en nuestra comunidad de Github.",
    },
  ];

  const devFeatures = [
    {
      icon: <Code2 size={20} className="text-accent" />,
      title: "Arquitectura RESTful",
      description:
        "Respuestas JSON estándar que se integran con cualquier stack de tecnología moderno.",
    },
    {
      icon: <Globe size={20} className="text-accent" />,
      title: "Sin configuración CORS",
      description:
        "Totalmente abierta y optimizada para aplicaciones del lado cliente.",
    },
    {
      icon: <Shield size={20} className="text-accent" />,
      title: "99.9% tiempo de actividad",
      description:
        "Alojado en un servicio de alta disponibilidad y rendimiento para una muy baja latencia global.",
    },
  ];

  const techStack = [
    { src: "/python.svg", alt: "Python", label: "Python" },
    { src: "/fastapi.svg", alt: "FastAPI", label: "FastAPI" },
    {
      src: "/postgresql.svg",
      alt: "PostgreSQL",
      label: "PostgreSQL",
    },
  ];

  return (
    <div className="flex flex-col w-full overflow-hidden">
      {/* ===== HERO SECTION ===== */}
      <section className="relative w-full flex flex-col items-center justify-center py-24 md:py-32 px-4">
        {/* Background glow decorations */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-accent/10 blur-[120px] animate-pulse-glow pointer-events-none" />
        <div className="absolute top-20 right-[10%] w-[200px] h-[200px] rounded-full bg-accent/5 blur-[80px] animate-pulse-glow delay-500 pointer-events-none" />

        <div className="relative z-10 w-full max-w-3xl mx-auto flex flex-col gap-6 items-center animate-fade-in-up">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent-soft text-accent text-sm font-medium">
            <Terminal size={14} />
            API Pública — Sin API Key
          </span>

          <h1 className="text-4xl md:text-6xl font-bold text-center leading-tight">
            La API definitiva para consultar las{" "}
            <span className="text-accent bg-accent/10 px-2 rounded-lg">
              tasas del BCV
            </span>{" "}
            sin interrupciones.
          </h1>

          <p className="text-muted text-lg md:text-xl text-center max-w-2xl animate-fade-in-up delay-200">
            La forma más rápida y confiable de acceder a los tipos de cambio
            oficiales del Banco Central de Venezuela en tiempo real. Diseñado
            para un rendimiento de alta calidad.
          </p>
        </div>

        <div className="relative z-10 flex flex-wrap justify-center gap-3 mt-8 animate-fade-in-up delay-300">
          <Link
            href={"https://venezuela-tasas.onrender.com/redoc"}
            target="_blank"
            className={`${slots} font-semibold bg-accent text-accent-foreground px-6 py-6 text-base hover:scale-105 transition-transform`}
          >
            <BookOpen size={18} />
            Ver documentación
          </Link>
          <Link
            href={"https://github.com/Yisusocanto/venezuela-tasas"}
            target="_blank"
            className={`${slots} font-semibold border border-border px-6 py-6 text-base hover:scale-105 transition-transform`}
          >
            <Github size={18} />
            Repositorio de Github
          </Link>
        </div>
      </section>

      {/* ===== FEATURE CARDS ===== */}
      <section className="w-full md:w-3/4 mx-auto px-4 md:px-0">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {features.map((feat, i) => (
            <div
              key={feat.title}
              className={`animate-fade-in-up delay-${(i + 1) * 100}`}
              style={{ animationDelay: `${(i + 1) * 120}ms` }}
            >
              <FeatureCard
                title={feat.title}
                linkName={feat.linkName}
                linkHref={feat.linkHref}
                content={feat.content}
              />
            </div>
          ))}
        </div>
      </section>

      {/* ===== BUILT FOR DEVELOPERS ===== */}
      <section className="w-full md:w-3/4 mx-auto px-4 md:px-0 mt-24">
        <div className="flex flex-col md:flex-row justify-between items-center gap-12">
          {/* Left: text content */}
          <div className="flex flex-col gap-8 md:w-1/2 animate-fade-in-left">
            <div className="flex flex-col gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent-soft text-accent text-sm font-medium w-fit">
                <Code2 size={14} />
                Developer Experience
              </span>
              <h3 className="text-3xl md:text-4xl font-bold">
                Construido para desarrolladores
              </h3>
              <p className="text-muted">
                Todo lo que necesitas para integrar las tasas del BCV en tu
                aplicación.
              </p>
            </div>

            <div className="flex flex-col gap-5">
              {devFeatures.map((item, i) => (
                <div
                  key={item.title}
                  className="flex items-start gap-3 group hover:translate-x-1 transition-transform duration-300"
                  style={{ animationDelay: `${(i + 1) * 150}ms` }}
                >
                  <span className="shrink-0 rounded-xl bg-accent/10 p-2.5 flex items-center justify-center group-hover:bg-accent-soft-hover transition-colors duration-300">
                    {item.icon}
                  </span>
                  <div>
                    <h4 className="text-lg font-semibold">{item.title}</h4>
                    <p className="text-muted text-sm">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: preview image */}
          <div className="md:w-1/2 animate-fade-in-right delay-200">
            <div className="relative">
              <div className="absolute -inset-4 bg-accent/5 rounded-2xl blur-xl animate-pulse-glow pointer-events-none" />
              <img
                src={"/request-preview-dark.svg"}
                alt="API request preview"
                className="relative z-10 w-full h-auto rounded-xl shadow-xl shadow-accent/5 hover:scale-[1.02] transition-transform duration-500"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ===== CODE EXAMPLE ===== */}
      <section className="w-full md:w-3/4 mx-auto px-4 md:px-0 mt-24 animate-fade-in-up">
        <Card className="border border-border/50 overflow-hidden">
          <Card.Content className="p-0">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-border/50 bg-surface/50">
              <span className="w-3 h-3 rounded-full bg-danger/60"></span>
              <span className="w-3 h-3 rounded-full bg-warning/60"></span>
              <span className="w-3 h-3 rounded-full bg-success/60"></span>
              <span className="ml-2 text-xs text-muted">
                Ejemplo rápido — fetch
              </span>
            </div>
            <pre className="p-6 text-sm md:text-base overflow-x-auto">
              <code className="text-foreground/90">
                <span className="text-accent">const</span> response ={" "}
                <span className="text-accent">await</span>{" "}
                <span className="text-warning">fetch</span>(
                <span className="text-success">
                  &apos;https://venezuela-tasas.onrender.com/api/v1/rates&apos;
                </span>
                );{"\n"}
                <span className="text-accent">const</span> data ={" "}
                <span className="text-accent">await</span> response.
                <span className="text-warning">json</span>();{"\n"}
                {"\n"}
                <span className="text-muted">
                  {"// "}→ {"{"} dolar: {"{"} rate: 78.47, name:
                  &quot;dolar&quot;, ... {"}"}, ... {"}"}
                </span>
              </code>
            </pre>
          </Card.Content>
        </Card>
      </section>

      {/* ===== TECH STACK ===== */}
      <section className="w-full md:w-3/4 mx-auto px-4 md:px-0 mt-24 mb-24 animate-fade-in-up">
        <div className="flex flex-col items-center gap-6">
          <div className="text-center">
            <p className="text-sm text-muted uppercase tracking-widest mb-1">
              Tecnología
            </p>
            <h4 className="text-xl font-semibold">
              Hecho con un stack moderno
            </h4>
          </div>

          <div className="flex justify-center items-center gap-10 md:gap-16">
            {techStack.map((tech, i) => (
              <div
                key={tech.alt}
                className="flex flex-col items-center gap-2 hover:scale-110 transition-transform duration-300 animate-scale-in"
                style={{ animationDelay: `${(i + 1) * 100}ms` }}
              >
                <Image
                  src={tech.src}
                  alt={tech.alt}
                  width={56}
                  height={56}
                  className="opacity-80 hover:opacity-100 transition-opacity duration-300"
                />
                <span className="text-xs text-muted">{tech.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default Api;
