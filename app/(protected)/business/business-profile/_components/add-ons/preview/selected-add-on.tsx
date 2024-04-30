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
  const addOnDetail = selectedAddOn?.[0]!;

  const handleDeleteAddOn = async () => {
    setDeleting(true);
    const res = await deleteAddOn(addOnDetail.id as unknown as string);
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
      <div className="flex relative justify-between items-center gap-5 bg-muted">
        <div className="pl-3 pr-1 text-white font-medium text-base">
          {addOnDetail.name}
        </div>
        <TabsList className="absolute overflow-auto flex items-start justify-start max-w-full w-fit scrollbar-hide   top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <TabsTrigger value="description">Description</TabsTrigger>
          <TabsTrigger value="pricing">Pricing</TabsTrigger>
        </TabsList>
        <div className="h-10">
          {!readOnly ? (
            <>
              <Button
                variant="ghost"
                onClick={e => {
                  handleDeleteAddOn();
                }}
                disabled={deleting}
                className="px-2"
              >
                <RiDeleteBin6Line color="#fff" className="h-6 w-6" />
              </Button>
              <Button
                variant="ghost"
                onClick={e => {
                  router.push(`add-ons/${addOnDetail.id}`);
                }}
                disabled={deleting}
                className="px-2"
              >
                <MdOutlineModeEdit color="#fff" className="h-6 w-6" />
              </Button>
            </>
          ) : null}
        </div>
      </div>
      <TabsContent value="description" className="flex-1">
        <Description {...prop} />
      </TabsContent>

      <TabsContent value="pricing" className="flex-1">
        <Pricing {...prop} />
      </TabsContent>
    </Tabs>
  );
};

export default SelectedAddOn;
