import Search from "@/components/shared/Search";
import CategoryFilter from "@/components/shared/CategoryFilter";
import { Button } from "@/components/ui/button";
import { getAllEvents } from "@/lib/actions/event.actions";
import Collection from "@/components/shared/Collection";

interface HomePageProps {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}

export default async function Home({ searchParams }: HomePageProps) {
  const resolvedSearchParams = await searchParams;

  const page = Number(resolvedSearchParams?.page || 1);
  const searchText = resolvedSearchParams?.query || "";
  const category = resolvedSearchParams?.category || "";

  const events = await getAllEvents({
    query: searchText,
    category,
    page,
    limit: 6,
  });

  return (
    <>
      <section className="bg-primary-50 bg-dotted-pattern bg-contain py-5 md:py-5">
        <div className="wrapper grid grid-cols-1 gap-5 md:grid-cls-2 2xl:gap-0">
          <div className="flex flex-col justify-center gap-8">
            <div className="flex flex-col items-center mt-6 lg:mt-20">
              <h1 className="text-4xl sm:text-6xl lg:text-7xl text-center tracking-wide">
                Seamless events,{" "}
                <span className="bg-gradient-to-r from-orange-500 to-red-800 text-transparent bg-clip-text">
                  unforgettable moments!
                </span>
              </h1>

              <p className="mt-10 text-lg text-center text-neutral-500 max-w-4xl">
                Effortless event planning and seamless ticketing—all in one
                place! Create, manage, and sell tickets with ease for any event,
                big or small. Let’s make every occasion unforgettable!
              </p>
            </div>

            <div className="flex justify-center my-10 gap-8">
              <Button className="cursor-pointer button-gradient">
                Explore Events
              </Button>
              <Button className="cursor-pointer">Documentation</Button>
            </div>

            <div className="flex flex-col md:flex-row justify-center w-full md:3/4 items-center mt-10 gap-4 px-4">
              <video
                autoPlay
                loop
                muted
                src="/assets/videos/video1.mp4"
                className="rounded-lg w-full md:w-1/3 max-w-md border-orange-700 shadow-orange-400"
              />
              <video
                autoPlay
                loop
                muted
                src="/assets/videos/video2.mp4"
                className="rounded-lg w-full md:w-1/3 max-w-md border border-orange-700 shadow-orange-400"
              />
            </div>
          </div>
        </div>
      </section>

      <section
        id="events"
        className="wrapper my-8 flex flex-col gap-8 md:gap-12"
      >
        <div className="overflow-x-hidden">
          <div className="whitespace-nowrap animate-scrollText">
            <h2 className="text-xl sm:text-2xl lg:text-3xl tracking-wide inline-block">
              RAW,{" "}
              <span className="bg-gradient-to-r from-purple-500 to-red-800 text-transparent bg-clip-text">
                REAL, REVOLUTIONARY!
              </span>
            </h2>
          </div>
        </div>

        <div className="flex w-full flex-col gap-5 md:flex-row">
          <Search />
          <CategoryFilter />
        </div>

        <Collection
          data={events?.data}
          emptyTitle="No Events Found"
          emptyStateSubtext="Come back later"
          collectionType="All_Events"
          limit={6}
          page={page}
          totalPages={events?.totalPages}
        />
      </section>
    </>
  );
}
