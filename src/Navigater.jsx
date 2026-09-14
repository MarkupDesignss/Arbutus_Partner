import { BrowserRouter, Routes, Route } from "react-router-dom";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import Header from "./Header";
import Footer from "./Footer";
import ScrollTotop from "./ScrollToTop";

import HomeMian from "./Components/Home/HomeMian";
import AltDatabaseMain from "./Components/AltDatabase/AltDatabaseMain";
import Newsmain from "./Components/Newsletter/Newsmain";
import Contactmain from "./Components/Contact/Contactmain";
import Levelmain from "./Components/Levels/Levelmain";
import Aboutmain from "./Components/AboutUs/Aboutmain";
import Notfound from "./Notfound";
import Privacypolicy from "./Privacypolicy";
import TremsandCondition from "./TremsandCondition";
import PaymentSuccess from "./Components/Levels/PaymentSuccess";
import LoginAuth from "./Components/Authscreens/LoginAuth";
import NewDetails from "./Components/Newsletter/NewDetails";
import Researchpage from "./Components/Researchpage";
import Altdbmain from "./Components/Altdb/Altdbmain";
import ArticlePage from "./Components/ArticlePage";
// 👇 Partner pages
import PartnerDirectory from "./Components/PartnerDirectory";
import FieraRealEstate from "./Components/PartnerPage/FieraRealEstate";

const Navigater = () => {
  const [showLogin, setShowLogin] = useState(false);
  const email = useSelector((state) => state.auth.email);

  const isCrawler =
    typeof navigator !== "undefined" &&
    /ReactSnap|lighthouse|bot|crawler|HeadlessChrome/i.test(
      navigator.userAgent,
    );

  useEffect(() => {
    if (isCrawler) return;

    const hasSeenLoginPopup = sessionStorage.getItem("hasSeenLoginPopup");
    if (!email && !hasSeenLoginPopup) {
      setShowLogin(true);
      sessionStorage.setItem("hasSeenLoginPopup", "true");
    }
  }, [email, isCrawler]);

  return (
    <BrowserRouter basename="/arbutus-web/">
      <ScrollTotop />
      <Header onUserClick={() => setShowLogin(true)} />

      <Routes>
        <Route path="/" element={<HomeMian />} />
        <Route path="/Aboutmain" element={<Aboutmain />} />
        <Route path="/AltDatabaseMain" element={<AltDatabaseMain />} />
        <Route path="/Newsmain" element={<Newsmain />} />
        <Route path="/NewDetails/:slug" element={<NewDetails />} />
        <Route path="/Contactmain" element={<Contactmain />} />
        <Route path="/Levelmain" element={<Levelmain />} />
        <Route path="/Altdbmain" element={<Altdbmain />} />
        <Route path="/Privacypolicy" element={<Privacypolicy />} />
        <Route path="/TremsandCondition" element={<TremsandCondition />} />
        <Route path="/payment-success" element={<PaymentSuccess />} />
        <Route path="/Researchpage" element={<Researchpage />} />

        {/* Partner Pages */}
        <Route path="/PartnerDirectory" element={<PartnerDirectory />} />
        <Route path="/FieraRealEstate" element={<FieraRealEstate />} />
        <Route path="/ArticlePage" element={<ArticlePage />} />
        <Route path="/NewDetails/:slug" element={<ArticlePage />} />
        <Route path="*" element={<Notfound />} />
      </Routes>

      <Footer />

      {showLogin && !email && !isCrawler && (
        <LoginAuth isOpen={showLogin} onClose={() => setShowLogin(false)} />
      )}
    </BrowserRouter>
  );
};

export default Navigater;
