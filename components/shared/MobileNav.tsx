import React from "react";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Navitems from "./Navitems";
const MobileNav = () => {
  return (
    <nav className="md:hidden">
      <Sheet>
        <SheetTrigger className="align-middle ">
          <Image
            src="/assets/icons/menu.svg"
            alt="menu"
            width={24}
            height={24}
            className="curson-pointer"
          ></Image>
        </SheetTrigger>
        <SheetContent className="flex flex-col gap-6 md:hidden">
          <Image
            src="/assets/images/logo.svg"
            alt="logo"
            width={128}
            height={38}
          />
          <Separator className="border border-gray-50" />
          <Navitems />
        </SheetContent>
      </Sheet>
    </nav>
  );
};

export default MobileNav;
