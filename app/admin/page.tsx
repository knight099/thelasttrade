"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Users, 
  BookOpen, 
  Video, 
  FolderOpen, 
  Plus, 
  Search,
  LogOut,
  Crown,
  User,
  Edit,
  Trash2,
  GraduationCap,
  Eye,
  PlayCircle
} from 'lucide-react';
import { toast } from 'sonner';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  created_at: string;
  avatar_url?: string;
  enrolled_courses: number;
}

interface Course {
  id: number;
  title: string;
  description: string;
  price: number;
  difficulty_level: string;
  is_published: boolean;
  created_at: string;
  category_id?: number;
  duration_minutes?: number;
}

interface Video {
  id: number;
  title: string;
  description: string;
  course_id: number;
  course_title: string;
  video_url: string;
  thumbnail_url: string;
  duration_seconds: number;
  order_index: number;
  is_free: boolean;
  created_at: string;
}

interface Category {
  id: number;
  name: string;
  description: string;
  icon: string;
}

interface CourseOption {
  id: number;
  title: string;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');
  const [users, setUsers] = useState<User[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [videos, setVideos] = useState<Video[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [courseOptions, setCourseOptions] = useState<CourseOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Modal states
  const [showAddUser, setShowAddUser] = useState(false);
  const [showAddCourse, setShowAddCourse] = useState(false);
  const [showAddVideo, setShowAddVideo] = useState(false);
  const [showEditCourse, setShowEditCourse] = useState(false);
  const [showEditVideo, setShowEditVideo] = useState(false);
  const [showCourseVideos, setShowCourseVideos] = useState(false);
  const [selectedCourseForVideos, setSelectedCourseForVideos] = useState<Course | null>(null);
  const [courseVideos, setCourseVideos] = useState<Video[]>([]);

  // Form states
  const [userForm, setUserForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user'
  });

  const [courseForm, setCourseForm] = useState({
    title: '',
    description: '',
    category_id: '',
    price: '',
    difficulty_level: 'beginner',
    is_published: false,
    duration_minutes: ''
  });

  const [editCourseForm, setEditCourseForm] = useState({
    id: 0,
    title: '',
    description: '',
    category_id: '',
    price: '',
    difficulty_level: 'beginner',
    is_published: false,
    duration_minutes: ''
  });

  const [videoForm, setVideoForm] = useState({
    title: '',
    description: '',
    course_id: '',
    video_url: '',
    thumbnail_url: '',
    duration_seconds: '',
    order_index: '',
    is_free: false
  });

  const [editVideoForm, setEditVideoForm] = useState({
    id: 0,
    title: '',
    description: '',
    course_id: '',
    video_url: '',
    thumbnail_url: '',
    duration_seconds: '',
    order_index: '',
    is_free: false
  });

  useEffect(() => {
    // Check authentication with server-side API
    const checkAuthentication = async () => {
      try {
        const response = await fetch('/api/auth/me');
        if (response.ok) {
          const data = await response.json();
          if (data.user.role !== 'admin') {
            toast.error('Access denied. Admin privileges required.');
            router.push('/dashboard');
            return;
          }
          // Admin access confirmed, proceed with loading admin data
          fetchAdminData();
          fetchCategories();
          fetchCourseOptions();
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

    checkAuthentication();
  }, [router]);

  const fetchAdminData = async () => {
    try {
      // Fetch users
      const usersResponse = await fetch('/api/admin/users');
      if (usersResponse.ok) {
        const usersData = await usersResponse.json();
        setUsers(usersData.users);
      }

      // Fetch courses
      const coursesResponse = await fetch('/api/admin/courses');
      if (coursesResponse.ok) {
        const coursesData = await coursesResponse.json();
        setCourses(coursesData.courses);
      }

      // Fetch videos
      const videosResponse = await fetch('/api/admin/videos');
      if (videosResponse.ok) {
        const videosData = await videosResponse.json();
        setVideos(videosData.videos);
      }

    } catch (error) {
      console.error('Error fetching admin data:', error);
      toast.error('Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/admin/categories');
      if (response.ok) {
        const data = await response.json();
        setCategories(data.categories);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchCourseOptions = async () => {
    try {
      const response = await fetch('/api/admin/courses-list');
      if (response.ok) {
        const data = await response.json();
        setCourseOptions(data.courses);
      }
    } catch (error) {
      console.error('Error fetching course options:', error);
    }
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

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userForm),
      });

      if (response.ok) {
        toast.success('User created successfully');
        setShowAddUser(false);
        setUserForm({ name: '', email: '', password: '', role: 'user' });
        fetchAdminData(); // Refresh the list
      } else {
        const data = await response.json();
        toast.error(data.error || 'Failed to create user');
      }
    } catch (error) {
      toast.error('Failed to create user');
    }
  };

  const handleAddCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Debug: Log the form data being sent
    console.log('Course form data being sent:', courseForm);
    console.log('Categories available:', categories);
    
    // Validate form data before sending
    if (!courseForm.title || !courseForm.description || !courseForm.category_id) {
      console.log('Form validation failed:');
      console.log('- Title:', courseForm.title);
      console.log('- Description:', courseForm.description);
      console.log('- Category ID:', courseForm.category_id);
      toast.error('Please fill in all required fields');
      return;
    }
    
    try {
      const response = await fetch('/api/admin/courses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(courseForm),
      });

      if (response.ok) {
        toast.success('Course created successfully');
        setShowAddCourse(false);
        setCourseForm({
          title: '',
          description: '',
          category_id: '',
          price: '',
          difficulty_level: 'beginner',
          is_published: false,
          duration_minutes: ''
        });
        fetchAdminData(); // Refresh the list
      } else {
        const data = await response.json();
        console.log('API Error Response:', data);
        toast.error(data.error || 'Failed to create course');
      }
    } catch (error) {
      toast.error('Failed to create course');
    }
  };

  const handleAddVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/admin/videos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(videoForm),
      });

      if (response.ok) {
        toast.success('Video created successfully');
        setShowAddVideo(false);
        setVideoForm({
          title: '',
          description: '',
          course_id: '',
          video_url: '',
          thumbnail_url: '',
          duration_seconds: '',
          order_index: '',
          is_free: false
        });
        fetchAdminData(); // Refresh the list
      } else {
        const data = await response.json();
        toast.error(data.error || 'Failed to create video');
      }
    } catch (error) {
      toast.error('Failed to create video');
    }
  };

  const handleEditCourse = (course: Course) => {
    setEditCourseForm({
      id: course.id,
      title: course.title,
      description: course.description,
      category_id: course.category_id?.toString() || '',
      price: course.price.toString(),
      difficulty_level: course.difficulty_level,
      is_published: course.is_published,
      duration_minutes: course.duration_minutes?.toString() || ''
    });
    setShowEditCourse(true);
  };

  const handleUpdateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/admin/courses/${editCourseForm.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editCourseForm),
      });

      if (response.ok) {
        toast.success('Course updated successfully');
        setShowEditCourse(false);
        setEditCourseForm({
          id: 0,
          title: '',
          description: '',
          category_id: '',
          price: '',
          difficulty_level: 'beginner',
          is_published: false,
          duration_minutes: ''
        });
        fetchAdminData(); // Refresh the list
      } else {
        const data = await response.json();
        toast.error(data.error || 'Failed to update course');
      }
    } catch (error) {
      toast.error('Failed to update course');
    }
  };

  const handleDeleteCourse = async (courseId: number) => {
    if (!confirm('Are you sure you want to delete this course? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/courses/${courseId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('Course deleted successfully');
        fetchAdminData(); // Refresh the list
      } else {
        const data = await response.json();
        toast.error(data.error || 'Failed to delete course');
      }
    } catch (error) {
      toast.error('Failed to delete course');
    }
  };

  const handleEditVideo = (video: Video) => {
    setEditVideoForm({
      id: video.id,
      title: video.title,
      description: video.description || '',
      course_id: video.course_id.toString(),
      video_url: video.video_url,
      thumbnail_url: video.thumbnail_url || '',
      duration_seconds: video.duration_seconds.toString(),
      order_index: video.order_index.toString(),
      is_free: video.is_free
    });
    setShowEditVideo(true);
  };

  const handleUpdateVideo = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch(`/api/admin/videos/${editVideoForm.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: editVideoForm.title,
          description: editVideoForm.description,
          course_id: parseInt(editVideoForm.course_id),
          video_url: editVideoForm.video_url,
          thumbnail_url: editVideoForm.thumbnail_url,
          duration_seconds: parseInt(editVideoForm.duration_seconds),
          order_index: parseInt(editVideoForm.order_index),
          is_free: editVideoForm.is_free
        }),
      });

      if (response.ok) {
        toast.success('Video updated successfully');
        setShowEditVideo(false);
        setEditVideoForm({
          id: 0,
          title: '',
          description: '',
          course_id: '',
          video_url: '',
          thumbnail_url: '',
          duration_seconds: '',
          order_index: '',
          is_free: false
        });
        fetchAdminData(); // Refresh the data
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to update video');
      }
    } catch (error) {
      console.error('Error updating video:', error);
      toast.error('Failed to update video');
    }
  };

  const handleDeleteVideo = async (videoId: number) => {
    if (!confirm('Are you sure you want to delete this video? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/videos/${videoId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('Video deleted successfully');
        fetchAdminData(); // Refresh the data
        // Also refresh course videos if we're viewing them
        if (selectedCourseForVideos) {
          handleViewCourseVideos(selectedCourseForVideos);
        }
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to delete video');
      }
    } catch (error) {
      console.error('Error deleting video:', error);
      toast.error('Failed to delete video');
    }
  };

  const handleViewCourseVideos = async (course: Course) => {
    try {
      const response = await fetch(`/api/courses/${course.id}/videos`);
      if (response.ok) {
        const data = await response.json();
        setCourseVideos(data.videos);
        setSelectedCourseForVideos(course);
        setShowCourseVideos(true);
      } else {
        toast.error('Failed to load course videos');
      }
    } catch (error) {
      toast.error('Failed to load course videos');
    }
  };

  const handleAddVideoToCourse = (course: Course) => {
    setVideoForm({
      ...videoForm,
      course_id: course.id.toString()
    });
    setShowAddVideo(true);
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading admin panel...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-black/20 backdrop-blur-md border-b border-white/10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <Crown className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Admin Dashboard</h1>
                <p className="text-purple-400 text-sm">Admin Access</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button 
                onClick={() => router.push('/dashboard')}
                variant="outline" 
                className="border-white/20 text-white hover:bg-white/10"
              >
                <User className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
              
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
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/5 border-white/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-white text-lg">Total Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-400">{users.length}</div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/5 border-white/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-white text-lg">Total Courses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-400">{courses.length}</div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/5 border-white/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-white text-lg">Total Videos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-400">{videos.length}</div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/5 border-white/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-white text-lg">Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-400">{categories.length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="flex space-x-1 bg-white/5 p-1 rounded-lg">
            {['overview', 'users', 'courses', 'videos', 'categories'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === tab
                    ? 'bg-white/20 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-white/10'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">System Overview</h2>
            <p className="text-gray-400">Welcome to the admin dashboard. Use the tabs above to manage different aspects of the system.</p>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">User Management</h2>
              <Button onClick={() => setShowAddUser(true)} className="bg-green-600 hover:bg-green-700">
                <Plus className="w-4 h-4 mr-2" />
                Add User
              </Button>
            </div>
            
            {/* User Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-white/5 border-white/20">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400">Total Users</p>
                      <p className="text-2xl font-bold">{users.length}</p>
                    </div>
                    <Users className="w-8 h-8 text-blue-400" />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-white/5 border-white/20">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400">Total Enrollments</p>
                      <p className="text-2xl font-bold">
                        {users.reduce((total, user) => total + user.enrolled_courses, 0)}
                      </p>
                    </div>
                    <BookOpen className="w-8 h-8 text-green-400" />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-white/5 border-white/20">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400">Active Students</p>
                      <p className="text-2xl font-bold">
                        {users.filter(user => user.enrolled_courses > 0).length}
                      </p>
                    </div>
                    <GraduationCap className="w-8 h-8 text-purple-400" />
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="flex items-center space-x-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white/5 border-white/20 text-white"
                />
              </div>
            </div>

            <div className="grid gap-4">
              {filteredUsers.map((user) => (
                <Card key={user.id} className="bg-white/5 border-white/20">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <Avatar className="w-10 h-10">
                          <AvatarFallback className="bg-gradient-to-r from-green-500 to-blue-500">
                            {user.name.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold">{user.name}</h3>
                          <p className="text-gray-400 text-sm">{user.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                          {user.role}
                        </Badge>
                        <span className="text-gray-400 text-sm">
                          {new Date(user.created_at).toLocaleDateString()}
                        </span>
                        <Badge variant={user.enrolled_courses > 0 ? 'default' : 'secondary'} className="bg-blue-600 hover:bg-blue-700">
                          {user.enrolled_courses} course{user.enrolled_courses !== 1 ? 's' : ''}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'courses' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Course Management</h2>
              <Button onClick={() => setShowAddCourse(true)} className="bg-green-600 hover:bg-green-700">
                <Plus className="w-4 h-4 mr-2" />
                Add Course
              </Button>
            </div>

            {courses.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                  <BookOpen className="h-12 w-12 text-gray-400" />
                </div>
                <h4 className="text-xl font-semibold text-white mb-2">No courses yet</h4>
                <p className="text-gray-400 mb-6">Create your first course to get started</p>
                <Button 
                  onClick={() => setShowAddCourse(true)}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add First Course
                </Button>
              </div>
            ) : (
              <div className="grid gap-4">
                {courses.map((course) => (
                  <Card key={course.id} className="bg-white/5 border-white/20">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold">{course.title}</h3>
                          <p className="text-gray-400 text-sm">{course.description}</p>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Badge variant={course.difficulty_level === 'beginner' ? 'default' : 'secondary'}>
                            {course.difficulty_level}
                          </Badge>
                          <span className="text-green-400 font-semibold">${course.price}</span>
                          {course.duration_minutes && (
                            <span className="text-gray-400 text-sm">
                              {Math.floor(course.duration_minutes / 60)}h {course.duration_minutes % 60}m
                            </span>
                          )}
                          <Badge variant={course.is_published ? 'default' : 'outline'}>
                            {course.is_published ? 'Published' : 'Draft'}
                          </Badge>
                          <div className="flex items-center space-x-2 ml-4">
                            <Button
                              onClick={() => handleViewCourseVideos(course)}
                              variant="outline"
                              size="sm"
                              className="border-blue-500/20 text-blue-400 hover:bg-blue-500/10"
                              title="View Videos"
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button
                              onClick={() => handleAddVideoToCourse(course)}
                              variant="outline"
                              size="sm"
                              className="border-green-500/20 text-green-400 hover:bg-green-500/10"
                              title="Add Video"
                            >
                              <Plus className="w-4 h-4" />
                            </Button>
                            <Button
                              onClick={() => handleEditCourse(course)}
                              variant="outline"
                              size="sm"
                              className="border-white/20 text-white hover:bg-white/10"
                              title="Edit Course"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              onClick={() => handleDeleteCourse(course.id)}
                              variant="outline"
                              size="sm"
                              className="border-red-500/20 text-red-400 hover:bg-red-500/10"
                              title="Delete Course"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'videos' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Video Management</h2>
              <Button onClick={() => setShowAddVideo(true)} className="bg-green-600 hover:bg-green-700">
                <Plus className="w-4 h-4 mr-2" />
                Add Video
              </Button>
            </div>

            {videos.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Video className="h-12 w-12 text-gray-400" />
                </div>
                <h4 className="text-xl font-semibold text-white mb-2">No videos yet</h4>
                <p className="text-gray-400 mb-6">Create your first video to get started</p>
                <Button 
                  onClick={() => setShowAddVideo(true)}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add First Video
                </Button>
              </div>
            ) : (
              <div className="grid gap-4">
                {videos.map((video) => (
                  <Card key={video.id} className="bg-white/5 border-white/20">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold">{video.title}</h3>
                          <p className="text-gray-400 text-sm">{video.description || 'No description'}</p>
                          <p className="text-gray-400 text-sm">Course: {video.course_title}</p>
                          <p className="text-gray-400 text-sm">Order: {video.order_index}</p>
                        </div>
                        <div className="flex items-center space-x-3">
                          <span className="text-gray-400 text-sm">
                            {Math.floor(video.duration_seconds / 60)}:{(video.duration_seconds % 60).toString().padStart(2, '0')}
                          </span>
                          <Badge variant={video.is_free ? 'default' : 'outline'}>
                            {video.is_free ? 'Free' : 'Premium'}
                          </Badge>
                          <div className="flex items-center space-x-2 ml-4">
                            <Button
                              onClick={() => handleEditVideo(video)}
                              variant="outline"
                              size="sm"
                              className="border-white/20 text-white hover:bg-white/10"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              onClick={() => handleDeleteVideo(video.id)}
                              variant="outline"
                              size="sm"
                              className="border-red-500/20 text-red-400 hover:bg-red-500/10"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'categories' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Categories</h2>
            <div className="grid gap-4">
              {categories.map((category) => (
                <Card key={category.id} className="bg-white/5 border-white/20">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-4">
                      <span className="text-2xl">{category.icon}</span>
                      <div>
                        <h3 className="font-semibold">{category.name}</h3>
                        <p className="text-gray-400 text-sm">{category.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Add User Modal */}
      {showAddUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Add New User</h3>
            <form onSubmit={handleAddUser} className="space-y-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={userForm.name}
                  onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
                  required
                  className="bg-white/5 border-white/20 text-white"
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={userForm.email}
                  onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                  required
                  className="bg-white/5 border-white/20 text-white"
                />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={userForm.password}
                  onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
                  required
                  className="bg-white/5 border-white/20 text-white"
                />
              </div>
              <div>
                <Label htmlFor="role">Role</Label>
                <select
                  id="role"
                  value={userForm.role}
                  onChange={(e) => setUserForm({ ...userForm, role: e.target.value })}
                  className="w-full p-2 rounded bg-white/5 border border-white/20 text-white"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="flex space-x-2">
                <Button type="submit" className="flex-1 bg-green-600 hover:bg-green-700">
                  Add User
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setShowAddUser(false)}
                  className="flex-1 border-white/20 text-white hover:bg-white/10"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Course Modal */}
      {showAddCourse && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Add New Course</h3>
            <form onSubmit={handleAddCourse} className="space-y-4">
              <div>
                <Label htmlFor="course-title">Title</Label>
                <Input
                  id="course-title"
                  value={courseForm.title}
                  onChange={(e) => setCourseForm({ ...courseForm, title: e.target.value })}
                  required
                  className="bg-white/5 border-white/20 text-white"
                />
              </div>
              <div>
                <Label htmlFor="course-description">Description</Label>
                <textarea
                  id="course-description"
                  value={courseForm.description}
                  onChange={(e) => setCourseForm({ ...courseForm, description: e.target.value })}
                  required
                  className="w-full p-2 rounded bg-white/5 border border-white/20 text-white"
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="course-category">Category</Label>
                <select
                  id="course-category"
                  value={courseForm.category_id}
                  onChange={(e) => setCourseForm({ ...courseForm, category_id: e.target.value })}
                  required
                  className="w-full p-2 rounded bg-white/5 border border-white/20 text-white"
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Label htmlFor="course-price">Price</Label>
                <Input
                  id="course-price"
                  type="number"
                  step="0.01"
                  value={courseForm.price}
                  onChange={(e) => setCourseForm({ ...courseForm, price: e.target.value })}
                  required
                  className="bg-white/5 border-white/20 text-white"
                />
              </div>
              <div>
                <Label htmlFor="course-difficulty">Difficulty</Label>
                <select
                  id="course-difficulty"
                  value={courseForm.difficulty_level}
                  onChange={(e) => setCourseForm({ ...courseForm, difficulty_level: e.target.value })}
                  className="w-full p-2 rounded bg-white/5 border border-white/20 text-white"
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
              <div>
                <Label htmlFor="course-duration">Duration (minutes)</Label>
                <Input
                  id="course-duration"
                  type="number"
                  value={courseForm.duration_minutes}
                  onChange={(e) => setCourseForm({ ...courseForm, duration_minutes: e.target.value })}
                  placeholder="120"
                  className="bg-white/5 border-white/20 text-white"
                />
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="course-published"
                  checked={courseForm.is_published}
                  onChange={(e) => setCourseForm({ ...courseForm, is_published: e.target.checked })}
                  className="rounded"
                />
                <Label htmlFor="course-published">Published</Label>
              </div>
              <div className="flex space-x-2">
                <Button type="submit" className="flex-1 bg-green-600 hover:bg-green-700">
                  Add Course
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setShowAddCourse(false)}
                  className="flex-1 border-white/20 text-white hover:bg-white/10"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Video Modal */}
      {showAddVideo && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Add New Video</h3>
            <form onSubmit={handleAddVideo} className="space-y-4">
              <div>
                <Label htmlFor="video-title">Title</Label>
                <Input
                  id="video-title"
                  value={videoForm.title}
                  onChange={(e) => setVideoForm({ ...videoForm, title: e.target.value })}
                  required
                  className="bg-white/5 border-white/20 text-white"
                />
              </div>
              <div>
                <Label htmlFor="video-course">Course</Label>
                <select
                  id="video-course"
                  value={videoForm.course_id}
                  onChange={(e) => setVideoForm({ ...videoForm, course_id: e.target.value })}
                  required
                  className="w-full p-2 rounded bg-white/5 border border-white/20 text-white"
                >
                  <option value="">Select a course</option>
                  {courseOptions.map((course) => (
                    <option key={course.id} value={course.id}>
                      {course.title}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Label htmlFor="video-url">Video URL</Label>
                <Input
                  id="video-url"
                  value={videoForm.video_url}
                  onChange={(e) => setVideoForm({ ...videoForm, video_url: e.target.value })}
                  required
                  className="bg-white/5 border-white/20 text-white"
                />
              </div>
              <div>
                <Label htmlFor="video-duration">Duration (seconds)</Label>
                <Input
                  id="video-duration"
                  type="number"
                  value={videoForm.duration_seconds}
                  onChange={(e) => setVideoForm({ ...videoForm, duration_seconds: e.target.value })}
                  required
                  className="bg-white/5 border-white/20 text-white"
                />
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="video-free"
                  checked={videoForm.is_free}
                  onChange={(e) => setVideoForm({ ...videoForm, is_free: e.target.checked })}
                  className="rounded"
                />
                <Label htmlFor="video-free">Free Video</Label>
              </div>
              <div className="flex space-x-2">
                <Button type="submit" className="flex-1 bg-green-600 hover:bg-green-700">
                  Add Video
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setShowAddVideo(false)}
                  className="flex-1 border-white/20 text-white hover:bg-white/10"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Course Modal */}
      {showEditCourse && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Edit Course</h3>
            <form onSubmit={handleUpdateCourse} className="space-y-4">
              <div>
                <Label htmlFor="edit-course-title">Title</Label>
                <Input
                  id="edit-course-title"
                  value={editCourseForm.title}
                  onChange={(e) => setEditCourseForm({ ...editCourseForm, title: e.target.value })}
                  required
                  className="bg-white/5 border-white/20 text-white"
                />
              </div>
              <div>
                <Label htmlFor="edit-course-description">Description</Label>
                <textarea
                  id="edit-course-description"
                  value={editCourseForm.description}
                  onChange={(e) => setEditCourseForm({ ...editCourseForm, description: e.target.value })}
                  required
                  className="w-full p-2 rounded bg-white/5 border border-white/20 text-white"
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="edit-course-category">Category</Label>
                <select
                  id="edit-course-category"
                  value={editCourseForm.category_id}
                  onChange={(e) => setEditCourseForm({ ...editCourseForm, category_id: e.target.value })}
                  required
                  className="w-full p-2 rounded bg-white/5 border border-white/20 text-white"
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Label htmlFor="edit-course-price">Price</Label>
                <Input
                  id="edit-course-price"
                  type="number"
                  step="0.01"
                  value={editCourseForm.price}
                  onChange={(e) => setEditCourseForm({ ...editCourseForm, price: e.target.value })}
                  required
                  className="bg-white/5 border-white/20 text-white"
                />
              </div>
              <div>
                <Label htmlFor="edit-course-difficulty">Difficulty</Label>
                <select
                  id="edit-course-difficulty"
                  value={editCourseForm.difficulty_level}
                  onChange={(e) => setEditCourseForm({ ...editCourseForm, difficulty_level: e.target.value })}
                  className="w-full p-2 rounded bg-white/5 border border-white/20 text-white"
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
              <div>
                <Label htmlFor="edit-course-duration">Duration (minutes)</Label>
                <Input
                  id="edit-course-duration"
                  type="number"
                  value={editCourseForm.duration_minutes}
                  onChange={(e) => setEditCourseForm({ ...editCourseForm, duration_minutes: e.target.value })}
                  placeholder="120"
                  className="bg-white/5 border-white/20 text-white"
                />
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="edit-course-published"
                  checked={editCourseForm.is_published}
                  onChange={(e) => setEditCourseForm({ ...editCourseForm, is_published: e.target.checked })}
                  className="rounded"
                />
                <Label htmlFor="edit-course-published">Published</Label>
              </div>
              <div className="flex space-x-2">
                <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700">
                  Update Course
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setShowEditCourse(false)}
                  className="flex-1 border-white/20 text-white hover:bg-white/10"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Video Modal */}
      {showEditVideo && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Edit Video</h3>
            <form onSubmit={handleUpdateVideo} className="space-y-4">
              <div>
                <Label htmlFor="edit-video-title">Title</Label>
                <Input
                  id="edit-video-title"
                  value={editVideoForm.title}
                  onChange={(e) => setEditVideoForm({ ...editVideoForm, title: e.target.value })}
                  required
                  className="bg-white/5 border-white/20 text-white"
                />
              </div>
              <div>
                <Label htmlFor="edit-video-description">Description</Label>
                <textarea
                  id="edit-video-description"
                  value={editVideoForm.description}
                  onChange={(e) => setEditVideoForm({ ...editVideoForm, description: e.target.value })}
                  className="w-full p-2 rounded bg-white/5 border border-white/20 text-white"
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="edit-video-course">Course</Label>
                <select
                  id="edit-video-course"
                  value={editVideoForm.course_id}
                  onChange={(e) => setEditVideoForm({ ...editVideoForm, course_id: e.target.value })}
                  required
                  className="w-full p-2 rounded bg-white/5 border border-white/20 text-white"
                >
                  <option value="">Select a course</option>
                  {courseOptions.map((course) => (
                    <option key={course.id} value={course.id}>
                      {course.title}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Label htmlFor="edit-video-url">Video URL</Label>
                <Input
                  id="edit-video-url"
                  value={editVideoForm.video_url}
                  onChange={(e) => setEditVideoForm({ ...editVideoForm, video_url: e.target.value })}
                  required
                  className="bg-white/5 border-white/20 text-white"
                />
              </div>
              <div>
                <Label htmlFor="edit-video-thumbnail">Thumbnail URL</Label>
                <Input
                  id="edit-video-thumbnail"
                  value={editVideoForm.thumbnail_url}
                  onChange={(e) => setEditVideoForm({ ...editVideoForm, thumbnail_url: e.target.value })}
                  className="bg-white/5 border-white/20 text-white"
                />
              </div>
              <div>
                <Label htmlFor="edit-video-duration">Duration (seconds)</Label>
                <Input
                  id="edit-video-duration"
                  type="number"
                  value={editVideoForm.duration_seconds}
                  onChange={(e) => setEditVideoForm({ ...editVideoForm, duration_seconds: e.target.value })}
                  required
                  className="bg-white/5 border-white/20 text-white"
                />
              </div>
              <div>
                <Label htmlFor="edit-video-order">Order Index</Label>
                <Input
                  id="edit-video-order"
                  type="number"
                  value={editVideoForm.order_index}
                  onChange={(e) => setEditVideoForm({ ...editVideoForm, order_index: e.target.value })}
                  required
                  className="bg-white/5 border-white/20 text-white"
                />
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="edit-video-free"
                  checked={editVideoForm.is_free}
                  onChange={(e) => setEditVideoForm({ ...editVideoForm, is_free: e.target.checked })}
                  className="rounded"
                />
                <Label htmlFor="edit-video-free">Free Video</Label>
              </div>
              <div className="flex space-x-2">
                <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700">
                  Update Video
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setShowEditVideo(false)}
                  className="flex-1 border-white/20 text-white hover:bg-white/10"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Course Videos Modal */}
      {showCourseVideos && selectedCourseForVideos && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-white/20 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b border-white/20">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-white">Videos in "{selectedCourseForVideos.title}"</h2>
                  <p className="text-gray-400">{courseVideos.length} video{courseVideos.length !== 1 ? 's' : ''} found</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    onClick={() => handleAddVideoToCourse(selectedCourseForVideos)}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Video
                  </Button>
                  <Button 
                    onClick={() => setShowCourseVideos(false)}
                    variant="outline"
                    className="border-white/20 text-white hover:bg-white/10"
                  >
                    Close
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="p-6 max-h-[70vh] overflow-y-auto">
              {courseVideos.length === 0 ? (
                <div className="text-center py-12">
                  <Video className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">No videos yet</h3>
                  <p className="text-gray-400 mb-6">Start building your course by adding video content</p>
                  <Button
                    onClick={() => handleAddVideoToCourse(selectedCourseForVideos)}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add First Video
                  </Button>
                </div>
              ) : (
                <div className="grid gap-4">
                  {courseVideos.map((video) => (
                    <Card key={video.id} className="bg-white/5 border-white/20">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-start space-x-4">
                              {video.thumbnail_url ? (
                                <img
                                  src={video.thumbnail_url}
                                  alt={video.title}
                                  className="w-20 h-12 object-cover rounded border border-white/20"
                                />
                              ) : (
                                <div className="w-20 h-12 bg-gray-700 rounded border border-white/20 flex items-center justify-center">
                                  <PlayCircle className="w-6 h-6 text-gray-400" />
                                </div>
                              )}
                              <div className="flex-1">
                                <h3 className="font-semibold text-white">{video.title}</h3>
                                <p className="text-gray-400 text-sm mb-2">{video.description}</p>
                                <div className="flex items-center space-x-4 text-xs text-gray-500">
                                  <span>Order: {video.order_index}</span>
                                  <span>Duration: {Math.floor(video.duration_seconds / 60)}:{(video.duration_seconds % 60).toString().padStart(2, '0')}</span>
                                  <Badge variant={video.is_free ? 'default' : 'secondary'} className="text-xs">
                                    {video.is_free ? 'Free' : 'Premium'}
                                  </Badge>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button
                              onClick={() => handleEditVideo(video)}
                              variant="outline"
                              size="sm"
                              className="border-white/20 text-white hover:bg-white/10"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              onClick={() => handleDeleteVideo(video.id)}
                              variant="outline"
                              size="sm"
                              className="border-red-500/20 text-red-400 hover:bg-red-500/10"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
