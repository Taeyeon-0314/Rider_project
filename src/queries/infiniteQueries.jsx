import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import { getFeedPages, getFeedsByPageNum } from "../api/feedApi";
import useUserStore from "../store/useUserStore";
import { queryKeys } from "./query.keys";

export const useMyFeedsInfiniteQuery = () => {
  const { user } = useUserStore();
  return useSuspenseInfiniteQuery({
    queryKey: queryKeys.boardController.myFeeds(),
    queryFn: ({ pageParam = 1 }) => getFeedsByPageNum({ pageParam, userId: user.id }),

    getNextPageParam: (lastPage, pages) => {
      return lastPage.length === 5 ? pages.length + 1 : undefined;
    },
    select: (data) => data.pages.flat()
  });
};

export const useAllFeedsInfiniteQuery = () => {
  return useSuspenseInfiniteQuery({
    queryKey: queryKeys.boardController.feeds(),
    queryFn: getFeedPages,
    getNextPageParam: (lastPage, pages) => {
      return lastPage.length === 5 ? pages.length + 1 : undefined;
    },
    select: (data) => data.pages.flat()
  });
};
