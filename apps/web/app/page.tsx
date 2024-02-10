"use client";
import {
  SignInButton,
  SignOutButton,
  UserButton,
  useUser,
} from "@clerk/nextjs";
import { Button } from "../components/ui/button";
import Link from "next/link";

export default function Home() {
  const { isLoaded, isSignedIn, user } = useUser();
  return (
    <div className="h-screen w-screen bg-black">
      <UserButton afterSignOutUrl="/" />
      <Button variant={"secondary"} asChild>
        <SignInButton />
      </Button>
      <Button variant={"secondary"} asChild>
        <SignOutButton />
      </Button>
      <div className="text-white">{user?.fullName}</div>
      <Button asChild variant={"link"} className="text-white">
        <Link href={"/chatRoom"}>chat room</Link>
      </Button>
      <p className="text-white">{isSignedIn ? "yes" : "no"}</p>
    </div>
  );
}
