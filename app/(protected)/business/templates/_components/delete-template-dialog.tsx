import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useContext, useState } from "react";
import { deleteTemplate } from "@/actions/(protected)/business/templates";
import { toast } from "@/components/ui/use-toast";
import { TemplateDataContext } from "@/lib/client-only/providers/template-data-provider";

type DeleteTemplateDialogProps = {
  id: string;
  open: boolean;
  onOpenChange: (_open: boolean) => void;
};

export const DeleteTemplateDialog = ({
  id,
  open,
  onOpenChange,
}: DeleteTemplateDialogProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { refetch } = useContext(TemplateDataContext);

  return (
    <Dialog
      open={open}
      onOpenChange={value => !isLoading && onOpenChange(value)}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Do you want to delete this template?</DialogTitle>

          <DialogDescription>
            Please note that this action is irreversible. Once confirmed, your
            template will be permanently deleted.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button
            type="button"
            variant="secondary"
            disabled={isLoading}
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>

          <Button
            type="button"
            variant="destructive"
            disabled={isLoading}
            onClick={async () => {
              setIsLoading(true);
              try {
                const result = await deleteTemplate({ id });
                toast({
                  title: "Success",
                  description: "Template deleted successfully.",
                });
                onOpenChange(false);
                refetch();
              } catch (error) {
                toast({
                  title: "Error",
                  description: "An error occurred while deleting the template.",
                  variant: "destructive",
                });
              }
              setIsLoading(false);
            }}
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
