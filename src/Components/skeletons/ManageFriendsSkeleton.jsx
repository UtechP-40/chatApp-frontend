import { Users, UserMinus } from "lucide-react";
import "../../styles/skeleton.css"
const ManageFriendsSkeleton = () => {
  // Create 8 skeleton items
  const skeletonFriends = Array(8).fill(null);

  return (
    <div className="min-h-screen bg-base-200 flex flex-col items-center py-8 px-4">
      {/* Page Title */}
      <h1 className="text-2xl font-bold mb-6">Manage Friends</h1>

      {/* Skeleton Friends List */}
      <section className="w-full max-w-3xl bg-base-100 rounded-lg shadow-lg p-6 mb-8">
        {/* Header */}
        <div className="flex items-center gap-2 mb-4">
          <Users className="w-6 h-6 text-primary" />
          <span className="text-lg font-semibold">Friends</span>
        </div>

        {/* Skeleton Contact Items */}
        <div className="overflow-y-auto max-h-[400px] w-full py-3">
          {skeletonFriends.map((_, idx) => (
            <div key={idx} className="w-full p-3 flex items-center justify-between gap-3 border-b border-base-300">
              {/* Avatar skeleton */}
              <div className="relative">
                <div className="skeleton size-12 rounded-full" />
              </div>

              {/* User info skeleton */}
              <div className="flex-1 pl-4">
                <div className="skeleton h-4 w-32 mb-2" />
                <div className="skeleton h-3 w-20" />
              </div>

              {/* Remove Friend Skeleton */}
              <div className="relative flex items-center justify-center">
                <div className="skeleton size-8 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default ManageFriendsSkeleton;
