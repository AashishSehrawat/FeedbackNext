"use client";

import React from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { User } from "next-auth";
import { Button } from "./ui/button";

const Navbar = () => {
  const { data: session } = useSession();

  const user = session?.user;

  return (
    <nav className="p-4 md:p-6 shadow-md">
      <div className="container max-auto flex flex-col justify-between items-center md:flex-row">
        <Link href="#">Mistry Message</Link>
        {session ? (
          <>
            <span>Welcome, {user?.username || user?.email}</span>
            <Button onClick={() => signOut()}>Logout</Button>
          </>
        ) : (
          <>
            <Link href="/signIn">
              <Button>Login</Button>
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
