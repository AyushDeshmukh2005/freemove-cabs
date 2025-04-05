
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import HowItWorks from '@/components/HowItWorks';
import Benefits from '@/components/Benefits';
import UniqueFeatures from '@/components/UniqueFeatures';
import DownloadCTA from '@/components/DownloadCTA';
import Footer from '@/components/Footer';

const Index = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Hero />
        <Features />
        <HowItWorks />
        <Benefits />
        <UniqueFeatures />
        <DownloadCTA />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
