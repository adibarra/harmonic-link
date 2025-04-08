"use client";

import { UserIcon } from "lucide-react";
import Image from "next/image";
import { Card, CardContent } from "../ui/card";

interface UserCardProps {
  user: User;
  you: boolean;
}

export default function UserCard({ user, you }: UserCardProps) {
  return (
    <Card className="relative w-[192px] h-[218px] p-4 pb-6">
      <CardContent className="flex flex-col items-center text-center text-sm p-0">
        <div className="w-[128px] h-[128px]">
          <Image
            priority
            className="w-full h-full object-cover"
            src={user.image}
            alt={user.name}
            width={128}
            height={128}
          />
        </div>
        <div className="mt-2 font-semibold text-base truncate w-full">{user.name}</div>
        <div className="text-xs font-semibold opacity-50 truncate w-full">{you ? '(You)' : ''}</div>
      </CardContent>
      <div className="absolute flex flex-row gap-2 left-2 bottom-2 opacity-50">
        <UserIcon className="w-4 h-4" />
        <span className="text-xs">Player</span>
      </div>
    </Card>
  );
}
