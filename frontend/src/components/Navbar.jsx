"use client";

import { MenuIcon } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { handleTheme } from "../Features/ThemeSlice";

const Navbar5 = () => {
  const darkMode = useSelector((state) => state.Theme.darkMode)
  const dispatch = useDispatch()
  // const [user,setuser] = useState(true)
  const features = [
    { title: "Feed", description: "See the Activity of others", href: "/activity" },
    { title: "Chatrooms", description: "get all notifications related to your profile here and Join discussions which resembles your interest", href: "/notifications" },
    { title: "Code & Decode", description: "participate in exciting brain bowls to enhance your thinking capacity", href: "/code-decode" },
    { title: "Events", description: "showcase or promote various events to attract developers", href: "/events" },
    { title: "Project Collaboration", description: "Manage your Project with your teamates", href: "project-collaboration" },
    { title: "Pending Requests", description: "See your pending requests", href: "pending-requests" },
  ];

  // Fake user (replace with real auth)
  const user = {
    name: "Navkirat Singh",
    email: "kirat@example.com",
    avatar: "https://github.com/shadcn.png",
  };

  return (
  <section className="py-4 flex justify-center align-middle 
  sticky top-0 z-50 bg-[var(--color-darkBlue)]">
  <div className="container">
    <nav className="flex items-center justify-between ">
          {/* LOGO */}
          <a href="/" className="flex items-center gap-2">
            <span className={`text-lg font-semibold tracking-tighter 'text-white' `}>
              DevNautics
            </span>
          </a>

          {/* NAVIGATION MENU (Desktop) */}
          <NavigationMenu className="hidden lg:block ">
            <NavigationMenuList className="flex gap-4">
              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-gray-800 text-white">
                  Features
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid w-[600px] grid-cols-2 p-3">
                    {features.map((feature, index) => (
                      <NavigationMenuLink
                        href={feature.href}
                        key={index}
                        className="rounded-md p-3 transition-colors hover:bg-muted/70"
                      >
                        <div key={feature.title}>
                          <p className="mb-1 font-semibold text-foreground">
                            {feature.title}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {feature.description}
                          </p>
                        </div>
                      </NavigationMenuLink>
                    ))}
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink className="bg-gray-800 text-white">
                  <Link to="/about">About us</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink className="bg-gray-800 text-white">
                  Resources
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink className="bg-gray-800 text-white">
                  <Link to="/contact">Contact</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          {/* RIGHT SIDE (Auth / Avatar) */}
          <div className="hidden items-center gap-4 lg:flex">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Avatar className="cursor-pointer">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback>
                      {user.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-48">
                  <DropdownMenuLabel>{user.name}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Link to="/user">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <p>{darkMode ? 'dark-Mode' : 'light-Mode'}</p>
                  <button
              onClick={() => dispatch(handleTheme())}
              className={`p-3 rounded-full ${darkMode ? 'bg-blue-800 text-blue-200' : 'bg-blue-100 text-blue-800'}`}
            > 
              {darkMode ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <button onClick={() => console.log("Logout")}>
                      Logout
                    </button>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button className="bg-blue-800 hover:bg-blue-950">Sign in</Button>
                <Button className="bg-gray-700 hover:bg-gray-950">Start for free</Button>
              </>
            )}
          </div>

          {/* MOBILE MENU */}
          <Sheet>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="outline" size="icon">
                <MenuIcon className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="top" className="max-h-screen overflow-auto">
              <SheetHeader>
                <SheetTitle>
                  <a href="/" className="flex items-center gap-2">
                    <span className="text-lg font-semibold tracking-tighter">
                      CollabriX
                    </span>
                  </a>
                </SheetTitle>
              </SheetHeader>
              <div className="flex flex-col p-4">
                <Accordion type="single" collapsible className="mt-4 mb-2">
                  <AccordionItem value="solutions" className="border-none">
                    <AccordionTrigger className="text-base hover:no-underline">
                      Features
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="grid md:grid-cols-2">
                        {features.map((feature, index) => (
                          <a
                            href={feature.href}
                            key={index}
                            className="rounded-md p-3 transition-colors hover:bg-muted/70"
                          >
                            <div key={feature.title}>
                              <p className="mb-1 font-semibold text-foreground">
                                {feature.title}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {feature.description}
                              </p>
                            </div>
                          </a>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>

                <div className="flex flex-col gap-6">
                  <a href="#" className="font-medium">Templates</a>
                  <a href="#" className="font-medium">Blog</a>
                  <a href="#" className="font-medium">Pricing</a>
                </div>

                <div className="mt-6 flex flex-col gap-4">
                  {user ? (
                    <Button onClick={() => console.log("Logout")}>Logout</Button>
                  ) : (
                    <>
                      <Button>Sign in</Button>
                      <Button>Start for free</Button>
                    </>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </nav>
      </div>
    </section>
  );
};

export default Navbar5;
