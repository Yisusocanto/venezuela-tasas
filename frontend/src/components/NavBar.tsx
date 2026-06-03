"use client";

import { Button, Drawer, linkVariants } from "@heroui/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ThemeToggle from "./ThemeToggle";
import { Code, History, Home, Menu } from "lucide-react";

function NavBar() {
	const pathname = usePathname();
	const slots = linkVariants();

	const links = [
		{ label: "Inicio", href: "/", icon: <Home size={18} /> },
		{ label: "Historial", href: "/historial", icon: <History size={18} /> },
		{ label: "Api", href: "/api", icon: <Code size={18} /> },
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
				<div className="hidden sm:inline-flex gap-4 items-center">
					{links.map((link) => (
						<Link
							key={link.label}
							href={link.href}
							className={`${slots.base()} text-lg ${pathname == link.href ? "underline decoration-accent" : ""}`}>
							{link.label}
						</Link>
					))}
				</div>
				<ThemeToggle />
				<Drawer>
					<Button isIconOnly className={"inline-flex sm:hidden"}>
						<Menu />
					</Button>
					<Drawer.Backdrop variant="blur">
						<Drawer.Content placement="right">
							<Drawer.Dialog>
								<Drawer.CloseTrigger />
								<Drawer.Header>
									<Drawer.Heading>Venezuela Tasas</Drawer.Heading>
								</Drawer.Header>
								<Drawer.Body className="flex flex-col gap-4">
									{links.map((link) => (
										<Link
											key={link.label}
											href={link.href}
											className={`${slots.base()} text-lg flex items-center gap-2 ${pathname == link.href ? "underline decoration-accent" : ""}`}>
											{link.icon}
											{link.label}
										</Link>
									))}
								</Drawer.Body>
							</Drawer.Dialog>
						</Drawer.Content>
					</Drawer.Backdrop>
				</Drawer>
			</div>
		</div>
	);
}

export default NavBar;
