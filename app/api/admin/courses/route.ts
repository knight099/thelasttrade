import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, category_id, price, difficulty_level, is_published, duration_minutes } = body;
    
    // Debug logging
    console.log('Course creation request body:', body);
    console.log('Extracted values:', { title, description, category_id, price, difficulty_level, is_published, duration_minutes });

    // Validate required fields
    if (!title || title.trim() === '') {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      );
    }
    
    if (!description || description.trim() === '') {
      return NextResponse.json(
        { error: 'Description is required' },
        { status: 400 }
      );
    }
    
    if (!category_id || category_id === '') {
      return NextResponse.json(
        { error: 'Category is required' },
        { status: 400 }
      );
    }

    // Check if category exists
    const categoryCheck = await query(
      'SELECT id FROM categories WHERE id = $1',
      [category_id]
    );

    if (categoryCheck.rows.length === 0) {
      return NextResponse.json(
        { error: 'Invalid category ID' },
        { status: 400 }
      );
    }

    // Insert new course (assuming admin user with ID 1 for now)
    const result = await query(
      `INSERT INTO courses (title, description, category_id, instructor_id, price, difficulty_level, is_published, duration_minutes) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
       RETURNING id, title, description, category_id, instructor_id, price, difficulty_level, is_published, duration_minutes, created_at`,
      [title, description, category_id, 1, price || 0, difficulty_level || 'beginner', is_published || false, duration_minutes || 0]
    );

    const newCourse = result.rows[0];

    // Get category name for response
    const categoryResult = await query(
      'SELECT name FROM categories WHERE id = $1',
      [category_id]
    );

    return NextResponse.json({
      message: 'Course created successfully',
      course: {
        id: newCourse.id,
        title: newCourse.title,
        description: newCourse.description,
        category: categoryResult.rows[0]?.name || 'Unknown',
        instructor: 'Admin',
        total_videos: 0,
        enrolled_students: 0,
        is_published: newCourse.is_published,
        created_at: newCourse.created_at
      }
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating course:', error);
    return NextResponse.json(
      { error: 'Failed to create course' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const result = await query(`
      SELECT 
        c.id,
        c.title,
        c.description,
        c.category_id,
        cat.name as category,
        c.price,
        c.difficulty_level,
        c.is_published,
        c.created_at,
        c.duration_minutes,
        COUNT(DISTINCT v.id) as total_videos,
        COUNT(DISTINCT uc.user_id) as enrolled_students
      FROM courses c
      LEFT JOIN categories cat ON c.category_id = cat.id
      LEFT JOIN videos v ON c.id = v.course_id
      LEFT JOIN user_courses uc ON c.id = uc.course_id
      GROUP BY c.id, c.title, c.description, c.category_id, cat.name, c.price, c.difficulty_level, c.is_published, c.created_at, c.duration_minutes
      ORDER BY c.created_at DESC
    `);

    return NextResponse.json({ courses: result.rows });
  } catch (error) {
    console.error('Error fetching courses:', error);
    return NextResponse.json(
      { error: 'Failed to fetch courses' },
      { status: 500 }
    );
  }
}
