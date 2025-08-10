"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Clock, Users, Star, Play, Lock } from 'lucide-react';
import { toast } from 'sonner';
import { Header } from '@/components/header';
import { AuthModal } from '@/components/auth-modal';
import { Footer } from '@/components/footer';
import { PaymentModal } from '@/components/payment-modal';

interface Course {
  id: number;
  title: string;
  description: string;
  price: number;
  originalPrice: number;
  level: string;
  rating?: number;
  students?: number;
  duration: string;
  features: string[];
  popular?: boolean;
  thumbnail_url?: string;
}

export default function CoursesPage() {
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('popularity');
  const [authModal, setAuthModal] = useState<'signin' | 'signup' | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const params = new URLSearchParams();
        if (selectedLevel !== 'all') params.append('level', selectedLevel);
        if (sortBy !== 'popularity') params.append('sortBy', sortBy);
        
        const response = await fetch(`/api/courses?${params.toString()}`);
        if (response.ok) {
          const data = await response.json();
          setCourses(data.courses);
        } else {
          console.error('Failed to fetch courses:', response.statusText);
          toast.error('Failed to load courses');
        }
      } catch (error) {
        console.error('Failed to fetch courses:', error);
        toast.error('Failed to load courses');
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [selectedLevel, sortBy]);

  const handleCourseClick = async (courseId: number) => {
    // Check authentication with server
    try {
      const response = await fetch('/api/auth/me');
      if (response.ok) {
        router.push(`/dashboard/course/${courseId}`);
      } else {
        toast.info('Please sign in to access course content');
        setAuthModal('signin');
      }
    } catch (error) {
      toast.info('Please sign in to access course content');
      setAuthModal('signin');
    }
  };

  const handleEnroll = async (course: Course) => {
    // Check authentication with server
    try {
      const response = await fetch('/api/auth/me');
      if (!response.ok) {
        toast.info('Please sign in to enroll in courses');
        setAuthModal('signin');
        return;
      }
    } catch (error) {
      toast.info('Please sign in to enroll in courses');
      setAuthModal('signin');
      return;
    }

    // Set original price if not already set (for demo purposes)
    const courseWithPrice = {
      ...course,
      originalPrice: course.originalPrice || Math.round(course.price * 1.3) // 30% markup for demo
    };
    
    setSelectedCourse(courseWithPrice);
  };

  const filteredCourses = courses.filter(course => {
    if (selectedLevel === 'all') return true;
    return course.level.toLowerCase() === selectedLevel.toLowerCase();
  });

  const sortedCourses = [...filteredCourses].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'rating':
        return (b.rating || 0) - (a.rating || 0);
      case 'popularity':
      default:
        return (b.students || 0) - (a.students || 0);
    }
  });

  if (loading) {
    return (
      <div className="min-h-screen trading-bg">
        <Header onAuthModalChange={setAuthModal} />
        <div className="pt-20">
          <div className="container mx-auto px-4 py-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
              <p className="text-white mt-4">Loading courses...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen trading-bg">
      <Header onAuthModalChange={setAuthModal} />
      <div className="pt-20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Choose Your <span className="gradient-text">Trading Path</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            From beginner to professional, we have the perfect course to match your trading goals
          </p>
        </div>

        {/* Filters and Sort */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <div className="flex flex-wrap gap-2">
            {['all', 'beginner', 'intermediate', 'advanced'].map((level) => (
              <Button
                key={level}
                variant={selectedLevel === level ? 'default' : 'outline'}
                onClick={() => setSelectedLevel(level)}
                className="capitalize"
              >
                {level}
              </Button>
            ))}
          </div>
          
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="popularity">Most Popular</option>
            <option value="rating">Highest Rated</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
          </select>
        </div>

        {/* Courses Grid */}
        {courses.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
              <BookOpen className="h-12 w-12 text-gray-400" />
            </div>
            <h4 className="text-xl font-semibold text-white mb-2">No courses available yet</h4>
            <p className="text-gray-400 mb-6">We're working on creating amazing trading courses for you.</p>
            <Button 
              onClick={() => router.push('/')}
              className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
            >
              Back to Home
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedCourses.map((course) => (
              <Card 
                key={course.id} 
                className="bg-white/5 border-white/20 hover:bg-white/10 transition-all duration-300 hover:scale-105 cursor-pointer group"
              >
                <div className="relative">
                  {course.thumbnail_url ? (
                    <img
                      src={course.thumbnail_url}
                      alt={course.title}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                  ) : (
                    <div className="w-full h-48 bg-gradient-to-br from-green-500/20 to-blue-500/20 rounded-t-lg flex items-center justify-center">
                      <BookOpen className="h-16 w-16 text-green-400" />
                    </div>
                  )}
                  
                  {course.popular && (
                    <Badge className="absolute top-3 right-3 bg-gradient-to-r from-yellow-500 to-orange-500">
                      Popular
                    </Badge>
                  )}
                  
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-t-lg flex items-center justify-center">
                    <Button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCourseClick(course.id);
                      }}
                      className="bg-white text-black hover:bg-gray-100"
                    >
                      <Play className="w-4 h-4 mr-2" />
                      View Course
                    </Button>
                  </div>
                </div>

                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between mb-2">
                    <CardTitle className="text-lg text-white line-clamp-2">
                      {course.title}
                    </CardTitle>
                  </div>
                  <CardDescription className="text-gray-300 line-clamp-2">
                    {course.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="pt-0">
                  {/* Course Stats */}
                  <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{course.duration}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Users className="w-4 h-4" />
                        <span>{course.students || 0} students</span>
                      </div>
                    </div>
                    {course.rating && (
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span>{course.rating}</span>
                      </div>
                    )}
                  </div>

                  {/* Level Badge */}
                  <div className="mb-4">
                    <Badge 
                      variant="secondary" 
                      className={`capitalize ${
                        course.level === 'beginner' ? 'bg-green-500/20 text-green-400' :
                        course.level === 'intermediate' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-red-500/20 text-red-400'
                      }`}
                    >
                      {course.level}
                    </Badge>
                  </div>

                  {/* Features */}
                  <div className="mb-4">
                    <ul className="space-y-1">
                      {course.features.slice(0, 3).map((feature, index) => (
                        <li key={index} className="flex items-center text-sm text-gray-300">
                          <div className="w-1.5 h-1.5 bg-green-400 rounded-full mr-2"></div>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Price and Enroll */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl font-bold text-white">₹{course.price}</span>
                      {course.originalPrice && course.originalPrice > course.price && (
                        <span className="text-lg text-gray-400 line-through">₹{course.originalPrice}</span>
                      )}
                    </div>
                    <Button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEnroll(course);
                      }}
                      className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
                    >
                      Enroll Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
      
      <Footer />
      
      <AuthModal 
        type={authModal} 
        onClose={() => setAuthModal(null)} 
      />
      
      <PaymentModal 
        course={selectedCourse}
        onClose={() => setSelectedCourse(null)}
        onEnrollmentSuccess={(courseId) => {
          // Refresh the courses list or update UI as needed
          toast.success('Successfully enrolled! You can now access the course from your dashboard.');
          setSelectedCourse(null);
        }}
      />
    </div>
    </div>
  );
}
