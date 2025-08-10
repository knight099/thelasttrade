"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  Maximize, 
  ArrowLeft,
  CheckCircle,
  Circle,
  Clock,
  BookOpen
} from 'lucide-react';
import { toast } from 'sonner';

interface Video {
  id: number;
  title: string;
  description: string;
  video_url: string;
  thumbnail_url: string;
  duration_seconds: number;
  order_index: number;
  is_free: boolean;
  is_completed: boolean;
  watched_seconds: number;
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

export default function CoursePage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.id as string;
  
  const [course, setCourse] = useState<Course | null>(null);
  const [videos, setVideos] = useState<Video[]>([]);
  const [currentVideo, setCurrentVideo] = useState<Video | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        // Authentication is now handled by middleware, no need to check localStorage
        // Fetch course videos using the new API
        const videosResponse = await fetch(`/api/courses/${courseId}/videos`);
        if (videosResponse.ok) {
          const videosData = await videosResponse.json();
          
          // Set course data
          setCourse({
            id: videosData.course.id,
            title: videosData.course.title,
            description: videosData.course.description,
            thumbnail_url: '',
            progress_percentage: 0,
            total_videos: videosData.stats.total_videos,
            completed_videos: 0,
            duration_minutes: Math.floor(videosData.stats.total_duration_seconds / 60),
            difficulty_level: 'intermediate'
          });
          
          // Set videos with additional properties
          const formattedVideos = videosData.videos.map((video: any) => ({
            ...video,
            is_completed: false,
            watched_seconds: 0
          }));
          
          setVideos(formattedVideos);
          if (formattedVideos.length > 0) {
            setCurrentVideo(formattedVideos[0]);
          }
        } else {
          const errorData = await videosResponse.json();
          
          if (videosResponse.status === 401) {
            toast.error('Please sign in to access course content');
            router.push('/');
            return;
          } else if (videosResponse.status === 403) {
            toast.error('You must be enrolled in this course to view its content');
            router.push('/dashboard');
            return;
          } else {
            toast.error(errorData.error || 'Failed to load course content');
          }
        }
      } catch (error) {
        console.error('Error fetching course data:', error);
        toast.error('Failed to load course data');
      } finally {
        setLoading(false);
      }
    };

    fetchCourseData();
  }, [courseId, router]);

  const handleVideoSelect = (video: Video) => {
    setCurrentVideo(video);
    setCurrentTime(0);
    setIsPlaying(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleVideoProgress = (videoId: number, watchedSeconds: number) => {
    // Update video progress in the backend
    setVideos(prev => prev.map(v => 
      v.id === videoId 
        ? { ...v, watched_seconds: watchedSeconds, is_completed: watchedSeconds >= v.duration_seconds }
        : v
    ));
  };

  const handleNextVideo = () => {
    if (currentVideo) {
      const currentIndex = videos.findIndex(v => v.id === currentVideo.id);
      if (currentIndex < videos.length - 1) {
        handleVideoSelect(videos[currentIndex + 1]);
      }
    }
  };

  const handlePreviousVideo = () => {
    if (currentVideo) {
      const currentIndex = videos.findIndex(v => v.id === currentVideo.id);
      if (currentIndex > 0) {
        handleVideoSelect(videos[currentIndex - 1]);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen trading-bg pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
            <p className="text-white mt-4">Loading course...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!course || !currentVideo) {
    return (
      <div className="min-h-screen trading-bg pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
              <BookOpen className="h-12 w-12 text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">Course Not Found</h2>
            <p className="text-gray-400 mb-6">The course you&apos;re looking for doesn&apos;t exist or you don&apos;t have access to it.</p>
            <Button 
              onClick={() => router.push('/dashboard')}
              className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
            >
              Back to Dashboard
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen trading-bg pt-20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button 
            variant="ghost" 
            onClick={() => router.back()}
            className="text-white hover:bg-white/10"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <div className="text-right">
            <h1 className="text-2xl font-bold text-white">{course.title}</h1>
            <p className="text-gray-300">Progress: {course.progress_percentage}%</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Video Player */}
          <div className="lg:col-span-2">
            <Card className="glass border-white/20">
              <CardContent className="p-0">
                {/* Video Player Placeholder */}
                <div className="relative bg-black rounded-t-lg">
                  <div className="aspect-video bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Play className="h-12 w-12 text-white" />
                      </div>
                      <p className="text-white text-lg">Video Player</p>
                      <p className="text-gray-400 text-sm">Click to play</p>
                    </div>
                  </div>
                  
                  {/* Video Controls */}
                  <div className="p-4 bg-black/50">
                    <div className="flex items-center space-x-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handlePreviousVideo}
                        className="text-white hover:bg-white/20"
                      >
                        <SkipBack className="h-4 w-4" />
                      </Button>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsPlaying(!isPlaying)}
                        className="text-white hover:bg-white/20"
                      >
                        {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                      </Button>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleNextVideo}
                        className="text-white hover:bg-white/20"
                      >
                        <SkipForward className="h-4 w-4" />
                      </Button>
                      
                      <div className="flex-1 mx-4">
                        <div className="flex items-center space-x-2 text-white text-sm">
                          <span>{formatTime(currentTime)}</span>
                          <div className="flex-1 bg-white/20 rounded-full h-1">
                            <div 
                              className="bg-green-500 h-1 rounded-full"
                              style={{ width: `${(currentTime / duration) * 100}%` }}
                            />
                          </div>
                          <span>{formatTime(duration)}</span>
                        </div>
                      </div>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-white hover:bg-white/20"
                      >
                        <Volume2 className="h-4 w-4" />
                      </Button>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-white hover:bg-white/20"
                      >
                        <Maximize className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
                
                {/* Video Info */}
                <div className="p-6">
                  <h2 className="text-xl font-bold text-white mb-2">{currentVideo.title}</h2>
                  <p className="text-gray-300 mb-4">{currentVideo.description}</p>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-400">
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>{formatTime(currentVideo.duration_seconds)}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <BookOpen className="h-4 w-4" />
                      <span>Lesson {currentVideo.order_index}</span>
                    </div>
                    {currentVideo.is_free && (
                      <Badge variant="secondary" className="bg-green-500 text-white">
                        Free
                      </Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Video List */}
          <div className="lg:col-span-1">
            <Card className="glass border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Course Content</CardTitle>
                <CardDescription className="text-gray-300">
                  {course.completed_videos} of {course.total_videos} videos completed
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="space-y-1">
                  {videos.map((video, index) => (
                    <div key={video.id}>
                      <div
                        className={`p-4 cursor-pointer transition-colors ${
                          currentVideo?.id === video.id
                            ? 'bg-white/10 border-l-4 border-green-500'
                            : 'hover:bg-white/5'
                        }`}
                        onClick={() => handleVideoSelect(video)}
                      >
                        <div className="flex items-start space-x-3">
                          <div className="flex-shrink-0 mt-1">
                            {video.is_completed ? (
                              <CheckCircle className="h-5 w-5 text-green-500" />
                            ) : (
                              <Circle className="h-5 w-5 text-gray-400" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-medium text-white truncate">
                              {video.title}
                            </h4>
                            <p className="text-xs text-gray-400 mt-1">
                              {formatTime(video.duration_seconds)}
                            </p>
                            {video.watched_seconds > 0 && !video.is_completed && (
                              <div className="mt-2">
                                <div className="w-full bg-gray-600 rounded-full h-1">
                                  <div 
                                    className="bg-green-500 h-1 rounded-full transition-all duration-300"
                                    style={{ 
                                      width: `${Math.min(100, Math.max(0, (video.watched_seconds / video.duration_seconds) * 100 || 0))}%` 
                                    }}
                                  />
                                </div>
                              </div>
                            )}
                          </div>
                          {video.is_free && (
                            <Badge variant="secondary" className="bg-green-500 text-white text-xs">
                              Free
                            </Badge>
                          )}
                        </div>
                      </div>
                      {index < videos.length - 1 && <Separator className="mx-4" />}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
