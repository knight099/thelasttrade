import { query, testConnection } from '../lib/db';

async function addSampleVideos() {
  try {
    console.log('Testing database connection...');
    const isConnected = await testConnection();
    
    if (!isConnected) {
      console.error('Failed to connect to database');
      process.exit(1);
    }
    
    console.log('Database connected successfully!');
    
    // Get existing courses
    const coursesResult = await query('SELECT id, title FROM courses ORDER BY id');
    if (coursesResult.rows.length === 0) {
      console.error('No courses found. Please create courses first.');
      process.exit(1);
    }
    
    console.log(`Found ${coursesResult.rows.length} courses:`, coursesResult.rows.map(c => c.title));
    
    // Sample videos for different courses
    const sampleVideos = [
      // For course 1 (Beginner's Course)
      {
        course_id: coursesResult.rows[0]?.id,
        title: 'Introduction to Stock Trading',
        description: 'Learn the basics of what stock trading is and how the market works.',
        video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', // Sample URL
        thumbnail_url: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=300',
        duration_seconds: 900, // 15 minutes
        order_index: 1,
        is_free: true
      },
      {
        course_id: coursesResult.rows[0]?.id,
        title: 'Understanding Market Terminology',
        description: 'Key terms and concepts every trader should know.',
        video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        thumbnail_url: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=300',
        duration_seconds: 720, // 12 minutes
        order_index: 2,
        is_free: true
      },
      {
        course_id: coursesResult.rows[0]?.id,
        title: 'How to Place Your First Trade',
        description: 'Step-by-step guide to executing your first stock trade.',
        video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        thumbnail_url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=300',
        duration_seconds: 1080, // 18 minutes
        order_index: 3,
        is_free: false
      },
      
      // For course 2 (Advanced Trading Strategies)
      {
        course_id: coursesResult.rows[1]?.id,
        title: 'Advanced Chart Patterns',
        description: 'Master complex chart patterns for better trading decisions.',
        video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        thumbnail_url: 'https://images.unsplash.com/photo-1642790106117-e829e14a795f?w=300',
        duration_seconds: 1500, // 25 minutes
        order_index: 1,
        is_free: false
      },
      {
        course_id: coursesResult.rows[1]?.id,
        title: 'Options Trading Fundamentals',
        description: 'Introduction to options contracts and strategies.',
        video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        thumbnail_url: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=300',
        duration_seconds: 1800, // 30 minutes
        order_index: 2,
        is_free: false
      },
      {
        course_id: coursesResult.rows[1]?.id,
        title: 'Risk Management in Advanced Trading',
        description: 'Protect your capital with advanced risk management techniques.',
        video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        thumbnail_url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=300',
        duration_seconds: 1200, // 20 minutes
        order_index: 3,
        is_free: false
      }
    ];
    
    console.log('Creating sample videos...');
    
    for (const video of sampleVideos) {
      if (video.course_id) {
        try {
          // Check if video with same title already exists for this course
          const existingVideo = await query(
            'SELECT id FROM videos WHERE course_id = $1 AND title = $2',
            [video.course_id, video.title]
          );
          
          if (existingVideo.rows.length === 0) {
            await query(
              `INSERT INTO videos (title, description, course_id, video_url, thumbnail_url, duration_seconds, order_index, is_free) 
               VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
              [
                video.title,
                video.description,
                video.course_id,
                video.video_url,
                video.thumbnail_url,
                video.duration_seconds,
                video.order_index,
                video.is_free
              ]
            );
            console.log(`✓ Created video: "${video.title}" for course ID ${video.course_id}`);
          } else {
            console.log(`- Video "${video.title}" already exists for course ID ${video.course_id}`);
          }
        } catch (error) {
          console.error(`Error creating video "${video.title}":`, error);
        }
      }
    }
    
    // Verify videos were created
    const totalVideos = await query('SELECT COUNT(*) as count FROM videos');
    console.log(`\nTotal videos in database: ${totalVideos.rows[0].count}`);
    
    // Show videos by course
    const videosByCourse = await query(`
      SELECT 
        c.title as course_title,
        COUNT(v.id) as video_count,
        SUM(v.duration_seconds) as total_duration_seconds
      FROM courses c
      LEFT JOIN videos v ON c.id = v.course_id
      GROUP BY c.id, c.title
      ORDER BY c.id
    `);
    
    console.log('\nVideos by course:');
    videosByCourse.rows.forEach(row => {
      const totalMinutes = Math.floor((row.total_duration_seconds || 0) / 60);
      console.log(`- ${row.course_title}: ${row.video_count} videos (${totalMinutes} minutes total)`);
    });
    
    console.log('\nSample videos added successfully!');
    console.log('You can now:');
    console.log('1. Go to /admin and view videos for each course');
    console.log('2. Click on courses in /courses to see their video content');
    console.log('3. Add more videos through the admin panel');
    
  } catch (error) {
    console.error('Error adding sample videos:', error);
    process.exit(1);
  }
}

addSampleVideos();
