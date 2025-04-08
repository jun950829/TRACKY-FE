import React from "react";
import InfoSearchSection from "./InfoSearchSection";
import InfoResultSection from "./InfoResultSection";

function InfoMain() {
  return (
    <div className="container mx-auto px-4 sm:px-6 py-4 md:py-6 max-w-6xl">
      <h1 className="text-2xl sm:text-3xl font-bold mb-4 md:mb-6 text-center">예약 조회 서비스</h1>
      <InfoSearchSection />
      <InfoResultSection />
    </div>
  );
}

export default InfoMain;
