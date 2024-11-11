import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog.tsx";
import { useState } from "react";

interface ConfirmationCompProps {
  children?: React.ReactNode;
  isOpen?: boolean;
  dialogTitle: string;
  dialogDescription?: string;
  dialogCTAText: string;
  disabled?: boolean;
  handleClick: () => void;
}

export default function ConfirmationComp({
  children,
  isOpen,
  dialogCTAText,
  dialogTitle,
  dialogDescription,
  disabled,
  handleClick,
}: ConfirmationCompProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(isOpen || false);

  const onClick = () => {
    if (!disabled) {
      setIsDialogOpen(false);
      handleClick();
    }
  };

  return (
    <div>
      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        {children && (
          <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
        )}
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {dialogTitle || "Are you sure?"}
            </AlertDialogTitle>
            {dialogDescription && (
              <AlertDialogDescription>
                {dialogDescription}
              </AlertDialogDescription>
            )}
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsDialogOpen(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={onClick}>
              {dialogCTAText || "Confirm"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
