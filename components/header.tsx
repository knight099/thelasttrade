"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';
import Link from 'next/link';

interface HeaderProps {
  onAuthModalChange: (type: 'signin' | 'signup' | null) => void;
}

export function Header({ onAuthModalChange }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check authentication status on component mount
    const checkAuth = () => {
      const authStatus = localStorage.getItem('isAuthenticated');
      setIsAuthenticated(!!authStatus);
    };

    checkAuth();

    // Listen for storage changes (login/logout)
    const handleStorageChange = () => {
      checkAuth();
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-md border-b border-white/10">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">T</span>
            </div>
            <span className="text-white font-bold text-xl">TheLastTrade</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-white hover:text-green-400 transition-colors">
              Home
            </Link>
            <Link href="/courses" className="text-white hover:text-green-400 transition-colors">
              Courses
            </Link>
            {isAuthenticated && (
              <Link href="/dashboard" className="text-white hover:text-green-400 transition-colors">
                Dashboard
              </Link>
            )}
            {!isAuthenticated ? (
              <>
                <Button variant="ghost" onClick={() => onAuthModalChange('signin')} className="text-white hover:bg-white/10">
                  Sign In
                </Button>
                <Button onClick={() => onAuthModalChange('signup')} className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600">
                  Get Started
                </Button>
              </>
            ) : (
              <Button 
                onClick={async () => {
                  try {
                    await fetch('/api/auth/logout', { method: 'POST' });
                    window.location.href = '/';
                  } catch (error) {
                    console.error('Logout error:', error);
                    window.location.href = '/';
                  }
                }} 
                variant="ghost" 
                className="text-white hover:bg-white/10"
              >
                Logout
              </Button>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-white/10">
            <nav className="flex flex-col space-y-4">
              <Link 
                href="/" 
                className="text-white hover:text-green-400 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                href="/courses" 
                className="text-white hover:text-green-400 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Courses
              </Link>
              {isAuthenticated && (
                <Link 
                  href="/dashboard" 
                  className="text-white hover:text-green-400 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>
              )}
              {!isAuthenticated ? (
                <>
                  <Button 
                    variant="ghost" 
                    onClick={() => {
                      onAuthModalChange('signin');
                      setIsMenuOpen(false);
                    }} 
                    className="text-white hover:bg-white/10 justify-start"
                  >
                    Sign In
                  </Button>
                  <Button 
                    onClick={() => {
                      onAuthModalChange('signup');
                      setIsMenuOpen(false);
                    }} 
                    className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 justify-start"
                  >
                    Get Started
                  </Button>
                </>
              ) : (
                <Button 
                  onClick={async () => {
                    try {
                      await fetch('/api/auth/logout', { method: 'POST' });
                      setIsMenuOpen(false);
                      window.location.href = '/';
                    } catch (error) {
                      console.error('Logout error:', error);
                      setIsMenuOpen(false);
                      window.location.href = '/';
                    }
                  }} 
                  variant="ghost" 
                  className="text-white hover:bg-white/10 justify-start"
                >
                  Logout
                </Button>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}