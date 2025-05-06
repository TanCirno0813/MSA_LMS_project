import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Grid, Card, CardContent, CardHeader, Typography,
  Container, Divider, FormControl, InputLabel, Select,
  MenuItem, Box, SelectChangeEvent, Rating, Chip
} from '@mui/material';

interface ReviewDTO {
  id: number;
  lectureTitle: string;
  author: string;
  content: string;
  createdAt: string;
  title: string;
  rating?: number;
}

const ReviewList: React.FC = () => {
  const [reviews, setReviews] = useState<ReviewDTO[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedLecture, setSelectedLecture] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('newest');

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get('/api/reviews');
        setReviews(response.data);
        setError(null);
      } catch (err) {
        console.error('리뷰 로딩 중 오류 발생:', err);
        setError('리뷰를 불러오는 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  const handleLectureChange = (event: SelectChangeEvent) => {
    setSelectedLecture(event.target.value);
  };

  const handleSortChange = (event: SelectChangeEvent) => {
    setSortBy(event.target.value);
  };

  const getUniqueLectures = () => {
    const lectures = reviews.map(review => review.lectureTitle);
    return ['all', ...Array.from(new Set(lectures))];
  };

  const filteredAndSortedReviews = reviews
    .filter(review => selectedLecture === 'all' || review.lectureTitle === selectedLecture)
    .sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    });

  if (loading) {
    return <Container sx={{ my: 4 }}><Typography>리뷰를 불러오는 중입니다...</Typography></Container>;
  }

  if (error) {
    return <Container sx={{ my: 4 }}><Typography color="error">{error}</Typography></Container>;
  }

  return (
    <Container maxWidth="lg" sx={{ my: 4 }}>
      <Typography variant="h4" gutterBottom>전체 리뷰 목록</Typography>
      
      <Box sx={{ mb: 4, display: 'flex', gap: 2 }}>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>강의 선택</InputLabel>
          <Select
            value={selectedLecture}
            label="강의 선택"
            onChange={handleLectureChange}
          >
            {getUniqueLectures().map((lecture) => (
              <MenuItem key={lecture} value={lecture}>
                {lecture === 'all' ? '전체 강의' : lecture}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>정렬 기준</InputLabel>
          <Select
            value={sortBy}
            label="정렬 기준"
            onChange={handleSortChange}
          >
            <MenuItem value="newest">최신순</MenuItem>
            <MenuItem value="oldest">오래된순</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {filteredAndSortedReviews.length === 0 ? (
        <Typography>작성된 리뷰가 없습니다.</Typography>
      ) : (
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
          {filteredAndSortedReviews.map((review) => (
            <Box key={review.id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardHeader
                  title={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="h6">{review.title}</Typography>
                      {review.rating && (
                        <Rating value={review.rating} readOnly size="small" />
                      )}
                    </Box>
                  }
                  subheader={
                    <Box sx={{ mt: 1 }}>
                      <Chip 
                        label={review.lectureTitle} 
                        size="small" 
                        color="primary" 
                        sx={{ mr: 1 }} 
                      />
                      <Typography variant="body2" component="span">
                        작성자: {review.author}
                      </Typography>
                    </Box>
                  }
                />
                <Divider />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      mb: 2,
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}
                  >
                    {review.content}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    작성일: {new Date(review.createdAt).toLocaleDateString('ko-KR')}
                  </Typography>
                </CardContent>
              </Card>
            </Box>
          ))}
        </Box>
      )}
    </Container>
  );
};

export default ReviewList;
