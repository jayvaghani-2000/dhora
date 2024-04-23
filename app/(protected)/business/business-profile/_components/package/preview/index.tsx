import {
  getPackageGroupsType,
  getPackagesType,
} from "@/actions/_utils/types.type";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

type propType = {
  groupedPackages: {
    package_groups_id: string | null;
    package: getPackagesType["data"];
  }[];
  packagesGroups: getPackageGroupsType["data"];
};

const Preview = (prop: propType) => {
  const { groupedPackages, packagesGroups } = prop;

  return (
    <div className="mt-4 flex">
      <div className="w-[250px]">
        <Accordion type="multiple" className="w-full">
          {groupedPackages.map(i =>
            i.package_groups_id ? (
              <AccordionItem
                value={i.package_groups_id as unknown as string}
                key={i.package_groups_id}
              >
                <AccordionTrigger>
                  {
                    packagesGroups?.find(
                      j => (j.id as unknown as string) === i.package_groups_id
                    )?.name
                  }
                </AccordionTrigger>
                <AccordionContent>
                  {i.package?.map(pack => (
                    <div key={pack.id as unknown as string} className="py-1">
                      <button className="text-base hover:underline hover:underline-offset-1">
                        {pack.name}
                      </button>
                    </div>
                  ))}
                </AccordionContent>
              </AccordionItem>
            ) : (
              <div
                key={i.package?.[0].id as unknown as string}
                className="py-1"
              >
                <button className="hover:underline hover:underline-offset-1">
                  {i.package?.[0].name}
                </button>
              </div>
            )
          )}
        </Accordion>
      </div>
      <div className="flex-1">Selected Package preview</div>
    </div>
  );
};

export default Preview;
