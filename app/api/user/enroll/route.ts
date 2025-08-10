import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    // Get authenticated user
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { courseId } = await request.json();

    if (!courseId) {
      return NextResponse.json(
        { error: 'Course ID is required' },
        { status: 400 }
      );
    }

    // Use authenticated user's ID
    const userId = user.userId;

    // Check if user is already enrolled
    const existingEnrollment = await query(
      'SELECT id FROM user_courses WHERE user_id = $1 AND course_id = $2',
      [userId, courseId]
    );

    if (existingEnrollment.rows.length > 0) {
      return NextResponse.json(
        { error: 'User is already enrolled in this course' },
        { status: 400 }
      );
    }

    // Check if course exists and is published
    const courseCheck = await query(
      'SELECT id, title FROM courses WHERE id = $1 AND is_published = true',
      [courseId]
    );

    if (courseCheck.rows.length === 0) {
      return NextResponse.json(
        { error: 'Course not found or not available' },
        { status: 404 }
      );
    }

    // Enroll the user
    const result = await query(
      'INSERT INTO user_courses (user_id, course_id, enrolled_at, progress_percentage) VALUES ($1, $2, CURRENT_TIMESTAMP, 0) RETURNING id',
      [userId, courseId]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Failed to enroll user' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Successfully enrolled in course',
      enrollmentId: result.rows[0].id,
      courseTitle: courseCheck.rows[0].title
    });

  } catch (error) {
    console.error('Error enrolling user:', error);
    return NextResponse.json(
      { error: 'Failed to enroll user' },
      { status: 500 }
    );
  }
}
