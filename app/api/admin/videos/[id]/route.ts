import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const videoId = parseInt(params.id);
    const { title, description, course_id, video_url, thumbnail_url, duration_seconds, order_index, is_free } = await request.json();

    // Validate required fields
    if (!title || !course_id || !video_url) {
      return NextResponse.json(
        { error: 'Title, course ID, and video URL are required' },
        { status: 400 }
      );
    }

    // Check if video exists
    const videoCheck = await query(
      'SELECT id FROM videos WHERE id = $1',
      [videoId]
    );

    if (videoCheck.rows.length === 0) {
      return NextResponse.json(
        { error: 'Video not found' },
        { status: 404 }
      );
    }

    // Check if course exists
    const courseCheck = await query(
      'SELECT id FROM courses WHERE id = $1',
      [course_id]
    );

    if (courseCheck.rows.length === 0) {
      return NextResponse.json(
        { error: 'Invalid course ID' },
        { status: 400 }
      );
    }

    // Update video
    const result = await query(
      `UPDATE videos 
       SET title = $1, description = $2, course_id = $3, video_url = $4, 
           thumbnail_url = $5, duration_seconds = $6, order_index = $7, is_free = $8,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $9 
       RETURNING id, title, description, course_id, video_url, thumbnail_url, duration_seconds, order_index, is_free, created_at, updated_at`,
      [title, description || '', course_id, video_url, thumbnail_url || '', duration_seconds || 0, order_index || 0, is_free || false, videoId]
    );

    const updatedVideo = result.rows[0];

    return NextResponse.json({
      message: 'Video updated successfully',
      video: updatedVideo
    });

  } catch (error) {
    console.error('Error updating video:', error);
    return NextResponse.json(
      { error: 'Failed to update video' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const videoId = parseInt(params.id);

    // Check if video exists
    const videoCheck = await query(
      'SELECT id FROM videos WHERE id = $1',
      [videoId]
    );

    if (videoCheck.rows.length === 0) {
      return NextResponse.json(
        { error: 'Video not found' },
        { status: 404 }
      );
    }

    // Delete video
    await query(
      'DELETE FROM videos WHERE id = $1',
      [videoId]
    );

    return NextResponse.json({
      message: 'Video deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting video:', error);
    return NextResponse.json(
      { error: 'Failed to delete video' },
      { status: 500 }
    );
  }
}
