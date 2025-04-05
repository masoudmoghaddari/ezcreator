import Hero from "@/components/hero";

export default async function Home() {
  return (
    <>
      <div className="flex flex-col gap-20 p-5">
        <Hero />
      </div>
    </>
  );
}
