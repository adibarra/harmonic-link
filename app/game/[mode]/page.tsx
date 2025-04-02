"use client";

import { useParams } from "next/navigation";
import Gameplay from "@/components/gameplay";

const GamePage = () => {
  const params = useParams();
  return <Gameplay mode={params.mode as string} />;
};

export default GamePage;
