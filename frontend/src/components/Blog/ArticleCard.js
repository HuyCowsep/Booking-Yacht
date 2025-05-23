// components/ArticleCard.jsx
import React from 'react';
import { Card, CardMedia, CardContent, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

export default function ArticleCard({ article }) {
  return (
    <Link to={`/blog/${article.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
      <Card
        sx={{
          borderRadius: '16px',
          border: '1px solid #E5E7EB',
          maxWidth: '350px',
          mx: 'auto',
          cursor: 'pointer',
          transition: 'transform 0.2s',
          '&:hover': { transform: 'scale(1.02)' },
        }}
      >
        <CardMedia
          component="img"
          height="180"
          image={article.img}
          alt={article.title}
          sx={{ borderTopLeftRadius: '18px', borderTopRightRadius: '16px' }}
        />
        <CardContent>
          <Typography variant="subtitle1" fontWeight={600} fontSize={14}>
            {article.title}
          </Typography>
          <Typography
            variant="body2"
            fontSize={11}
            color="text.secondary"
            mt={1}
            sx={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
            }}
          >
            {article.desc}
          </Typography>
          <Typography variant="caption" color="text.disabled" display="block" mt={1}>
            {article.date}
          </Typography>
        </CardContent>
      </Card>
    </Link>
  );
}
//ArticleCard