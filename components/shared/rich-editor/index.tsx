"use client";
import dynamic from "next/dynamic";
import React from "react";
import "react-quill/dist/quill.snow.css";
import "./rich-editor.css";
import { ReactQuillProps } from "react-quill";
import clsx from "clsx";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

type propType = {
  onChange?: (value: string) => void;
} & Omit<ReactQuillProps, "onChange">;

const RichEditor = (props: propType) => {
  const { onChange, readOnly = false, ...rest } = props;
  const modules = {
    toolbar: [["bold", "italic"]],
  };
  const formats = ["bold", "italic"];

  return (
    <div
      className={clsx({
        quillWrapper: !readOnly,
        "readOnly-quillWrapper": readOnly,
      })}
    >
      <ReactQuill
        placeholder="Description"
        modules={modules}
        formats={formats}
        onChange={value => {
          !!onChange && onChange(value);
        }}
        onKeyDown={event => {
          if (event.key === "Enter") {
            event.stopPropagation();
          }
        }}
        readOnly={readOnly}
        {...rest}
      />
    </div>
  );
};

export default RichEditor;
