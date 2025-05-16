import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ReviewList.css';
import {
   Card, CardContent, CardHeader, Typography,
  Container, Divider, FormControl, InputLabel, Select,
  MenuItem, Box, SelectChangeEvent, Chip, Paper, Badge, Avatar, Tooltip,
  Pagination
} from '@mui/material';
import { DateRange, School, Sort, RateReview, Bookmark, Forum, Person } from '@mui/icons-material';


interface ReviewDTO {
  id: number;
  lectureTitle: string;
  author: string;
  content: string;
  createdAt: string;
  title: string;

}

const ReviewList: React.FC = () => {
  const [reviews, setReviews] = useState<ReviewDTO[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedLecture, setSelectedLecture] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('newest');
  const [page, setPage] = useState(1);
  const ITEMS_PER_PAGE = 6;

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

  const totalPages = Math.ceil(filteredAndSortedReviews.length / ITEMS_PER_PAGE);
  const paginatedReviews = filteredAndSortedReviews.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 프로필 이미지 생성 함수 - 사용자 이름 기반 임의 색상 할당
  const getProfileColor = (name: string) => {
    const colors = ['#028267', '#5e35b1', '#d81b60', '#039be5', '#fb8c00', '#546e7a'];
    const hash = name.split('').reduce((acc, char) => char.charCodeAt(0) + acc, 0);
    return colors[hash % colors.length];
  };

  // 날짜 포맷팅
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const diffDays = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return '오늘';
    } else if (diffDays === 1) {
      return '어제';
    } else if (diffDays < 7) {
      return `${diffDays}일 전`;
    } else {
      return date.toLocaleDateString('ko-KR', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      });
    }
  };

  if (loading) {
    return <Container sx={{ my: 4 }}><Typography>리뷰를 불러오는 중입니다...</Typography></Container>;
  }

  if (error) {
    return <Container sx={{ my: 4 }}><Typography color="error">{error}</Typography></Container>;
  }

  return (
    <Container maxWidth="lg" className="review-list-container">
      <Box className="review-list-header">
        <Box className="review-list-header-top">
          <Typography variant="h4" className="review-list-title">
            전체 리뷰 목록
          </Typography>
          <Badge 
            badgeContent={filteredAndSortedReviews.length} 
            color="primary" 
            showZero
            sx={{ 
              '& .MuiBadge-badge': { 
                display: 'none' 
              } 
            }}
          >
            
          </Badge>
        </Box>

        <Typography variant="body1" className="review-list-subtitle">
          수강생들이 직접 남긴 리뷰를 통해 강의의 품질을 확인해보세요.<br />
          리뷰를 참고하면 더 나은 학습 선택에 도움이 됩니다.
        </Typography>

        <RateReview className="review-header-icon" />
      </Box>
      
      <Paper elevation={0} className="review-filter-container">
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center' }}>
          <FormControl sx={{ minWidth: 220, flex: { xs: '1 1 100%', sm: '0 1 auto' } }}>
            <InputLabel>강의 선택</InputLabel>
            <Select
              value={selectedLecture}
              label="강의 선택"
              onChange={handleLectureChange}
              startAdornment={<School sx={{ mr: 1, ml: -0.5, color: '#028267' }} />}
            >
              {getUniqueLectures().map((lecture) => (
                <MenuItem key={lecture} value={lecture}>
                  {lecture === 'all' ? '전체 강의' : lecture}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl sx={{ minWidth: 220, flex: { xs: '1 1 100%', sm: '0 1 auto' } }}>
            <InputLabel>정렬 기준</InputLabel>
            <Select
              value={sortBy}
              label="정렬 기준"
              onChange={handleSortChange}
              startAdornment={<Sort sx={{ mr: 1, ml: -0.5, color: '#028267' }} />}
            >
              <MenuItem value="newest">최신순</MenuItem>
              <MenuItem value="oldest">오래된순</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Paper>

      {filteredAndSortedReviews.length === 0 ? (
        <Box className="review-empty">
          <Forum sx={{ fontSize: 60, color: '#ccc', mb: 2 }} />
          <Typography variant="h6">작성된 리뷰가 없습니다.</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            선택된 강의에 대한 리뷰가 아직 없습니다. 다른 강의를 선택하거나 나중에 다시 확인해주세요.
          </Typography>
        </Box>
      ) : (
        <>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3, mt: 3 }}>
            {paginatedReviews.map((review) => (
              <Card key={review.id} className="review-card">
                <CardHeader
                  avatar={
                    <Tooltip title={review.author}>
                      <Avatar 
                        sx={{ 
                          bgcolor: getProfileColor(review.author),
                          width: 40,
                          height: 40
                        }}
                      >
                        {review.author.charAt(0).toUpperCase()}
                      </Avatar>
                    </Tooltip>
                  }
                  title={
                    <Typography className="review-title">{review.title}</Typography>
                  }
                  subheader={
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                      <Chip 
                        label={review.lectureTitle} 
                        size="small" 
                        color="primary" 
                        variant="outlined"
                        className="review-chip"
                        icon={<Bookmark sx={{ fontSize: '0.9rem', color: '#028267' }} />}
                      />

                    </Box>
                  }
                />
                <Divider />
                <CardContent>
                  <Typography 
                    className="review-content"
                  >
                    {review.content}
                  </Typography>
                  <Box className="review-meta">
                    <Typography className="review-author" variant="body2">
                      <Person sx={{ fontSize: '1rem', verticalAlign: 'middle', mr: 0.5 }} />
                      {review.author}
                    </Typography>
                    <Box className="review-date">
                      <DateRange fontSize="small" sx={{ mr: 0.5, fontSize: '1rem', color: 'text.secondary' }} />
                      <Typography variant="body2" color="text.secondary">
                        {formatDate(review.createdAt)}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>
          
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4, mb: 4 }}>
            <Pagination 
              count={totalPages} 
              page={page} 
              onChange={handlePageChange}
              color="primary"
              size="large"
              sx={{
                '& .MuiPaginationItem-root': {
                  fontSize: '1.1rem',
                  '&.Mui-selected': {
                    backgroundColor: '#028267',
                    color: 'white',
                    '&:hover': {
                      backgroundColor: '#026657',
                    },
                  },
                },
              }}
            />
          </Box>
        </>
      )}
    </Container>
  );
};

export default ReviewList;
