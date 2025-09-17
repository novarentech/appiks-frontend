import { Book, Menu, Sunset, Trees, Zap } from "lucide-react";

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
import Link from "next/link";
import Image from "next/image";
import { Separator } from "@radix-ui/react-separator";

interface MenuItem {
  title: string;
  url: string;
  description?: string;
  icon?: React.ReactNode;
  items?: MenuItem[];
}

interface NavbarProps {
  logo?: {
    url: string;
    src: string;
    alt: string;
    title: string;
  };
  menu?: MenuItem[];
  auth?: {
    login: {
      title: string;
      url: string;
    };
  };
}

const NavbarLandingPage = ({
  logo = {
    url: "/",
    src: "/logo.webp",
    alt: "Appiks-logo",
    title: "Appiks",
  },
  menu = [
    { title: "Home", url: "#" },
    {
      title: "Feature",
      url: "#",
      items: [
        {
          title: "Pantau Mood Harian",
          description: "Catat perasaan harian dan dapatkan insight emosimu",
          icon: <Book className="size-5 shrink-0" />,
          url: "#",
        },
        {
          title: "Self Help",
          description: "Akses tips kelola emosi & anger management",
          icon: <Zap className="size-5 shrink-0" />,
          url: "#",
        },
        {
          title: "Lapor Masalah",
          description: "Laporkan bullying/kekerasan dengan aman",
          icon: <Trees className="size-5 shrink-0" />,
          url: "#",
        },
        {
          title: "Konten Edukasi",
          description: "Pelajari kesehatan mental, anti-bullying & toleransi",
          icon: <Sunset className="size-5 shrink-0" />,
          url: "#",
        },
        {
          title: "Rekap Mood",
          description: "Lihat grafik perkembangan mood mingguan/bulanan",
          icon: <Sunset className="size-5 shrink-0" />,
          url: "#",
        },
        {
          title: "Motivasi Harian",
          description: "Terima kata motivasi & quote inspiratif harian",
          icon: <Sunset className="size-5 shrink-0" />,
          url: "#",
        },
      ],
    },
    {
      title: "Why Choose Us",
      url: "#",
    },
    {
      title: "Testimonial",
      url: "#",
    },
  ],
  auth = {
    login: { title: "Login", url: "/login" },
  },
}: NavbarProps) => {
  return (
    <>
      {/* Desktop Menu */}
      <nav className="fixed top-5 left-0 right-0 z-50 hidden justify-between lg:flex border rounded-full py-4 px-10 bg-background container mx-auto ">
        <div className="flex items-center gap-6">
          {/* Logo */}
          <Link href={logo.url} className="flex items-center gap-2">
            <Image
              src={logo.src}
              width={100}
              height={100}
              className="max-h-10 max-w-10 dark:invert"
              alt={logo.alt}
            />
            <span className="text-lg font-semibold tracking-tighter text-[#4F46E5]">
              {logo.title}
            </span>
          </Link>
        </div>
        <div className="flex gap-2 items-center">
          <div className="flex items-center">
            <NavigationMenu>
              <NavigationMenuList>
                {menu.map((item) => renderMenuItem(item))}
              </NavigationMenuList>
            </NavigationMenu>
          </div>
          <Separator
            orientation="vertical"
            className="h-8 w-px bg-gray-200 mx-6"
          />
          <Button asChild className="rounded-full">
            <Link href={auth.login.url}>{auth.login.title}</Link>
          </Button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div className="block lg:hidden fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b">
        <div className="flex items-center justify-between p-4">
          {/* Logo */}
          <Link href={logo.url} className="flex items-center gap-2">
            <Image
              src={logo.src}
              width={100}
              height={100}
              className="max-h-10 max-w-10 dark:invert"
              alt={logo.alt}
            />
            <span className="text-lg font-semibold tracking-tighter text-[#4F46E5]">
              {logo.title}
            </span>
          </Link>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="size-4" />
              </Button>
            </SheetTrigger>
            <SheetContent className="overflow-y-auto">
              <SheetHeader>
                <SheetTitle>
                  <Link href={logo.url} className="flex items-center gap-2">
                    <Image
                      src={logo.src}
                      width={100}
                      height={100}
                      className="max-h-10 max-w-10 dark:invert text-[#4F46E5]"
                      alt={logo.alt}
                    />
                    <span className="text-lg font-semibold tracking-tighter text-[#4F46E5]">
                      {logo.title}
                    </span>
                  </Link>
                </SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-6 p-4">
                <Accordion
                  type="single"
                  collapsible
                  className="flex w-full flex-col gap-4"
                >
                  {menu.map((item) => renderMobileMenuItem(item))}
                </Accordion>

                <div className="flex flex-col gap-3">
                  <Button asChild variant="outline">
                    <Link href={auth.login.url}>{auth.login.title}</Link>
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </>
  );
};

const renderMenuItem = (item: MenuItem) => {
  if (item.items) {
    return (
      <NavigationMenuItem key={item.title}>
        <NavigationMenuTrigger>{item.title}</NavigationMenuTrigger>
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
        className="bg-background hover:bg-muted hover:text-accent-foreground group inline-flex h-10 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors "
      >
        {item.title}
      </NavigationMenuLink>
    </NavigationMenuItem>
  );
};

const renderMobileMenuItem = (item: MenuItem) => {
  if (item.items) {
    return (
      <AccordionItem key={item.title} value={item.title} className="border-b-0">
        <AccordionTrigger className="text-md py-0 font-semibold hover:no-underline">
          {item.title}
        </AccordionTrigger>
        <AccordionContent className="mt-2">
          {item.items.map((subItem) => (
            <SubMenuLink key={subItem.title} item={subItem} />
          ))}
        </AccordionContent>
      </AccordionItem>
    );
  }

  return (
    <Link key={item.title} href={item.url} className="text-md font-semibold">
      {item.title}
    </Link>
  );
};

const SubMenuLink = ({ item }: { item: MenuItem }) => {
  return (
    <Link
      className="hover:bg-muted hover:text-accent-foreground flex select-none flex-row gap-4 rounded-md p-3 leading-none no-underline outline-none transition-colors"
      href={item.url}
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

export { NavbarLandingPage };
