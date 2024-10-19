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
  children: React.ReactNode;
  dialogTitle: string;
  dialogDescription?: string;
  dialogCTAText: string;
  handleClick: () => void;
}

export default function ConfirmationComp({
  children,
  dialogCTAText,
  dialogTitle,
  dialogDescription,
  handleClick,
}: ConfirmationCompProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <div>
      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
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
            <AlertDialogAction onClick={handleClick}>
              {dialogCTAText || "Confirm"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
