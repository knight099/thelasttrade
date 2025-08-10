import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const { title, description, course_id, video_url, thumbnail_url, duration_seconds, order_index, is_free } = await request.json();

    // Validate required fields
    if (!title || !course_id || !video_url) {
      return NextResponse.json(
        { error: 'Title, course ID, and video URL are required' },
        { status: 400 }
      );
    }

    // Check if course exists
    const courseCheck = await query(
      'SELECT id, title FROM courses WHERE id = $1',
      [course_id]
    );

    if (courseCheck.rows.length === 0) {
      return NextResponse.json(
        { error: 'Invalid course ID' },
        { status: 400 }
      );
    }

    // Insert new video
    const result = await query(
      `INSERT INTO videos (title, description, course_id, video_url, thumbnail_url, duration_seconds, order_index, is_free) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
       RETURNING id, title, description, course_id, video_url, thumbnail_url, duration_seconds, order_index, is_free, created_at`,
      [title, description || '', course_id, video_url, thumbnail_url || '', duration_seconds || 0, order_index || 0, is_free || false]
    );

    const newVideo = result.rows[0];
    const courseTitle = courseCheck.rows[0].title;

    // Convert duration to MM:SS format
    const formatDuration = (seconds: number) => {
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = seconds % 60;
      return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    return NextResponse.json({
      message: 'Video created successfully',
      video: {
        id: newVideo.id,
        title: newVideo.title,
        course: courseTitle,
        duration: formatDuration(newVideo.duration_seconds),
        upload_date: newVideo.created_at,
        status: 'published'
      }
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating video:', error);
    return NextResponse.json(
      { error: 'Failed to create video' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const result = await query(`
      SELECT 
        v.id,
        v.title,
        v.description,
        v.course_id,
        c.title as course_title,
        v.video_url,
        v.thumbnail_url,
        v.duration_seconds,
        v.order_index,
        v.is_free,
        v.created_at
      FROM videos v
      LEFT JOIN courses c ON v.course_id = c.id
      ORDER BY c.title, v.order_index, v.created_at DESC
    `);

    // Format the response to match the expected interface
    const formattedVideos = result.rows.map(video => ({
      id: video.id,
      title: video.title,
      description: video.description,
      course_id: video.course_id,
      course_title: video.course_title || 'Unknown Course',
      video_url: video.video_url,
      thumbnail_url: video.thumbnail_url,
      duration_seconds: video.duration_seconds,
      order_index: video.order_index,
      is_free: video.is_free,
      created_at: video.created_at
    }));

    return NextResponse.json({ videos: formattedVideos });
  } catch (error) {
    console.error('Error fetching videos:', error);
    return NextResponse.json(
      { error: 'Failed to fetch videos' },
      { status: 500 }
    );
  }
}
