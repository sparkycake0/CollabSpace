"use client";
import { useAtomValue } from "jotai";
import { userAtom, loadingAtom } from "@/atoms/auth";
import { Skeleton } from "./ui/skeleton";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import type { EmailVerificationProps } from "@/interfaces";

export function UserName({
  className,
  skeletonStyle,
  notFound,
  found,
}: {
  className: string;
  skeletonStyle: string;
  notFound: React.ReactNode;
  found: React.ReactNode;
}) {
  const user = useAtomValue(userAtom);
  const loading = useAtomValue(loadingAtom);

  return (
    <div className={`${className}`}>
      {loading ? (
        <Skeleton
          className={`bg-gradient-to-r translate-y-2.5 from-neutral-700 to-neutral-800 w-full rounded-full h-full ${skeletonStyle}`}
        />
      ) : (
        <h1>
          {user?.displayName || user?.reloadUserInfo.screenName ? (
            <div className="flex justify-between">
              <h1>{user?.displayName ?? user?.reloadUserInfo?.screenName}</h1>
              {found}
            </div>
          ) : (
            notFound
          )}
        </h1>
      )}
    </div>
  );
}
export function UserEmail({
  className,
  skeletonStyle,
  notFound,
}: {
  className: string;
  skeletonStyle: string;
  notFound: React.ReactNode;
}) {
  const user = useAtomValue(userAtom);
  const loading = useAtomValue(loadingAtom);

  return (
    <div className={`${className}`}>
      {loading ? (
        <Skeleton
          className={`bg-gradient-to-r translate-y-2.5 from-neutral-700 to-neutral-800 rounded-full ${skeletonStyle}`}
        />
      ) : user?.email ? (
        <h1>{user?.email}</h1>
      ) : (
        notFound
      )}
    </div>
  );
}
export function UserEmailVerified({
  className,
  verified,
  unverified,
  skeletonStyle,
}: EmailVerificationProps) {
  const user = useAtomValue(userAtom);
  const loading = useAtomValue(loadingAtom);
  return (
    <div className={`${className}`}>
      {loading ? (
        <Skeleton
          className={`bg-gradient-to-r translate-y-2.5 from-neutral-700 to-neutral-800 w-full rounded-full h-full ${skeletonStyle}`}
        />
      ) : (
        <div>{user?.emailVerified ? verified : unverified}</div>
      )}
    </div>
  );
}
export function UserImagePhoto({
  className,
  skeletonStyle,
  notFound,
  found,
}: {
  className: string;
  skeletonStyle: string;
  notFound: React.ReactNode;
  found: React.ReactNode;
}) {
  const user = useAtomValue(userAtom);
  const loading = useAtomValue(loadingAtom);
  return (
    <div className={`${className}`}>
      {loading ? (
        <Skeleton
          className={`bg-gradient-to-r translate-y-2.5 from-neutral-700 to-neutral-800 w-full rounded-full h-full ${skeletonStyle}`}
        />
      ) : user?.photoURL ? (
        <div className="w-full h-full flex flex-col">
          <img src={user?.photoURL} alt="" className="h-full" />
          <div className="absolute self-end justify-self-end p-1">{found}</div>
        </div>
      ) : (
        notFound
      )}
    </div>
  );
}
export function ButtonWithPopup({
  className,
  buttonContent,
  popoverContent,
}: {
  className: string;
  buttonContent: React.ReactNode;
  popoverContent: React.ReactNode;
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>{buttonContent}</PopoverTrigger>
      <PopoverContent className={className}>{popoverContent}</PopoverContent>
    </Popover>
  );
}
