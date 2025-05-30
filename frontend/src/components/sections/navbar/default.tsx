import { Link } from "react-router-dom";
import Navigation from "../../ui/navigation";
import { Button, type ButtonProps } from "../../ui/button";
import {
  Navbar as NavbarComponent,
  NavbarLeft,
  NavbarRight,
} from "../../ui/navbar";
import { Sheet, SheetContent, SheetTrigger } from "../../ui/sheet";
import { Menu } from "lucide-react";
import { ReactNode } from "react";
import NuxtakeUI from "../../logos/nuxtakeUI";
import { ModeToggle } from "../../utils/mode-toggle";

interface NavbarLink {
  text: string;
  href: string;
}

interface NavbarActionProps {
  text: string;
  href: string;
  variant?: ButtonProps["variant"];
  icon?: ReactNode;
  iconRight?: ReactNode;
  isButton?: boolean;
}

interface NavbarProps {
  logo?: ReactNode;
  name?: string;
  homeUrl?: string;
  mobileLinks?: NavbarLink[];
  actions?: NavbarActionProps[];
  showNavigation?: boolean;
  customNavigation?: ReactNode;
}

export default function Navbar({
  logo = <NuxtakeUI className='w-12 h-12' />,
  name = "Nuxtake",
  homeUrl = "/",
  mobileLinks = [
    { text: "Getting Started", href: "/signup" },
    { text: "Github", href: "https://github.com/Jaxsei/" },  // External link stays <a>
  ],
  actions = [
    { text: "Login", href: "/login", isButton: false },
    {
      text: "Get Started",
      href: "/signup",
      isButton: true,
      variant: "default",
    },
  ],
  showNavigation = true,
  customNavigation,
}: NavbarProps) {
  return (
    <header className="sticky top-0 z-50 -mb-4 px-4 pb-4">
      <div className="fade-bottom bg-background/15 absolute left-0 h-24 w-full backdrop-blur-lg"></div>
      <div className="max-w-container relative mx-auto">
        <NavbarComponent>
          <NavbarLeft>
            <Link
              to='/signup'
              className="flex items-center gap-2 text-xl font-bold"
            >
              {logo}
              {name}
            </Link>
            {showNavigation && (customNavigation || <Navigation />)}
          </NavbarLeft>

          <NavbarRight>
            {actions.map(({ text, href, isButton, variant, icon, iconRight }, index) =>
              isButton ? (
                <Button key={index} variant={variant || "default"} asChild>
                  <Link to={href}>
                    {icon}
                    {text}
                    {iconRight}
                  </Link>
                </Button>
              ) : (
                <Link key={index} to={href} className="hidden text-sm md:block">
                  {text}
                </Link>
              )
            )}

            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="shrink-0 md:hidden"
                  aria-label="Toggle menu"
                >
                  <Menu className="size-5" />
                  <span className="sr-only">Toggle navigation menu</span>
                </Button>
              </SheetTrigger>

              <SheetContent side="right">
                <nav className="grid gap-6 text-lg font-medium">
                  <Link
                    to={homeUrl}
                    className="flex items-center gap-2 text-xl font-bold"
                  >
                    <span>{name}</span>
                  </Link>

                  {mobileLinks.map((link, index) =>
                    link.href.startsWith("http") ? (
                      <a
                        key={index}
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-foreground"
                      >
                        {link.text}
                      </a>
                    ) : (
                      <Link
                        key={index}
                        to={link.href}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        {link.text}
                      </Link>
                    )
                  )}

                </nav>
              </SheetContent>
            </Sheet>
            <ModeToggle />
          </NavbarRight>
        </NavbarComponent>
      </div>
    </header>
  );
}
