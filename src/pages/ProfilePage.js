import React, { useEffect, useState } from 'react'
import Topbar from "../components/Topbar";
import colorConfigs from '../configs/colorConfigs';
import { AccountBox } from '@mui/icons-material';
import { Avatar, Box, ImageList, ImageListItem, Typography } from '@mui/material';
import InfiniteScroll from 'react-infinite-scroll-component';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';

const ProfilePage = () => {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [fetching, setFetching] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const loadFunc = async () => {
    if (fetching || !hasMore) {
      return;
    }
    setFetching(true);

    try {
      const imageUrl = await axios.get(`http://localhost:8080/api/v1/image/images-names-page/profile/${page}`, {
        headers: {
          Authorization: 'Bearer ' + Cookies.get('art_space_signing_jwt_token')
        }
      })
        .then(value => value.data.map(imageName => `http://localhost:8080/api/v1/image/storage/${imageName}`))

      setItems([...items, ...imageUrl])

      if (imageUrl.length < 20) setHasMore(false);

    } finally {
      setPage(page+1)
      setFetching(false);
    }
  }

  useEffect(() => {
    loadFunc();
  }, [])

  return (
    <div style={{ 
      backgroundColor: colorConfigs.green.lighter,
      minHeight: '100vh'
    }}>
      <Topbar />
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: '#2e7d32' }}>
          <AccountBox />
        </Avatar>
        <Typography component="h1" variant="h5">
          Your work
        </Typography>
      </Box>
      <InfiniteScroll
        dataLength={items.length}
        next={loadFunc}
        hasMore={hasMore}
      >
        <ImageList variant="masonry" 
          cols={4} 
          gap={16} 
          sx={{ margin: 3 }}
        >
          {items.map(item => (
            <ImageListItem key={item} component={Link} to={`/image/${encodeURIComponent(item)}`}>
              <img
                srcSet={`${item}?w=248&fit=crop&auto=format&dpr=2 2x`}
                src={`${item}?w=248&fit=crop&auto=format`}
                loading="lazy"
                style={{ borderRadius: 20}}
              />
            </ImageListItem>
          ))}
        </ImageList>
      </InfiniteScroll>
    </div>
  )
}

export default ProfilePage