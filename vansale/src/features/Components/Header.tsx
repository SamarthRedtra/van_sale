import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet.tsx";
import { Bell, HandCoins, LogOut, Menu, Truck } from "lucide-react";
import { Button } from "@/components/ui/button.tsx";
import { useState } from "react";
import { useFrappeAuth } from "frappe-react-sdk";
import { useNavigate } from "react-router-dom";

interface HeaderProps {
  title?: string;
}

export default function Header({ title }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { logout } = useFrappeAuth();

  const handleOptionClick = (path: string) => () => {
    setIsMenuOpen(false);

    const updatedPath = "/vansale" + path;
    navigate(updatedPath);
  };

  const handleLogoutClick = () => {
    logout();
    window.location.reload();
  };

  return (
    <div className="flex justify-between items-center p-4">
      <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
        <SheetTrigger>
          <Button variant="ghost" size="icon">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left">
          <SheetHeader>
            <SheetTitle>Menu</SheetTitle>
          </SheetHeader>
          <div className="mt-4 space-y-4">
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={handleOptionClick("")}
            >
              <Truck className="mr-2 h-5 w-5" />
              My Trips
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={handleOptionClick("/payment-due-stops")}
            >
              <HandCoins className="mr-2 h-5 w-5" />
              Payment Due Stops
            </Button>
            {/* <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={handleOptionClick}
            >
              <Settings className="mr-2 h-5 w-5" />
              Settings
            </Button> */}
          </div>
        </SheetContent>
      </Sheet>

      {title && (
        <h2 className="text-xl font-bold flex-1 text-start ml-2">{title}</h2>
      )}

      <div className="flex items-center space-x-2">
        <Button variant="ghost" size="icon">
          <Bell className="h-5 w-5" />
          <span className="sr-only">Notifications</span>
        </Button>
        <Button variant="ghost" size="icon" onClick={handleLogoutClick}>
          <LogOut className="h-5 w-5" />
          <span className="sr-only">Logout</span>
        </Button>
      </div>
    </div>
  );
}
