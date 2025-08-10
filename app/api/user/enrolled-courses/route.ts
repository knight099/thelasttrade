import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    // Get authenticated user
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Use authenticated user's ID
    const userId = user.userId;

    const result = await query(`
      SELECT 
        c.id,
        c.title,
        c.description,
        c.thumbnail_url,
        c.price,
        c.difficulty_level as level,
        c.duration_minutes,
        cat.name as category,
        uc.enrolled_at,
        uc.progress_percentage,
        uc.completed_at,
        COUNT(DISTINCT v.id) as total_videos,
        COUNT(DISTINCT CASE WHEN uvp.is_completed = true THEN uvp.video_id END) as completed_videos
      FROM user_courses uc
      JOIN courses c ON uc.course_id = c.id
      LEFT JOIN categories cat ON c.category_id = cat.id
      LEFT JOIN videos v ON c.id = v.course_id
      LEFT JOIN user_video_progress uvp ON v.id = uvp.video_id AND uvp.user_id = uc.user_id
      WHERE uc.user_id = $1
      GROUP BY c.id, c.title, c.description, c.thumbnail_url, c.price, c.difficulty_level, c.duration_minutes, cat.name, uc.enrolled_at, uc.progress_percentage, uc.completed_at
      ORDER BY uc.enrolled_at DESC
    `, [userId]);

    const courses = result.rows.map(course => ({
      id: course.id,
      title: course.title,
      description: course.description,
      thumbnail_url: course.thumbnail_url,
      price: course.price,
      level: course.level,
      category: course.category,
      enrolled_at: course.enrolled_at,
      progress_percentage: course.progress_percentage,
      completed_at: course.completed_at,
      total_videos: parseInt(course.total_videos) || 0,
      completed_videos: parseInt(course.completed_videos) || 0,
      duration_minutes: course.duration_minutes || 0
    }));

    return NextResponse.json({
      courses,
      total: courses.length
    });

  } catch (error) {
    console.error('Error fetching enrolled courses:', error);
    return NextResponse.json(
      { error: 'Failed to fetch enrolled courses' },
      { status: 500 }
    );
  }
}
