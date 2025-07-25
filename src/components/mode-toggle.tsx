/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/components/ui/button";
import { MoonIcon, SunIcon } from "@radix-ui/react-icons";

import { useTheme } from "next-themes";
import React from "react";

export function ModeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      variant='ghost'
      type='button'
      size='icon'
      className='px-2'
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
    >
      <SunIcon className='h-[1.2rem] w-[1.2rem] text-neutral-800 dark:hidden dark:text-neutral-200' />
      <MoonIcon className='h-[1.2rem] -z-10 dark:z-0 absolute w-[1.2rem] text-neutral-200' />
    </Button>
  );
}
