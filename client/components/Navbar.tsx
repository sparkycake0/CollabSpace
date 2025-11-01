"use client";

import { useState, useEffect } from "react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  ChevronRight,
  ChevronLeft,
  HomeIcon,
  Folder,
  Calendar,
  User,
  FolderKanban,
  FolderPlus,
  UserSquare,
  UserCog,
  BoxesIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const path = usePathname();
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const navBarItems = [
    { title: "Dashboard", link: "/", icon: HomeIcon },
    {
      title: "Projects",
      childs: [
        { title: "Projects", link: "/projects", icon: FolderKanban },
        { title: "Create", link: "/projects/new", icon: FolderPlus },
      ],
      icon: Folder,
    },
    {
      title: "Collab",
      childs: [{ title: "Collabs", link: "/collabs", icon: FolderKanban }],
      icon: Calendar,
    },
    {
      title: "Account",
      childs: [
        { title: "Profile", link: "/account/profile", icon: UserSquare },
        { title: "Settings", link: "/account/settings", icon: UserCog },
      ],
      icon: User,
    },
  ];

  return (
    <div className="flex lg:justify-center">
      {isMobile && (
        <div
          className={`${path === "/account/auth" ? "hidden" : ""} fixed top-0 flex flex-col items-center justify-center left-0 h-full bg-neutral-900 brightness-90 transition-transform duration-300 z-40 ${
            open ? "translate-x-0" : "-translate-x-full"
          } w-44 flex flex-col`}
        >
          <NavigationMenu
            viewport={false}
            className="flex-1 w-full flex flex-col justify-between"
          >
            <div className="w-44 flex justify-center py-4 bg-neutral-800 rounded-b-[75px]">
              <BoxesIcon className="size-20 text-neutral-400 hover:text-neutral-50 transition-colors duration-300" />
            </div>{" "}
            <NavigationMenuList className="flex flex-col gap-3">
              {navBarItems.map((item, index) => {
                const Icon = item.icon;
                return (
                  <NavigationMenuItem
                    key={index}
                    className="w-full text-start text-neutral-400 hover:text-white"
                  >
                    {item.childs ? (
                      <div>
                        <NavigationMenuTrigger className="w-full flex justify-between">
                          <div className="flex items-center gap-3">
                            {Icon && <Icon className="w-5 h-5" />}
                            {item.title}
                          </div>
                        </NavigationMenuTrigger>
                        <NavigationMenuContent className="flex flex-col rounded-sm gap-3 absolute ml-32 z-50 border-none bg-neutral-900 brightness-90 p-4 text-neutral-400">
                          {item.childs.map((child, i) => {
                            const ChildIcon = child.icon;
                            return (
                              <Link
                                key={i}
                                href={child.link}
                                className="text-md rounded-md hover:text-white"
                                onClick={() => setOpen(false)}
                              >
                                <div className="flex gap-3 items-center text-sm">
                                  {ChildIcon && (
                                    <ChildIcon className="w-5 h-5" />
                                  )}
                                  {child.title}
                                </div>
                              </Link>
                            );
                          })}
                        </NavigationMenuContent>
                      </div>
                    ) : (
                      <Link
                        href={item.link}
                        className="flex items-center gap-3 px-3 text-md py-1"
                        onClick={() => setOpen(false)}
                      >
                        {Icon && <Icon className="w-5 h-5" />}
                        {item.title}
                      </Link>
                    )}
                  </NavigationMenuItem>
                );
              })}
            </NavigationMenuList>
            <div className="w-5 h-24"></div>
          </NavigationMenu>

          <button
            onClick={() => setOpen(!open)}
            className="absolute top-1/2 -right-8 transform -translate-y-1/2 bg-neutral-900 text-white p-2 rounded-r-lg opacity-90 hover:opacity-100 transition-all"
          >
            {open ? (
              <ChevronLeft className="w-5 h-5" />
            ) : (
              <ChevronRight className="w-5 h-5" />
            )}
          </button>
        </div>
      )}

      {!isMobile && (
        <NavigationMenu
          viewport={false}
          className={` ${path === "/account/auth" ? "hidden" : "flex "}  items-center justify-center absolute top-0 self-center my-4 bg-neutral-900 rounded-full pr-8 text-neutral-400`}
        >
          <div className="px-4 bg-neutral-800 rounded-full mr-4 py-1">
            <BoxesIcon className="size-8 text-neutral-400 hover:text-neutral-50 transition-colors duration-300" />
          </div>
          <NavigationMenuList className="flex flex-col lg:flex-row w-full h-full">
            {navBarItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <NavigationMenuItem key={index}>
                  {item.childs ? (
                    <div>
                      <NavigationMenuTrigger className="hover:text-white flex gap-1">
                        {Icon && <Icon className="w-5 h-5" />}
                        {item.title}
                      </NavigationMenuTrigger>
                      <NavigationMenuContent className="flex absolute flex-col gap-3 ml-12 border-none backdrop-blur-lg backdrop-brightness-90 bg-neutral-900">
                        {item.childs.map((child) => {
                          const ChildIcon = child.icon;
                          return (
                            <Link
                              key={child.link}
                              href={child.link}
                              className="w-full text-center hover:text-white flex gap-1"
                            >
                              {ChildIcon && <ChildIcon className="w-5 h-5" />}
                              {child.title}
                            </Link>
                          );
                        })}
                      </NavigationMenuContent>
                    </div>
                  ) : (
                    <Link
                      href={item.link}
                      className="hover:text-white mr-3 flex gap-1"
                    >
                      {Icon && <Icon />}
                      {item.title}
                    </Link>
                  )}
                </NavigationMenuItem>
              );
            })}
          </NavigationMenuList>
        </NavigationMenu>
      )}
    </div>
  );
}
