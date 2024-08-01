import { duplicateTemplate } from "@/actions/(protected)/business/templates";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "@/components/ui/use-toast";
import { TemplateDataContext } from "@/lib/client-only/providers/template-data-provider";
import { useGetTemplates } from "@/lib/hook/useGetTemplates";
import { useContext, useState } from "react";

type DuplicateTemplateDialogProps = {
  id: string;
  open: boolean;
  onOpenChange: (_open: boolean) => void;
};

export const DuplicateTemplateDialog = ({
  id,
  open,
  onOpenChange,
}: DuplicateTemplateDialogProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { refetch } = useContext(TemplateDataContext);
  return (
    <Dialog
      open={open}
      onOpenChange={value => !isLoading && onOpenChange(value)}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Do you want to duplicate this template?</DialogTitle>

          <DialogDescription className="pt-2">
            Your template will be duplicated.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button
            type="button"
            disabled={isLoading}
            variant="secondary"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>

          <Button
            type="button"
            disabled={isLoading}
            onClick={async () => {
              setIsLoading(true);
              try {
                await duplicateTemplate({ id });
                toast({
                  title: "Success",
                  description: "Template duplicated successfully.",
                });
                onOpenChange(false);
                refetch();
              } catch (error) {
                toast({
                  title: "Error",
                  description:
                    "An error occurred while duplicating the template.",
                  variant: "destructive",
                });
              }
              setIsLoading(false);
            }}
          >
            Duplicate
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
