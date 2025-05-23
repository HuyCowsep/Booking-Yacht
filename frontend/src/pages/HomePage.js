import React from 'react';
import { Box } from '@mui/material';
import Banner from '../components/HomePages/Banner';
import CruiseList from '../components/HomePages/CruiseList';
import Destination from '../components/HomePages/Destination';
import Review from '../components/HomePages/Review';
import Partners from '../components/HomePages/Partners';
import NewsList from '../components/HomePages/NewsList';

export default function HomePage() {
  const sections = [
    { component: <Banner />, key: 'banner' },
    { component: <CruiseList />, key: 'cruise-list' },
    { component: <Destination />, key: 'destination' },
    { component: <Review />, key: 'review' },
    { component: <Partners />, key: 'partners' },
    { component: <NewsList />, key: 'news-list' },
    {}
  ];

  return (
    <>
      {sections.map((section, index) => (
        <Box
          key={section.key}
          sx={{
            width: '100%',
            backgroundColor: (theme) =>
              index % 2 === 0
                ? theme.palette.mode === 'light'
                  ? '#ffffff'
                  : '#1b242a'
                : theme.palette.mode === 'light'
                ? '#f0f4f3'
                : '#2a3d46',
          }}
        >
          {section.component}
        </Box>
      ))}
    </>
  );
}