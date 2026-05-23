import { ReactNode } from "react";
import { Logo } from "./Logo";
import { MapPin, MessageCircle, Search, Home, User } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

export const AppShell = ({
  children,
  hideTopBar = false,
}: {
  children: ReactNode;
  hideTopBar?: boolean;
}) => {
  const location = useLocation();
  const navigate = useNavigate();

  const tabs = [
    { icon: Home, path: "/" },
    { icon: Search, path: "/" },
    { icon: MapPin, path: "/firm" },
    { icon: MessageCircle, path: "/confirmation" },
    { icon: User, path: "/" },
  ];

  return (
    <div className="mobile-frame gradient-surface text-foreground flex flex-col">
      {!hideTopBar && (
        <header className="sticky top-0 z-40 flex items-center gap-3 px-5 pt-5 pb-3 bg-background/80 backdrop-blur-xl border-b border-border/50">
          <Logo className="h-9 w-9" />
          <div className="leading-none">
            <h1 className="font-display text-lg text-foreground">FALCON</h1>
            <p className="text-[10px] text-primary font-poppins italic tracking-wider">
              Precision from Every Peak
            </p>
          </div>
        </header>
      )}
      <main className="flex-1 pb-24">{children}</main>
      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[440px] z-50 px-4 pb-3">
        <div className="flex items-center justify-around bg-card/95 backdrop-blur-xl border border-border rounded-2xl shadow-card-elegant py-2">
          {tabs.map((t, i) => {
            const Icon = t.icon;
            const active = location.pathname === t.path && i === 0;
            return (
              <button
                key={i}
                onClick={() => navigate(t.path)}
                className={cn(
                  "p-3 rounded-xl transition-all",
                  active
                    ? "gradient-primary text-primary-foreground shadow-pin"
                    : "text-muted-foreground hover:text-foreground"
                )}
                aria-label="navigate"
              >
                <Icon className="h-5 w-5" />
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
};
