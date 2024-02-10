import React from "react";

type MobileSidebarProps = {};
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTrigger,
} from "../ui/sheet";
import { ArrowRightIcon } from "@radix-ui/react-icons";

export const MobileSidebar = ({}: MobileSidebarProps) => {
  return (
    <>
      <Sheet>
        <SheetTrigger className="bg-white p-4">
          <ArrowRightIcon className="text-black" />
        </SheetTrigger>
        <SheetContent side={"left"}>
          <SheetHeader>
            <SheetDescription>
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
            </SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    </>
  );
};
