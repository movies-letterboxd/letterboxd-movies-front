// components/MovieSkeleton.tsx
export default function MovieSkeleton() {
  return (
    <div className="max-w-6xl mx-auto p-6 py-20 text-gray-100 animate-pulse">
      <div className="grid md:grid-cols-3 gap-6">
        {/* Poster y plataformas */}
        <div className="col-span-1 space-y-4">
          <div className="w-full h-[450px] bg-gray-700 rounded-lg"></div>

          <div>
            <div className="h-6 bg-gray-700 w-32 rounded mb-3"></div>
            <div className="flex gap-3 flex-wrap">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="w-24 h-10 bg-gray-700 rounded-lg"
                ></div>
              ))}
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="col-span-2 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <div className="h-10 w-3/5 bg-gray-700 rounded"></div>
              <div className="flex gap-3">
                <div className="h-8 w-20 bg-gray-700 rounded"></div>
              </div>
            </div>

            <div className="mt-3 h-5 w-1/2 bg-gray-700 rounded"></div>

            <div className="flex items-center gap-2 mt-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="w-6 h-6 bg-gray-700 rounded"></div>
              ))}
              <div className="h-4 w-10 bg-gray-700 rounded ml-2"></div>
            </div>

            <div className="mt-5 space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-4 bg-gray-700 rounded w-full"></div>
              ))}
            </div>

            <div className="mt-6">
              <div className="h-6 w-28 bg-gray-700 rounded mb-3"></div>
              <div className="flex gap-2 flex-wrap">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-[160px] h-12 bg-gray-700 rounded-lg"
                  ></div>
                ))}
              </div>
            </div>
          </div>

          {/* Elenco */}
          <div className="col-span-3 mt-8">
            <div className="h-6 w-32 bg-gray-700 rounded mb-4"></div>
            <div className="flex gap-6 overflow-x-auto pb-4">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="w-[160px] flex-shrink-0 bg-gray-700 rounded-lg p-5 flex flex-col items-center"
                >
                  <div className="w-24 h-24 bg-gray-600 rounded-full mb-2"></div>
                  <div className="h-4 w-20 bg-gray-600 rounded mb-1"></div>
                  <div className="h-3 w-16 bg-gray-600 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
