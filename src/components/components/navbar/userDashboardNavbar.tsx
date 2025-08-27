"use client";

import { Menu, User, LogOut } from "lucide-react";
import { useState } from "react";
import { usePathname } from "next/navigation";

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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { signOut } from "next-auth/react";

interface MenuItem {
  title: string;
  url: string;
  description?: string;
  icon?: React.ReactNode;
  items?: MenuItem[];
}

interface UserProfile {
  name: string;
  email: string;
  avatar?: string;
  initials: string;
}

interface NavbarProps {
  logo?: {
    url: string;
    src: string;
    alt: string;
    title: string;
  };
  menu?: MenuItem[];
  user?: UserProfile;
}

const NavbarUserDashboard = ({
  logo = {
    url: "/",
    src: "/logo.svg",
    alt: "logo",
    title: "Appiks",
  },
  menu = [
    { title: "Dashboard", url: "/dashboard" },
    {
      title: "Rekap Mood",
      url: "/dashboard/mood-recap",
    },
    {
      title: "Konten",
      url: "/dashboard/content",
    },
    {
      title: "History laporan",
      url: "/dashboard/history-report",
    },
  ],
  user = {
    name: "Marsha Bilqis",
    email: "marsha.bilqis@student.sch.id",
    initials: "MN",
    avatar: "/avatar-placeholder.jpg"
  },
}: NavbarProps) => {
  const pathname = usePathname();
  const [isSheetOpen, setIsSheetOpen] = useState(false);

const isActiveMenu = (url: string) => {
  // Special handling for Dashboard - only active when exact match
  if (url === "/dashboard") {
    return pathname === "/dashboard";
  }
  // For other routes, check if pathname starts with the URL
  return pathname === url || pathname.startsWith(url + '/');
};

  const handleLogout = async () => {
    await signOut({
      callbackUrl: "/",
    });
  };

  const closeSheet = () => {
    setIsSheetOpen(false);
  };

  return (
    <>
      {/* Desktop Menu */}
      <nav className="fixed top-5 left-0 right-0 z-50 hidden justify-between lg:flex border rounded-full py-4 px-10 bg-background/95 backdrop-blur-sm container mx-auto">
        <div className="flex items-center gap-6">
          {/* Logo */}
          <Link href={logo.url} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">A</span>
            </div>
            <span className="text-lg font-semibold tracking-tighter">
              {logo.title}
            </span>
          </Link>
        </div>
        
        <div className="flex gap-2 items-center">
          <div className="flex items-center">
            <NavigationMenu>
              <NavigationMenuList>
                {menu.map((item) => renderMenuItem(item, isActiveMenu))}
              </NavigationMenuList>
            </NavigationMenu>
          </div>
          
          <Separator
            orientation="vertical"
            className="h-8 w-px bg-gray-200 mx-6"
          />
          
          {/* User Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0 hover:ring-2 hover:ring-blue-500/20 transition-all">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="bg-blue-500 text-white font-semibold text-sm">
                    {user.initials}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-64" align="end" sideOffset={4}>
              <div className="flex items-center gap-2 p-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="bg-blue-500 text-white font-semibold text-sm">
                    {user.initials}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col space-y-1">
                  <p className="font-medium text-sm text-gray-900">{user.name}</p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/dashboard/profile" className="cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                className="cursor-pointer text-red-600 focus:text-red-600"
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div className="block lg:hidden fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b shadow-sm">
        <div className="flex items-center justify-between p-4">
          {/* Logo */}
          <Link href={logo.url} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="w-7 h-7 bg-blue-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xs">A</span>
            </div>
            <span className="text-lg font-semibold tracking-tighter">
              {logo.title}
            </span>
          </Link>
          
          <div className="flex items-center gap-2">
            {/* User Avatar Mobile */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full p-0">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback className="bg-blue-500 text-white text-xs font-semibold">
                      {user.initials}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" sideOffset={4}>
                <div className="flex items-center gap-2 p-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback className="bg-blue-500 text-white text-xs font-semibold">
                      {user.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col space-y-1">
                    <p className="font-medium text-sm text-gray-900">{user.name}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  className="cursor-pointer text-red-600 focus:text-red-600"
                  onClick={handleLogout}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="h-8 w-8">
                  <Menu className="size-4" />
                </Button>
              </SheetTrigger>
              <SheetContent className="overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>
                    <Link href={logo.url} className="flex items-center gap-2" onClick={closeSheet}>
                      <div className="w-7 h-7 bg-blue-500 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-xs">A</span>
                      </div>
                      <span className="text-lg font-semibold tracking-tighter">
                        {logo.title}
                      </span>
                    </Link>
                  </SheetTitle>
                </SheetHeader>
                
                <div className="flex flex-col gap-6 p-4">
                  {/* User Info Mobile */}
                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback className="bg-blue-500 text-white font-semibold">
                        {user.initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <p className="font-semibold text-gray-900">{user.name}</p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                  </div>

                  <Accordion
                    type="single"
                    collapsible
                    className="flex w-full flex-col gap-4"
                  >
                    {menu.map((item) => renderMobileMenuItem(item, isActiveMenu, closeSheet))}
                  </Accordion>

                  <div className="flex flex-col gap-3 pt-4 border-t">
                    <Button 
                      variant="outline" 
                      className="w-full justify-start text-red-600 border-red-200 hover:bg-red-50"
                      onClick={() => {
                        closeSheet();
                        handleLogout();
                      }}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Log out
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      {/* Spacer */}
      <div className="h-16 lg:h-20 w-full"></div>
    </>
  );
};

const renderMenuItem = (item: MenuItem, isActiveMenu: (url: string) => boolean) => {
  if (item.items) {
    return (
      <NavigationMenuItem key={item.title}>
        <NavigationMenuTrigger className="hover:bg-muted transition-colors">
          {item.title}
        </NavigationMenuTrigger>
        <NavigationMenuContent className="bg-popover text-popover-foreground">
          {item.items.map((subItem) => (
            <NavigationMenuLink asChild key={subItem.title} className="w-80">
              <SubMenuLink item={subItem} />
            </NavigationMenuLink>
          ))}
        </NavigationMenuContent>
      </NavigationMenuItem>
    );
  }

  return (
    <NavigationMenuItem key={item.title}>
      <NavigationMenuLink
        href={item.url}
        className={cn(
          "bg-background hover:bg-transparent hover:text-accent-foreground group inline-flex h-10 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors",
          isActiveMenu(item.url) && "font-semibold"
        )}
      >
        {item.title}
      </NavigationMenuLink>
    </NavigationMenuItem>
  );
};

const renderMobileMenuItem = (
  item: MenuItem, 
  isActiveMenu: (url: string) => boolean, 
  closeSheet: () => void
) => {
  if (item.items) {
    return (
      <AccordionItem key={item.title} value={item.title} className="border-b-0">
        <AccordionTrigger className="text-md py-0 font-semibold hover:no-underline hover:bg-muted rounded-md px-2">
          {item.title}
        </AccordionTrigger>
        <AccordionContent className="mt-2">
          {item.items.map((subItem) => (
            <SubMenuLink key={subItem.title} item={subItem} onClick={closeSheet} />
          ))}
        </AccordionContent>
      </AccordionItem>
    );
  }

  return (
    <Link 
      key={item.title} 
      href={item.url} 
      className={cn(
        "text-md font-semibold px-2 py-3 rounded-md transition-colors block",
        isActiveMenu(item.url) 
          ? "bg-blue-50 text-blue-700" 
          : "hover:bg-muted"
      )}
      onClick={closeSheet}
    >
      {item.title}
    </Link>
  );
};

const SubMenuLink = ({ 
  item, 
  onClick 
}: { 
  item: MenuItem; 
  onClick?: () => void;
}) => {
  return (
    <Link
      className="hover:bg-muted hover:text-accent-foreground flex select-none flex-row gap-4 rounded-md p-3 leading-none no-underline outline-none transition-colors"
      href={item.url}
      onClick={onClick}
    >
      <div className="text-foreground">{item.icon}</div>
      <div>
        <div className="text-sm font-semibold">{item.title}</div>
        {item.description && (
          <p className="text-muted-foreground text-sm leading-snug">
            {item.description}
          </p>
        )}
      </div>
    </Link>
  );
};

export default NavbarUserDashboard;