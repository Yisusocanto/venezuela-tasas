import Link from "next/link";
import React from "react";

function NavBar() {
  return (
    <div className="w-full h-10 p-8 px-20 items-center border-b-accent-soft border-b flex justify-between ">
      <div className="flex items-center gap-2">
        Logo
        <h1 className="text-xl font-bold">Dolar Venezuela</h1>
      </div>
      <div className="flex gap-2">
        <Link href={"/inicio"}>Inicio</Link>
        <Link href={"/historia"}>Historia</Link>
        <Link href={"/api"}>API</Link>
      </div>
    </div>
  );
}

export default NavBar;
