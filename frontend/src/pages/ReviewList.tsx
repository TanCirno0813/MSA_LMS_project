import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Grid, Card, CardContent, CardHeader, Typography,
  Container, Divider
} from '@mui/material';

interface ReviewDTO {
  id: number;
  lectureTitle: string; // ✅ 추가
  author: string;
  content: string;
  createdAt: string;
  title: string;
}

const ReviewList: React.FC = () => {
  const [reviews, setReviews] = useState<ReviewDTO[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get('/api/reviews'); // ✅ Gateway → review-service → lecture-service
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

  if (loading) {
    return <Container sx={{ my: 4 }}><Typography>리뷰를 불러오는 중입니다...</Typography></Container>;
  }

  if (error) {
    return <Container sx={{ my: 4 }}><Typography color="error">{error}</Typography></Container>;
  }

  return (
      <Container maxWidth="lg" sx={{ my: 4 }}>
        <Typography variant="h4" gutterBottom>전체 리뷰 목록</Typography>

        {reviews.length === 0 ? (
            <Typography>작성된 리뷰가 없습니다.</Typography>
        ) : (
            <Grid container spacing={3}>
              {reviews.map((review) => (
                  <Grid key={review.id} item xs={12} md={6}>
                    <Card>
                      <CardHeader
                          title={review.title}
                          subheader={`강의명: ${review.lectureTitle} | 작성자: ${review.author}`}
                      />
                      <Divider />
                      <CardContent>
                        <Typography>{review.content}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          작성일: {new Date(review.createdAt).toLocaleDateString('ko-KR')}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
              ))}
            </Grid>
        )}
      </Container>
  );
};

export default ReviewList;
