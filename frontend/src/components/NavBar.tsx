import { linkVariants } from "@heroui/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

function NavBar() {
  const pathname = usePathname();
  const slots = linkVariants();

  const links = [
    { label: "Inicio", href: "/" },
    { label: "Historial", href: "/historial" },
  ];

  return (
    <div className="w-full h-10 p-8 px-20 items-center bg-background-secondary  border-b flex justify-between">
      <div className="flex items-center gap-2">
        <Image
          src={"/dolar-venezuela-icon.png"}
          alt="Dolar Venezuela icon."
          width={40}
          height={40}
        />
        <Link href={"/"} className="text-2xl font-bold">
          Dolar Venezuela
        </Link>
      </div>
      <div className="flex gap-4">
        {links.map((link) => (
          <Link
            key={link.label}
            href={link.href}
            className={`${slots.base()} text-lg ${pathname == link.href ? "decoration-accent" : ""}`}
          >
            {link.label}
          </Link>
        ))}
      </div>
    </div>
  );
}

export default NavBar;
