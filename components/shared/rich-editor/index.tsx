"use client";
import dynamic from "next/dynamic";
import React from "react";
import "react-quill/dist/quill.snow.css";
import "./rich-editor.css";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

type propType = {
  value: string;
  onChange: (value: string) => void;
};

const RichEditor = (props: propType) => {
  const modules = {
    toolbar: [["bold", "italic"]],
  };
  const formats = ["bold", "italic"];

  return (
    <div className="quillWrapper">
      <ReactQuill
        placeholder="Description"
        value={props.value}
        modules={modules}
        formats={formats}
        onChange={value => {
          props.onChange(value);
        }}
      />
    </div>
  );
};

export default RichEditor;
