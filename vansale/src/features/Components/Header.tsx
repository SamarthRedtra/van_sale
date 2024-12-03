import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet.tsx";
import {
  Bell,
  BellDot,
  HandCoins,
  LogOut,
  Menu,
  Receipt,
  House,
  Truck,
  Ban,
  ReceiptText
} from "lucide-react";
import { Button } from "@/components/ui/button.tsx";
import { useEffect, useState } from "react";
import { useFrappeAuth } from "frappe-react-sdk";
import { useNavigate } from "react-router-dom";
import {getNotificationsList, getCurrentUser} from "@/services/getNotificationsList";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar,AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import markNotificationToRead from "@/services/markNotifiactionToRead";
import { parseISO, formatDistanceToNow } from "date-fns";
import logout from "@/services/logout";
import Cookies from "js-cookie";


interface HeaderProps {
  title?: string;
}

export default function Header({ title }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUnreadMsgFound, setIsUnreadMsgFound] = useState(false);
  const [notificationsList, setNotificationsList] = useState([]);
  const [selectedPos, setSelectedPos] = useState<string | null>(null);
  const [userInfo, setUserInfo] = useState<any>(null);

  const navigate = useNavigate();
  const { currentUser} = useFrappeAuth()
  


  const handleOptionClick = (path: string) => () => {
    setIsMenuOpen(false);
    console.log(path,"99")
    const updatedPath = "/vansale" + path;
    navigate(updatedPath);
  };

  const handleLogoutClick = async () => {
    if (currentUser) {
      await logout(currentUser);
      navigate("/vansale/login");
    }
  };

  useEffect(() => {
    const handleShowNotifications = async () => {
      const list = await getNotificationsList();
      setNotificationsList(list?.message?.notification_logs ?? []);
      const pos = Cookies.get("selectedPosProfile");
      setSelectedPos(pos);
      const user_info = await getCurrentUser();
      setUserInfo(user_info.message);
      console.log(userInfo);




    };
    handleShowNotifications();
  }, []);

  useEffect(() => {
    notificationsList.forEach((notification) => {
      if (!notification?.read) {
        setIsUnreadMsgFound(true);
      }
    });
  }, [notificationsList]);

  const handleClickNotifications =
    (deliveryTrip: string, notificationId: string) => async () => {
      await markNotificationToRead(notificationId);
      navigate("/vansale/delivery-trip/" + deliveryTrip);
    };

  function formatRelativeTime(timestamp: string): string {
    const date = parseISO(timestamp);
    return formatDistanceToNow(date, { addSuffix: true });
  }

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
        <div className="flex items-center space-x-4 mb-4">
      
            

            {/* Greeting with Emoji */}
            <div className="text-lg font-medium flex items-center">
             <span className="font-bold mr-1"> {userInfo?.full_name || "Guest"}</span>  Hello 👋
            </div>
          </div>
          <SheetHeader>
            <SheetTitle>Menu</SheetTitle>
          </SheetHeader>
          <div className="mt-4 space-y-4">
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={handleOptionClick("/")}>
              <House className="mr-2 h-5 w-5" />Home
          </Button>
            {/* <Button
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
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={handleOptionClick("/cancelled-stops")}
            >
              <Ban className="mr-2 h-5 w-5" />
              Cancelled Stops
            </Button> */}
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={handleOptionClick("/pos-invoice") }
              
            >
              <Receipt className="mr-2 h-5 w-5" />
            POS Invoice
            </Button>
            
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={handleOptionClick("/s-invoice") }
              
            >
              <ReceiptText className="mr-2 h-5 w-5" />
            Sales Invoice
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      {title && (
        <h2 className="text-xl font-bold flex-1 text-start ml-2">{title}</h2>
      )}

      <div className="flex items-center space-x-2">
        {selectedPos && (
         <span className="inline-flex items-center rounded-full bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-500 px-3 py-1 text-xs font-medium text-white shadow-sm animate-pulse">
         {selectedPos}
       </span>
        )}

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon">
              {isUnreadMsgFound && <BellDot className="h-5 w-5" />}
              {!isUnreadMsgFound && <Bell className="h-5 w-5" />}
              <span className="sr-only">Notifications</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 mx-3 p-0.5 bg-white/80 backdrop-blur-sm shadow-lg rounded-lg border border-gray-200">
            <ScrollArea className="h-[300px]">
              {notificationsList.map((notification, index: number) => (
                <div
                  key={index}
                  className="flex items-start gap-4 p-4 border-b last:border-b-0 relative cursor-pointer"
                  onClick={handleClickNotifications(
                    notification?.document_name ?? "",
                    notification?.name ?? ""
                  )}
                >
                  {!notification?.read && (
                    <div className="h-1 w-1 rounded-full bg-green-600 absolute left-2 top-7" />
                  )}
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-green-100 text-green-600">
                      {notification?.from_user?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col gap-1">
                    <div
                      className="text-xs w-60"
                      dangerouslySetInnerHTML={{
                        __html: notification?.subject,
                      }}
                    >
                      {/* <p className="text-sm font-medium leading-none">{notification.title}</p>
                    <p className="text-sm text-muted-foreground">{notification.description}</p>
                    <p className="text-xs text-muted-foreground">{notification.time}</p> */}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {formatRelativeTime(notification.creation)}
                    </p>
                  </div>
                </div>
              ))}
            </ScrollArea>
          </PopoverContent>
        </Popover>

        <Button variant="ghost" size="icon" onClick={handleLogoutClick}>
          <LogOut className="h-5 w-5" />
          <span className="sr-only">Logout</span>
        </Button>
           <Avatar title={userInfo?.full_name+"\n"+userInfo?.email}>
              <AvatarImage
                src={userInfo?.user_image || ""}
                alt={userInfo?.full_name || "User Avatar"}
              />
              <AvatarFallback >
                {userInfo?.full_name
                  ? userInfo.full_name
                      .split(" ")
                      .map((word) => word[0])
                      .join("")
                      .toUpperCase()
                  : "U"}
              </AvatarFallback>
            </Avatar>
      </div>
    </div>
  );
}
