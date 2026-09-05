import type { ComponentType, MouseEvent, SVGProps } from "react";

import {
  IconBook,
  IconClose,
  IconDashboardGrid,
  IconFlask,
  IconHelpCircle,
  IconSettings,
  IconSparkles,
  IconUsers,
} from "../icons";
import { Button } from "../ui/Button";
import { cn } from "../../lib/cn";

type IconComponent = ComponentType<SVGProps<SVGSVGElement>>;

type NavigationItem = {
  label: string;
  icon: IconComponent;
};

type SidebarContentProps = {
  onNavigate?: () => void;
  showDrawerHeader?: boolean;
  onClose?: () => void;
};

const navigationItems: NavigationItem[] = [
  { label: "Dashboard", icon: IconDashboardGrid },
  { label: "Wizards", icon: IconUsers },
  { label: "Elixirs", icon: IconFlask },
  { label: "Archives", icon: IconBook },
];

const utilityItems: NavigationItem[] = [
  { label: "Settings", icon: IconSettings },
  { label: "Support", icon: IconHelpCircle },
];

const activeItem = "Dashboard";

export function SidebarContent({
  onNavigate,
  showDrawerHeader = false,
  onClose,
}: SidebarContentProps) {
  const handleNavigation = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    onNavigate?.();
  };

  return (
    <>
      {showDrawerHeader ? (
        <div className="mb-6 flex items-center justify-between">
          <p className="text-sm font-black text-accent-strong">
            Wizarding Registry
          </p>
          <button
            className="flex h-11 w-11 items-center justify-center rounded-full text-body-muted transition-colors hover:bg-primary/10 hover:text-heading"
            type="button"
            aria-label="Close navigation menu"
            onClick={onClose}
          >
            <IconClose className="h-4 w-4" />
          </button>
        </div>
      ) : null}

      <div className="mb-10 p-5 text-center">
        <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-xl bg-linear-to-br from-primary to-accent p-px">
          <div className="flex h-full w-full items-center justify-center rounded-[calc(0.75rem-1px)] bg-surface">
            <IconSparkles className="h-6 w-6 text-primary" />
          </div>
        </div>
        <p className="font-black text-accent-strong">Registry</p>
        <p className="mt-1 text-xs font-medium text-disabled">
          Ministry of Alchemical Records
        </p>
      </div>

      <nav className="flex-1 space-y-2" aria-label="Primary navigation">
        {navigationItems.map(({ label, icon: Icon }) => {
          const isActive = activeItem === label;

          return (
            <a
              key={label}
              href="#"
              onClick={handleNavigation}
              className={cn(
                "flex w-full items-center gap-3 rounded-control px-4 py-3 text-left text-sm font-semibold transition-colors",
                isActive
                  ? "border-r-2 border-accent bg-accent-strong/20 text-accent"
                  : "text-body-muted hover:bg-primary/10 hover:text-primary",
              )}
              aria-current={isActive ? "page" : undefined}
            >
              <Icon className="h-5 w-5 shrink-0" />
              {label}
            </a>
          );
        })}
      </nav>

      <div className="space-y-2">
        <Button variant="secondary" className="mb-6 w-full" onClick={onNavigate}>
          + New Elixir
        </Button>

        {utilityItems.map(({ label, icon: Icon }) => (
          <a
            key={label}
            href="#"
            onClick={handleNavigation}
            className="flex w-full items-center gap-3 rounded-control px-4 py-2 text-left text-sm font-semibold text-body-muted transition-colors hover:bg-primary/10 hover:text-primary"
          >
            <Icon className="h-5 w-5 shrink-0" />
            {label}
          </a>
        ))}
      </div>
    </>
  );
}
