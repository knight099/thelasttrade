import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check if user is authenticated
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const courseId = parseInt(params.id);

    if (isNaN(courseId)) {
      return NextResponse.json(
        { error: 'Invalid course ID' },
        { status: 400 }
      );
    }

    // Check if user is enrolled in this course (unless they're admin)
    if (user.role !== 'admin') {
      const enrollmentCheck = await query(
        'SELECT id FROM user_courses WHERE user_id = $1 AND course_id = $2',
        [user.userId, courseId]
      );

      if (enrollmentCheck.rows.length === 0) {
        return NextResponse.json(
          { error: 'You must be enrolled in this course to view its content' },
          { status: 403 }
        );
      }
    }

    // First, verify the course exists
    const courseCheck = await query(
      'SELECT id, title, description FROM courses WHERE id = $1',
      [courseId]
    );

    if (courseCheck.rows.length === 0) {
      return NextResponse.json(
        { error: 'Course not found' },
        { status: 404 }
      );
    }

    const course = courseCheck.rows[0];

    // Get all videos for this course, ordered by order_index and then by creation date
    const videosResult = await query(`
      SELECT 
        v.id,
        v.title,
        v.description,
        v.video_url,
        v.thumbnail_url,
        v.duration_seconds,
        v.order_index,
        v.is_free,
        v.created_at
      FROM videos v
      WHERE v.course_id = $1
      ORDER BY v.order_index ASC, v.created_at ASC
    `, [courseId]);

    // Format duration to MM:SS
    const formatDuration = (seconds: number) => {
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = seconds % 60;
      return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    // Calculate total duration
    const totalDurationSeconds = videosResult.rows.reduce(
      (total, video) => total + (video.duration_seconds || 0), 
      0
    );

    const videos = videosResult.rows.map(video => ({
      id: video.id,
      title: video.title,
      description: video.description,
      video_url: video.video_url,
      thumbnail_url: video.thumbnail_url,
      duration_seconds: video.duration_seconds,
      duration_formatted: formatDuration(video.duration_seconds || 0),
      order_index: video.order_index,
      is_free: video.is_free,
      created_at: video.created_at
    }));

    return NextResponse.json({
      course: {
        id: course.id,
        title: course.title,
        description: course.description
      },
      videos,
      stats: {
        total_videos: videos.length,
        total_duration_seconds: totalDurationSeconds,
        total_duration_formatted: formatDuration(totalDurationSeconds),
        free_videos: videos.filter(v => v.is_free).length
      }
    });

  } catch (error) {
    console.error('Error fetching course videos:', error);
    return NextResponse.json(
      { error: 'Failed to fetch course videos' },
      { status: 500 }
    );
  }
}
