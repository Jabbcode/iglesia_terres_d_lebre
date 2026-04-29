export default function GalleryLoading() {
  return (
    <>
      <section className="bg-cream pt-20 pb-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="bg-muted mx-auto mb-4 h-12 w-80 animate-pulse rounded-lg sm:h-14 sm:w-[28rem]" />
          <div className="bg-muted mx-auto h-5 w-full max-w-xl animate-pulse rounded" />
          <div className="bg-muted mx-auto mt-2 h-5 w-2/3 max-w-md animate-pulse rounded" />
        </div>
      </section>

      <section className="bg-cream pt-10 pb-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="columns-1 gap-4 sm:columns-2 lg:columns-3 xl:columns-4">
            {[
              "aspect-square",
              "aspect-[3/4]",
              "aspect-[4/3]",
              "aspect-square",
              "aspect-[4/3]",
              "aspect-[3/4]",
              "aspect-square",
              "aspect-square",
            ].map((aspect, i) => (
              <div key={i} className="mb-4 break-inside-avoid">
                <div
                  className={`bg-muted w-full animate-pulse rounded-xl ${aspect}`}
                />
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
