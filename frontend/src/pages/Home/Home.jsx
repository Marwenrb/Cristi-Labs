import React, { useEffect } from 'react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Hero from '../../components/Hero/Hero'
import Welcome from '../../components/Welcome/Welcome'
import MetricsPulse from '../../components/MetricsPulse/MetricsPulse'
import CristiAuraTeaser from '../../components/CristiAuraTeaser/CristiAuraTeaser'
import Choose from '../../components/Choose/Choose'
import Gallery from '../../components/Gallery/Gallery'
import InfiniteMarquee from '../../components/Marquee/Marquee'
import ApexTransit from '../../components/ApexTransit/ApexTransit'
import StickyCols from '../../components/StickyCols/StickyCols'
import Footer from '../../components/Footer/Footer'

const Home = () => {
  useEffect(() => {
    document.title = 'Cristi Labs | Digital Entertainment & International Trade';
  }, []);

  // Triple refresh: catches initial render (200ms), late font/image loads (800ms), and all pin spacers settled (1500ms)
  useEffect(() => {
    const t1 = setTimeout(() => ScrollTrigger.refresh(true), 200);
    const t2 = setTimeout(() => ScrollTrigger.refresh(true), 800);
    const t3 = setTimeout(() => ScrollTrigger.refresh(true), 1500);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  return (
    <div>
      <Hero />
      <Welcome />
      <MetricsPulse />
      <CristiAuraTeaser />
      <Choose />
      <Gallery />
      <InfiniteMarquee
        items={[
          'CROSS-BORDER TRADE',
          'COMMODITY SOURCING',
          'STRUCTURED FINANCE',
          'B2B MARKET ENTRY',
          'GLOBAL LOGISTICS',
          'EXPORT MANAGEMENT',
        ]}
        speed={55}
        direction="left"
        className="py-6"
        separator="◆"
      />
      <InfiniteMarquee
        items={[
          'DIGITAL VENTURES',
          'REAL-WORLD ASSET LIQUIDITY',
          'PHYGITAL ECOSYSTEMS',
          'DIGITAL INFRASTRUCTURE',
          'STRATEGIC PARTNERSHIPS',
          'AURA PROTOCOL',
        ]}
        speed={45}
        direction="right"
        className="py-4"
        separator="◆"
      />
      <ApexTransit />
      <StickyCols />
      <Footer />
    </div>
  )
}

export default Home

