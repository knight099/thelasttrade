"use client";

import { useState } from 'react';
import { Header } from '@/components/header';
import { Hero } from '@/components/hero';
import { CourseGrid } from '@/components/course-grid';
import { Features } from '@/components/features';
import { Footer } from '@/components/footer';
import { AuthModal } from '@/components/auth-modal';

export default function Home() {
  const [authModal, setAuthModal] = useState<'signin' | 'signup' | null>(null);

  const handleGetStarted = () => {
    setAuthModal('signup');
  };

  return (
    <div className="min-h-screen trading-bg">
      <Header onAuthModalChange={setAuthModal} />
      <Hero onGetStarted={handleGetStarted} />
      <CourseGrid />
      <Features />
      <Footer />
      <AuthModal 
        type={authModal} 
        onClose={() => setAuthModal(null)} 
      />
    </div>
  );
}