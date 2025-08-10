"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  BookOpen, 
  Clock, 
  TrendingUp, 
  Target, 
  BarChart3, 
  Play,
  LogOut,
  User
} from 'lucide-react';
import { toast } from 'sonner';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  avatar_url?: string;
}

interface Course {
  id: number;
  title: string;
  description: string;
  thumbnail_url: string;
  progress_percentage: number;
  total_videos: number;
  completed_videos: number;
  duration_minutes: number;
  difficulty_level: string;
}

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [enrolledCourses, setEnrolledCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check authentication with server-side API
    const checkAuthentication = async () => {
      try {
        const response = await fetch('/api/auth/me');
        if (response.ok) {
          const data = await response.json();
          setUser({
            id: data.user.id,
            name: data.user.name || 'User',
            email: data.user.email,
            role: data.user.role
          });
        } else {
          // Not authenticated, middleware should handle this but let's be safe
          router.push('/');
          return;
        }
      } catch (error) {
        console.error('Authentication check failed:', error);
        router.push('/');
        return;
      }
    };

    const fetchDashboardData = async () => {
      try {
        // Authentication is now handled server-side, no need to check localStorage
        const response = await fetch('/api/user/enrolled-courses');
        if (response.ok) {
          const data = await response.json();
          setEnrolledCourses(data.courses);
        } else {
          console.error('Failed to fetch enrolled courses:', response.statusText);
          setEnrolledCourses([]);
        }
      } catch (error) {
        console.error('Failed to fetch enrolled courses:', error);
        setEnrolledCourses([]);
      } finally {
        setLoading(false);
      }
    };

    // First check authentication, then fetch data
    checkAuthentication().then(() => {
      fetchDashboardData();
    }).catch(() => {
      setLoading(false);
    });
  }, [router]);

  const handleCourseClick = (courseId: number) => {
    router.push(`/dashboard/course/${courseId}`);
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      toast.success('Logged out successfully');
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
      // Even if API fails, redirect to home
      router.push('/');
    }
  };

  // Check if user is admin or has the specific admin email
  const isAdmin = user?.role === 'admin' || user?.email === 'admin@thelasttrade.com';

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect due to useEffect
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-black/20 backdrop-blur-md border-b border-white/10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">T</span>
              </div>
              <h1 className="text-2xl font-bold">Dashboard</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={user.avatar_url} />
                  <AvatarFallback className="bg-gradient-to-r from-green-500 to-blue-500">
                    {user.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="text-sm">
                  <div className="font-medium flex items-center space-x-2">
                    <span>{user.name}</span>
                    {isAdmin && (
                      <Badge variant="default" className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs">
                        {user.email === 'admin@thelasttrade.com' ? 'SUPER ADMIN' : 'ADMIN'}
                      </Badge>
                    )}
                  </div>
                  <div className="text-gray-400">{user.email}</div>
                </div>
              </div>
              
              <Button 
                onClick={handleLogout}
                variant="ghost" 
                className="text-white hover:bg-white/10"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Welcome back, {user.name}! 👋</h2>
          <p className="text-gray-400 text-lg">Continue your trading education journey</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/5 border-white/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-white text-lg">Enrolled Courses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-400">{enrolledCourses.length}</div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/5 border-white/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-white text-lg">Total Videos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-400">
                {enrolledCourses.reduce((sum, course) => sum + course.total_videos, 0)}
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/5 border-white/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-white text-lg">Completed Videos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-400">
                {enrolledCourses.reduce((sum, course) => sum + course.completed_videos, 0)}
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/5 border-white/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-white text-lg">Total Hours</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-400">
                {Math.round(enrolledCourses.reduce((sum, course) => sum + course.duration_minutes, 0) / 60)}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Enrolled Courses */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold mb-6">Your Enrolled Courses</h3>
          
          {enrolledCourses.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                <BookOpen className="h-12 w-12 text-gray-400" />
              </div>
              <h4 className="text-xl font-semibold text-white mb-2">No courses enrolled yet</h4>
              <p className="text-gray-400 mb-6">Start your trading journey by enrolling in our courses</p>
              <Button 
                onClick={() => router.push('/')}
                className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
              >
                Browse Courses
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {enrolledCourses.map((course) => (
              <Card 
                key={course.id} 
                className="bg-white/5 border-white/20 hover:bg-white/10 transition-colors cursor-pointer"
                onClick={() => handleCourseClick(course.id)}
              >
                <div className="relative">
                  <img 
                    src={course.thumbnail_url} 
                    alt={course.title}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                  <div className="absolute top-2 right-2">
                    <Badge variant="secondary" className="bg-black/50 text-white">
                      {course.difficulty_level}
                    </Badge>
                  </div>
                </div>
                
                <CardHeader className="pb-3">
                  <CardTitle className="text-white text-lg">{course.title}</CardTitle>
                  <CardDescription className="text-gray-400 line-clamp-2">
                    {course.description}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between text-sm text-gray-400">
                    <div className="flex items-center space-x-1">
                      <Play className="w-4 h-4" />
                      <span>{course.completed_videos}/{course.total_videos} videos</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{course.duration_minutes} min</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Progress</span>
                      <span className="text-white">{course.progress_percentage}%</span>
                    </div>
                    <div className="w-full bg-gray-600 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${Math.min(100, Math.max(0, course.progress_percentage || 0))}%` }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold mb-6">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-white/5 border-white/20 hover:bg-white/10 transition-colors cursor-pointer">
              <CardContent className="p-6 text-center">
                <BookOpen className="w-12 h-12 mx-auto mb-4 text-green-400" />
                <h4 className="text-xl font-semibold mb-2">Browse Courses</h4>
                <p className="text-gray-400">Discover new trading courses</p>
              </CardContent>
            </Card>
            
            <Card className="bg-white/5 border-white/20 hover:bg-white/10 transition-colors cursor-pointer">
              <CardContent className="p-6 text-center">
                <BarChart3 className="w-12 h-12 mx-auto mb-4 text-blue-400" />
                <h4 className="text-xl font-semibold mb-2">Track Progress</h4>
                <p className="text-gray-400">Monitor your learning journey</p>
              </CardContent>
            </Card>
            
            <Card className="bg-white/5 border-white/20 hover:bg-white/10 transition-colors cursor-pointer">
              <CardContent className="p-6 text-center">
                <Target className="w-12 h-12 mx-auto mb-4 text-purple-400" />
                <h4 className="text-xl font-semibold mb-2">Set Goals</h4>
                <p className="text-gray-400">Define your trading objectives</p>
              </CardContent>
            </Card>
          </div>
          
          {/* Admin Actions - Only show for admin users */}
          {isAdmin && (
            <div className="mt-6">
              <h4 className="text-xl font-semibold mb-4 text-purple-400">Admin Actions</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-purple-500/30 hover:from-purple-500/30 hover:to-pink-500/30 transition-colors cursor-pointer">
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <User className="h-6 w-6 text-white" />
                    </div>
                    <h4 className="text-xl font-semibold mb-2">Admin Dashboard</h4>
                    <p className="text-gray-300 mb-4">Manage courses, users, and content</p>
                    <Button 
                      onClick={() => router.push('/admin')}
                      className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                    >
                      Go to Admin Dashboard
                    </Button>
                  </CardContent>
                </Card>
                
                <Card className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border-blue-500/30 hover:from-blue-500/30 hover:to-cyan-500/30 transition-colors cursor-pointer">
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <BookOpen className="h-6 w-6 text-white" />
                    </div>
                    <h4 className="text-xl font-semibold mb-2">Course Management</h4>
                    <p className="text-gray-300 mb-4">Add, edit, and manage courses</p>
                    <Button 
                      onClick={() => router.push('/admin')}
                      className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white"
                    >
                      Manage Courses
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
