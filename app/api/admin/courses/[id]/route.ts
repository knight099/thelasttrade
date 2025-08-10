import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const courseId = parseInt(params.id);
    const { title, description, category_id, price, difficulty_level, is_published, duration_minutes } = await request.json();

    if (!courseId || !title || !description || !category_id || !price || !difficulty_level) {
      return NextResponse.json(
        { error: 'All required fields are required' },
        { status: 400 }
      );
    }

    // Check if course exists
    const existingCourse = await query(
      'SELECT id FROM courses WHERE id = $1',
      [courseId]
    );

    if (existingCourse.rows.length === 0) {
      return NextResponse.json(
        { error: 'Course not found' },
        { status: 404 }
      );
    }

    // Update the course
    const result = await query(
      `UPDATE courses 
       SET title = $1, description = $2, category_id = $3, price = $4, 
           difficulty_level = $5, is_published = $6, duration_minutes = $7, updated_at = CURRENT_TIMESTAMP
       WHERE id = $8 
       RETURNING id, title, description, price, difficulty_level, is_published, duration_minutes, updated_at`,
      [title, description, category_id, price, difficulty_level, is_published, duration_minutes || 0, courseId]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Failed to update course' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Course updated successfully',
      course: result.rows[0]
    });

  } catch (error) {
    console.error('Error updating course:', error);
    return NextResponse.json(
      { error: 'Failed to update course' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const courseId = parseInt(params.id);

    if (!courseId) {
      return NextResponse.json(
        { error: 'Course ID is required' },
        { status: 400 }
      );
    }

    // Check if course exists
    const existingCourse = await query(
      'SELECT id FROM courses WHERE id = $1',
      [courseId]
    );

    if (existingCourse.rows.length === 0) {
      return NextResponse.json(
        { error: 'Course not found' },
        { status: 404 }
      );
    }

    // Delete the course (this will cascade to related videos and enrollments)
    await query('DELETE FROM courses WHERE id = $1', [courseId]);

    return NextResponse.json({
      success: true,
      message: 'Course deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting course:', error);
    return NextResponse.json(
      { error: 'Failed to delete course' },
      { status: 500 }
    );
  }
}
