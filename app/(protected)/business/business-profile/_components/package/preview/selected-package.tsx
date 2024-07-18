"use client";
import { getPackagesType } from "@/actions/_utils/types.type";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Description from "./description";
import Assets from "./assets";
import Pricing from "./pricing";
import { MdOutlineModeEdit } from "react-icons/md";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { RiDeleteBin6Line } from "react-icons/ri";
import { deletePackage } from "@/actions/(protected)/business/packages/deletePackage";
import { useToast } from "@/components/ui/use-toast";
import CustomDialog from "@/components/shared/custom-dialog";

type propType = {
  selectedPackage: getPackagesType["data"];
  readOnly: boolean;
  clearSelection: () => void;
  
};

const SelectedPackage = (prop: propType) => {
  const { selectedPackage, readOnly, clearSelection } = prop;
  const router = useRouter();
  const { toast } = useToast();
  const [deleting, setDeleting] = useState(false);
  const [confirmDeletePackage, setConfirmDeletePackage] = useState(false);
  const packageDetail = selectedPackage?.[0]!;

  const handleDeletePackage = async () => {
    setDeleting(true);
    const res = await deletePackage(packageDetail.id);
    if (res && !res.success) {
      toast({ title: res.error });
    } else {
      clearSelection();
      toast({ title: "Package deleted successfully!" });
    }
    setDeleting(false);
  };

  return (
    <Tabs defaultValue="description" className="relative flex flex-col h-full">
      <div className="p-1 flex flex-col lg:flex-row relative justify-between items-center gap-1 lg:gap-5 bg-muted min-h-10">
        <div className="pl-3 pr-1 text-white font-medium text-sm">
          {packageDetail.name}
        </div>
        <TabsList className="lg:absolute overflow-auto flex items-start justify-start max-w-full w-fit scrollbar-hide   top-1/2 left-1/2 transform lg:-translate-x-1/2 lg:-translate-y-1/2">
          <TabsTrigger value="description">Description</TabsTrigger>
          <TabsTrigger value="assets">Assets</TabsTrigger>
          <TabsTrigger value="pricing">Pricing</TabsTrigger>
        </TabsList>
        {!readOnly ? (
          <div className="absolute lg:relative right-0">
            <>
              <Button
                variant="ghost"
                onClick={e => {
                  setConfirmDeletePackage(true);
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
                  router.push(`packages/${packageDetail.id}`);
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
      <TabsContent value="assets" className="flex-1">
        <Assets {...prop} />
      </TabsContent>
      <TabsContent value="pricing" className="flex-1">
        <Pricing {...prop} />
      </TabsContent>
      <CustomDialog
        open={confirmDeletePackage}
        title="Delete package"
        className="w-[500px]"
        onClose={() => {
          setConfirmDeletePackage(false);
        }}
        saveText="Confirm!"
        onSubmit={async () => {
          await handleDeletePackage();
        }}
        saveVariant="destructive"
        disableAction={deleting}
      >
        Are you sure, want to delete the package{" "}
        <span className="font-bold">{packageDetail.name}</span>?
      </CustomDialog>
    </Tabs>
  );
};

export default SelectedPackage;
