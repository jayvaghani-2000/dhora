import Link from "next/link";

export type DataTableTitleProps = {
  row: any;
};

export const DataTableTitle = ({ row }: DataTableTitleProps) => {
  return (
    <Link
      href={`templates/${row.id}`}
      className="block max-w-[10rem] cursor-pointer truncate font-medium hover:underline md:max-w-[20rem]"
    >
      {row.name}
    </Link>
  );
};
