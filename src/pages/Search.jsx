import React, { useState, useEffect } from "react";
import { Search, UserPlus } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import SidebarSkeleton from "../Components/skeletons/SidebarSkeleton";
import { fetchSearchedUsers, addFriend } from "../redux/features/otherSlice";
import SearchSkeleton from "../Components/skeletons/SearchSkeleton";
import { useTranslation } from "react-i18next";

const SearchComponent = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { searchedUsers, isLoading } = useSelector((state) => state.other);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  // Debounce logic
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300); // 300ms debounce delay

    return () => {
      clearTimeout(handler); // Clear timeout on query change
    };
  }, [searchQuery]);

  useEffect(() => {
    if (debouncedQuery.trim() !== "") {
      dispatch(fetchSearchedUsers(debouncedQuery));
    }
  }, [debouncedQuery, dispatch]);
console.clear()
  return (
    <div className="h-screen bg-base-200">
      <div className="flex items-center justify-center pt-20 px-4">
        <div className="bg-base-100 rounded-lg shadow-lg w-full max-w-6xl h-[calc(100vh-8rem)]">
          <div className="h-full rounded-lg overflow-hidden flex flex-col">
            {/* Search Bar */}
            <form
              className="flex items-center gap-2 px-4 py-6 border-b border-base-300 bg-base-100"
              onSubmit={(e) => e.preventDefault()} // Prevent default form submission
            >
              <input
                type="text"
                className="flex-1 input input-bordered rounded-lg input-sm sm:input-md"
                placeholder={t("searchUsers")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button
                type="submit"
                className="btn btn-primary btn-sm sm:btn-md flex items-center gap-2"
              >
                <Search size={18} />
                <span className="hidden sm:block">{t("search")}</span>
              </button>
            </form>

            {/* Search Results */}
            {searchedUsers[0] && (
              <div
                className="flex-1 overflow-y-auto bg-primary/5 px-4 py-3"
                style={{ maxHeight: "600px" }}
              >
                {isLoading ? (
                  <SearchSkeleton />
                ) : (
                  searchedUsers.map((user) => (
                    <div
                      key={user._id}
                      className="flex items-center justify-between p-3 bg-base-100 rounded-lg shadow-sm mb-2 hover:shadow-md transition-shadow"
                    >
                      {/* User Info */}
                      <div className="flex items-center gap-3">
                        <img
                          src={user.profilePicture || "/avatar.jpg"}
                          alt={user.name}
                          className="w-12 h-12 object-cover rounded-full"
                        />
                        <div className="text-left">
                          <div className="font-medium truncate">{user.fullName}</div>
                          <div className="text-sm text-zinc-400">{user.email || t("noEmailProvided")}</div>
                        </div>
                      </div>

                      {/* Add Friend Button */}
                      <button
                        className="btn btn-sm btn-circle btn-primary hover:bg-base-300 flex items-center justify-center"
                        onClick={() => dispatch(addFriend(user._id))}
                      >
                        <UserPlus size={18} />
                      </button>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Empty State */}
            {!isLoading && searchedUsers.length === 0 && searchQuery && (
              <div className="flex-1 flex items-center justify-center text-zinc-500">
                {t("nuserf")}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchComponent;
