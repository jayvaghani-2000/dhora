"use client";
import { deleteAccount } from "@/actions/(protected)/profile/deleteAccount";
import { disableAccount } from "@/actions/(protected)/profile/disableAccount";
import CustomDialog from "@/components/shared/custom-dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useAppDispatch } from "@/provider/store";
import { setAuthData } from "@/provider/store/authentication";
import React, { useState } from "react";

const ProfileAction = () => {
  const dispatch = useAppDispatch();
  const [confirmDisableAccount, setConfirmDisableAccount] = useState(false);
  const [confirmDeleteAccount, setConfirmDeleteAccount] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  async function handleDeleteAccount() {
    setLoading(true);
    const res = await deleteAccount();
    if (res.success) {
      toast({
        title: res.data,
      });

      dispatch(
        setAuthData({
          authenticated: false,
        })
      );
      setConfirmDeleteAccount(false);
    } else {
      toast({
        title: res.error,
      });
    }
    setLoading(false);
  }

  async function handleDisableAccount() {
    setLoading(true);
    const res = await disableAccount();
    if (res.success) {
      toast({
        title: res.data,
      });
      dispatch(
        setAuthData({
          authenticated: false,
        })
      );
      setConfirmDisableAccount(false);
    } else {
      toast({
        title: res.error,
      });
    }
    setLoading(false);
  }

  return (
    <div className="mt-5 flex gap-4 flex-col md:flex-row ">
      <Button
        className="bg-rose-700 text-destructive-foreground hover:bg-rose-700/90"
        onClick={() => {
          setConfirmDisableAccount(true);
        }}
        type="button"
      >
        Disable My Account
      </Button>
      <Button
        variant="destructive"
        type="button"
        onClick={() => {
          setConfirmDeleteAccount(true);
        }}
      >
        Delete My Account
      </Button>
      <CustomDialog
        open={confirmDisableAccount}
        title="Disable Account"
        className="w-[500px]"
        onClose={() => {
          setConfirmDisableAccount(false);
        }}
        saveText="Confirm!"
        onSubmit={async () => {
          await handleDisableAccount();
        }}
        saveVariant="destructive"
        disableAction={loading}
      >
        Are you sure, want to disable your account. You can enable by logging in
        again.
      </CustomDialog>
      <CustomDialog
        open={confirmDeleteAccount}
        title="Delete Account"
        className="w-[500px]"
        onClose={() => {
          setConfirmDeleteAccount(false);
        }}
        saveText="Confirm!"
        onSubmit={async () => {
          await handleDeleteAccount();
        }}
        saveVariant="destructive"
        disableAction={loading}
      >
        Are you sure, want to delete your account. This action is not
        reversible.
      </CustomDialog>
    </div>
  );
};

export default ProfileAction;
