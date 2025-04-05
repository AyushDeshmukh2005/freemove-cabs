
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import DashboardLayout from '@/components/DashboardLayout';
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
    <>
      <Hero />
      <Features />
      <HowItWorks />
      <Benefits />
      <UniqueFeatures />
      <DownloadCTA />
      <Footer />
    </>
  );
};

export default Index;
