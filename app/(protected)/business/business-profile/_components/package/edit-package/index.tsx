"use client";
import {
  getPackageDetailsType,
  getPackageGroupsType,
} from "@/actions/_utils/types.type";
import BackButton from "@/components/shared/back-button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React, { useState } from "react";
import AssetsManagement from "./assets-management";
import Description from "./description";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { editPackageSchema } from "@/db/schema";
import Pricing from "./pricing";
import { Button } from "@/components/ui/button";
import { RiDeleteBin6Line } from "react-icons/ri";
import { Separator } from "@/components/ui/separator";
import Spinner from "@/components/shared/spinner";
import { useToast } from "@/components/ui/use-toast";
import { updatePackageDetail } from "@/actions/(protected)/business/packages/updatePackageDetail";
import { deletePackage } from "@/actions/(protected)/business/packages/deletePackage";
import { useParams } from "next/navigation";
import CustomDialog from "@/components/shared/custom-dialog";

type propType = {
  packageDetail: getPackageDetailsType["data"];
  packagesGroups: getPackageGroupsType["data"];
};

const EditPackage = (props: propType) => {
  const params = useParams();
  const { packageDetail } = props;
  const [deleting, setDeleting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [confirmDeletePackage, setConfirmDeletePackage] = useState(false);
  const { toast } = useToast();
  const { id, assets, created_at, deleted, updated_at, ...packageInfo } =
    packageDetail!;

  const form = useForm<z.infer<typeof editPackageSchema>>({
    resolver: zodResolver(editPackageSchema),
    defaultValues: {
      ...packageInfo,
      id: id,
      name: packageInfo.name as string,
      description: packageInfo.description as string,
      fixed_priced: packageInfo.fixed_priced as boolean,
      package_group_id: packageInfo.package_group_id,
      deposit_type: packageInfo.deposit_type ?? "fixed",
    },
  });

  const handleDeletePackage = async () => {
    setDeleting(true);
    const res = await deletePackage(params.slug as string);
    if (res && !res.success) {
      toast({ title: res.error });
    } else {
      toast({ title: "Package deleted successfully!" });
    }
    setDeleting(false);
  };

  const handleUpdatePackage = async () => {
    await form.trigger();
    if (form.formState.isValid) {
      setLoading(true);
      const res = await updatePackageDetail(form.getValues());

      if (res && !res.success) {
        toast({ title: res.error });
      } else {
        toast({ title: "Package updated successfully!" });
      }

      setLoading(false);
    } else {
      const error = form.formState.errors;

      console.log("error", error);

      const errorMsg = Object.values(error);
      const errorMsgKey = Object.keys(error);
      if (errorMsg[0]) {
        toast({
          title:
            errorMsg[0].message ??
            `Error in ${errorMsgKey[0].replace(/_/g, " ")}`,
        });
      }
    }
  };

  return (
    <Tabs defaultValue="description">
      <BackButton to="/business/business-profile/packages" />
      <div className="flex justify-between gap-2 flex-col md:flex-row">
        <div className="flex relative gap-4 items-center mt-2 flex-col md:flex-row">
          <div className="text-white font-medium text-base">
            {packageInfo.name}
          </div>
          <TabsList className="overflow-auto flex items-start justify-start max-w-full w-fit scrollbar-hide">
            <TabsTrigger value="description">Description</TabsTrigger>
            <TabsTrigger value="assets">Assets</TabsTrigger>
            <TabsTrigger value="pricing">Pricing</TabsTrigger>
          </TabsList>
        </div>
        <div className="flex gap-2 justify-center items-center">
          <Button
            variant="outline"
            className="p-1 h-[28px]"
            disabled={loading || deleting}
            onClick={() => {
              setConfirmDeletePackage(true);
            }}
          >
            <RiDeleteBin6Line size={18} color="#b6b6b6" />
          </Button>
          <Separator orientation="vertical" className="w-0.5 h-8" />
          <Button
            onClick={handleUpdatePackage}
            disabled={loading || deleting}
            className="h-fit lg:h-auto"
          >
            Save {loading && <Spinner type="inline" />}
          </Button>
        </div>
      </div>
      <TabsContent value="description">
        <Description form={form} {...props} />
      </TabsContent>
      <TabsContent value="assets">
        <AssetsManagement {...props} />
      </TabsContent>
      <TabsContent value="pricing">
        <Pricing form={form} {...props} />
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
        <span className="font-bold">{packageInfo.name}</span>?
      </CustomDialog>
    </Tabs>
  );
};

export default EditPackage;
