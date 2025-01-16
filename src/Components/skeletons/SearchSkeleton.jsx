import { Search, UserPlus } from "lucide-react";
import "../../styles/skeleton.css"

const SearchSkeleton = () => {
  // Create 5 skeleton items for search results
  const skeletonSearchResults = Array(5).fill(null);

  return (
    <div className="min-h-screen bg-base-200 flex flex-col items-center py-8 px-4">
      <div className="w-full max-w-6xl bg-base-100 rounded-lg shadow-lg p-6 mb-8">
        {/* Search Bar */}
        <form
          className="flex items-center gap-2 px-4 py-6 border-b border-base-300 bg-base-100"
        >
          <div className="flex-1 skeleton h-10 w-full rounded-lg"></div>
          <div className="skeleton h-10 w-24 rounded-lg"></div>
        </form>

        {/* Skeleton Search Results */}
        <div
          className="flex-1 overflow-y-auto bg-primary/5 px-4 py-3"
          style={{ maxHeight: "600px" }}
        >
          {skeletonSearchResults.map((_, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-3 bg-base-100 rounded-lg shadow-sm mb-2"
            >
              {/* User Info Skeleton */}
              <div className="flex items-center gap-3">
                <div className="skeleton size-12 rounded-full"></div>
                <div className="text-left w-1/2">
                  <div className="skeleton h-4 w-32 mb-2"></div>
                  <div className="skeleton h-3 w-20"></div>
                </div>
              </div>

              {/* Add Friend Button Skeleton */}
              <div className="flex items-center justify-center">
                <div className="skeleton size-8 rounded-full"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchSkeleton;