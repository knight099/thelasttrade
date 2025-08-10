"use client";

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { BookOpen, ArrowRight } from 'lucide-react';

export function CourseGrid() {
  const router = useRouter();

  return (
    <section id="courses" className="py-20 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Choose Your <span className="gradient-text">Trading Path</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            From beginner to professional, we have the perfect course to match your trading goals
          </p>
        </div>
        
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
            <BookOpen className="h-12 w-12 text-gray-400" />
          </div>
          <h4 className="text-xl font-semibold text-white mb-2">Explore Our Trading Courses</h4>
          <p className="text-gray-400 mb-6">Discover comprehensive trading education designed for all skill levels</p>
          <Button 
            onClick={() => router.push('/courses')}
            className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
          >
            Browse All Courses
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </section>
  );
}