import React, { useEffect, useState } from 'react';
import { 
  Container, 
  Grid, 
  Card, 
  CardContent, 
  CardMedia, 
  Typography, 
  Button,
  Box,
  CircularProgress
} from '@mui/material';
import GetBlogPosts from './GetBlogPost';

const Blogs = () => {
  const [blogPosts, setBlogPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlogPosts = async () => {
      try {
        const posts = await GetBlogPosts();
        setBlogPosts(posts);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching blog posts:', err);
        setError('Failed to fetch blog posts');
        setLoading(false);
      }
    };

    fetchBlogPosts();
  }, []);

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Typography variant="h5" color="error" align="center">
          {error}
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Typography variant="h2" component="h1" gutterBottom align="center" sx={{ mb: 6 }}>
        Our Latest Blog Posts
      </Typography>
      <Grid container spacing={4}>
        {blogPosts.map((post, index) => (
          <Grid item key={index} xs={12} sm={6} md={4}>
            <Card 
              sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                transition: '0.3s',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
                },
              }}
            >
              <CardMedia
                component="img"
                height="200"
                image={post.fields.image || 'https://source.unsplash.com/random/800x600?blog'}
                alt={post.fields.title}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h5" component="h2">
                  {post.fields.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {new Date(post.fields.publishedDate).toLocaleDateString()}
                </Typography>
                <Typography>
                  {post.fields.shortDescription}
                </Typography>
              </CardContent>
              <Box sx={{ p: 2 }}>
                <Button variant="outlined" fullWidth>
                  Read More
                </Button>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Blogs;
