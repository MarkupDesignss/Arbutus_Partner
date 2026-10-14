import React, { useRef } from "react";

import SEO from "../../SEO";

import HomeHero from "./HomeHero";
import AltDBSection from "./AltDBSection";
import AltDBScreener from "./AltDBScreener";
import GrandOpeningSection from "./GrandOpeningSection";
import TopFiveResults from "./TopFiveResults";
import AlternativeInvesting from "./AlternativeInvesting";
import FourCard from "./FourCard";

const HomeMian = () => {
  const alternativeInvestingRef = useRef(null);

  const scrollToAlternativeInvesting = () => {
    alternativeInvestingRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <>
      <SEO
        title="Arbutus | Alternative Investment Research Platform"
        description="Discover alternative investment opportunities, market intelligence, research insights, databases, newsletters and premium analytics with Arbutus."
        keywords="alternative investments, investment research, market intelligence, finance analytics, private equity, hedge funds, database screener"
      />

      <div>
        <HomeHero />
        <AltDBSection onExploreClick={scrollToAlternativeInvesting} />
        <AltDBScreener />
        <GrandOpeningSection />
        <TopFiveResults />
        <div ref={alternativeInvestingRef}>
          <AlternativeInvesting />
        </div>
        <FourCard />
        {/* <SubscribeNewsletter /> */}
      </div>
    </>
  );
};

export default HomeMian;