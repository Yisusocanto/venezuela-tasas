import { Button, linkVariants } from "@heroui/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ThemeToggle from "./ThemeToggle";

function NavBar() {
  const pathname = usePathname();
  const slots = linkVariants();

  const links = [
    { label: "Inicio", href: "/" },
    { label: "Historial", href: "/historial" },
  ];

  return (
    <div className="w-full h-16 px-4 md:px-20 items-center bg-background-secondary border-b flex justify-between">
      <div className="flex items-center gap-2">
        <Image
          src={"/dolar-venezuela-icon.png"}
          alt="Venezuela Tasas icon."
          width={30}
          height={30}
        />
        <Link href={"/"} className="text-lg md:text-2xl font-bold">
          Tasas Venezuela
        </Link>
      </div>
      <div className="flex items-center gap-2 md:gap-4">
        {links.map((link) => (
          <Link
            key={link.label}
            href={link.href}
            className={`${slots.base()} text-lg ${pathname == link.href ? "decoration-accent" : ""}`}
          >
            {link.label}
          </Link>
        ))}
        <ThemeToggle />
      </div>
    </div>
  );
}

export default NavBar;
