import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const level = searchParams.get('level');
    const sortBy = searchParams.get('sortBy') || 'popularity';
    const category = searchParams.get('category');

    let whereClause = 'WHERE c.is_published = true';
    const params: any[] = [];
    let paramIndex = 1;

    if (level && level !== 'all') {
      whereClause += ` AND c.difficulty_level = $${paramIndex}`;
      params.push(level);
      paramIndex++;
    }

    if (category && category !== 'all') {
      whereClause += ` AND cat.name = $${paramIndex}`;
      params.push(category);
      paramIndex++;
    }

    let orderClause = 'ORDER BY c.created_at DESC';
    switch (sortBy) {
      case 'price-low':
        orderClause = 'ORDER BY c.price ASC';
        break;
      case 'price-high':
        orderClause = 'ORDER BY c.price DESC';
        break;
      case 'rating':
        orderClause = 'ORDER BY c.created_at DESC'; // Fallback to newest since no ratings
        break;
      case 'popularity':
        orderClause = 'ORDER BY COUNT(DISTINCT uc.user_id) DESC';
        break;
      case 'newest':
        orderClause = 'ORDER BY c.created_at DESC';
        break;
    }

    const result = await query(`
      SELECT 
        c.id,
        c.title,
        c.description,
        c.price,
        c.difficulty_level as level,
        c.created_at,
        cat.name as category,
        COUNT(DISTINCT v.id) as total_videos,
        0 as rating,
        COUNT(DISTINCT uc.user_id) as students,
        0 as total_ratings,
        CASE 
          WHEN COUNT(DISTINCT v.id) > 0 THEN 
            ROUND(SUM(COALESCE(v.duration_seconds, 0)) / 3600.0, 1)
          ELSE 0 
        END as duration_hours
      FROM courses c
      LEFT JOIN categories cat ON c.category_id = cat.id
      LEFT JOIN videos v ON c.id = v.course_id
      LEFT JOIN user_courses uc ON c.id = uc.course_id

      ${whereClause}
      GROUP BY c.id, c.title, c.description, c.price, c.difficulty_level, c.created_at, cat.name
      ${orderClause}
    `, params);

    // Transform the data to match the expected format
    const courses = result.rows.map(course => ({
      id: course.id,
      title: course.title,
      description: course.description,
      price: course.price,
      originalPrice: Math.round(course.price * 1.3), // 30% markup for demo
      level: course.level,
      rating: Math.round(course.rating * 10) / 10, // Round to 1 decimal place
      students: course.students,
      duration: `${course.duration_hours} hours`,
      features: [
        `${course.total_videos} video lessons`,
        `${course.students} students enrolled`,
        course.level === 'beginner' ? 'Perfect for beginners' : 
        course.level === 'intermediate' ? 'Intermediate level' : 'Advanced concepts'
      ],
      category: course.category,
      created_at: course.created_at,
      total_videos: course.total_videos
    }));

    return NextResponse.json({ 
      courses,
      total: courses.length,
      filters: {
        level,
        sortBy,
        category
      }
    });

  } catch (error) {
    console.error('Error fetching courses:', error);
    return NextResponse.json(
      { error: 'Failed to fetch courses' },
      { status: 500 }
    );
  }
}
