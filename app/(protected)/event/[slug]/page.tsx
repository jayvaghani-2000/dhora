import { redirect } from "next/navigation";

type propType = { params: { slug: string }; searchParams: {} };

export default async function Page(prop: propType) {
  redirect(`/event/${prop.params.slug}/contracts`);
}
