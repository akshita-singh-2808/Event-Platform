import Link from "next/link";
import Image from "next/image";
import React from "react";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { Button } from "../ui/button";
import Navitems from "./Navitems";
import MobileNav from "./MobileNav";

const Header = () => {
  return (
    <header className="w-full border-b">
      <div className="wrapper flex items-center justify-between">
        {/* Logo */}
        <Link className="w-36" href="/">
          {/* <Image
            src="/assets/images/logo.svg"
            width={128}
            height={38}
            alt="Momento-logo"
          /> */}
          MOMENTO
        </Link>

        {/* Desktop Navigation */}
        <SignedIn>
          <nav className="hidden md:flex">
            <Navitems />
          </nav>
        </SignedIn>

        {/* Right Section: User & Mobile Nav */}
        <div className="flex items-center gap-3">
          <SignedIn>
            {/* Show UserButton on all screens */}
            <UserButton afterSignOutUrl="/" />

            {/* Show Mobile Nav only on small screens */}
            <div className="md:hidden">
              <MobileNav />
            </div>
          </SignedIn>

          {/* Show Login button when signed out */}
          <SignedOut>
            <Button asChild className="rounded-full" size="lg">
              <Link href="/sign-in">Login</Link>
            </Button>
          </SignedOut>
        </div>
      </div>
    </header>
  );
};

export default Header;
