"use client";
import { getAddOnsType, getPackagesType } from "@/actions/_utils/types.type";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Description from "./description";
import Pricing from "./pricing";
import { MdOutlineModeEdit } from "react-icons/md";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { RiDeleteBin6Line } from "react-icons/ri";
import { useToast } from "@/components/ui/use-toast";
import { deleteAddOn } from "@/actions/(protected)/business/add-ons/deleteAddOn";
import CustomDialog from "@/components/shared/custom-dialog";

type propType = {
  selectedAddOn: getAddOnsType["data"];
  readOnly: boolean;
  clearSelection: () => void;
};

const SelectedAddOn = (prop: propType) => {
  const { selectedAddOn, readOnly = false, clearSelection } = prop;
  const router = useRouter();
  const { toast } = useToast();
  const [deleting, setDeleting] = useState(false);
  const [confirmDeleteAddOn, setConfirmDeleteAddOn] = useState(false);
  const addOnDetail = selectedAddOn?.[0]!;

  const handleDeleteAddOn = async () => {
    setDeleting(true);
    const res = await deleteAddOn(addOnDetail.id);
    if (res && !res.success) {
      toast({ title: res.error });
    } else {
      clearSelection();
      toast({ title: "Add on deleted successfully!" });
    }
    setDeleting(false);
  };

  return (
    <Tabs defaultValue="description" className="relative flex flex-col h-full">
      <div className="p-1 flex flex-col lg:flex-row relative justify-between items-center gap-1 lg:gap-5 bg-muted min-h-10">
        <div className="pl-3 pr-1 text-white font-medium text-sm">
          {addOnDetail.name}
        </div>
        <TabsList className="lg:absolute overflow-auto flex items-start justify-start max-w-full w-fit scrollbar-hide   top-1/2 left-1/2 transform lg:-translate-x-1/2 lg:-translate-y-1/2">
          <TabsTrigger value="description">Description</TabsTrigger>
          <TabsTrigger value="pricing">Pricing</TabsTrigger>
        </TabsList>
        {!readOnly ? (
          <div className="absolute lg:relative right-0">
            <>
              <Button
                variant="ghost"
                onClick={e => {
                  setConfirmDeleteAddOn(true);
                }}
                disabled={deleting}
                className="p-1"
              >
                <RiDeleteBin6Line
                  color="#fff"
                  className="h-4 lg:h-6 w-4 lg:w-6"
                />
              </Button>
              <Button
                variant="ghost"
                onClick={e => {
                  router.push(`add-ons/${addOnDetail.id}`);
                }}
                disabled={deleting}
                className="p-1"
              >
                <MdOutlineModeEdit
                  color="#fff"
                  className="h-4 lg:h-6 w-4 lg:w-6"
                />
              </Button>
            </>
          </div>
        ) : null}
      </div>
      <TabsContent value="description" className="flex-1">
        <Description {...prop} />
      </TabsContent>

      <TabsContent value="pricing" className="flex-1">
        <Pricing {...prop} />
      </TabsContent>
      <CustomDialog
        open={confirmDeleteAddOn}
        title="Delete add on"
        className="w-[500px]"
        onClose={() => {
          setConfirmDeleteAddOn(false);
        }}
        saveText="Confirm!"
        onSubmit={async () => {
          await handleDeleteAddOn();
        }}
        saveVariant="destructive"
        disableAction={deleting}
      >
        Are you sure, want to delete the add on{" "}
        <span className="font-bold">{addOnDetail.name}</span>?
      </CustomDialog>
    </Tabs>
  );
};

export default SelectedAddOn;
