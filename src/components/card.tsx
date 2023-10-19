import React, { useMemo } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import Link from 'next/link';
import cardStyles from '@/styles/Card.module.css';
import {
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { animesPath } from '@/constants/paths';

//TODO:
// 1. understand props of IconButton
// 2. understand props of Menu

export default function AnimeCard({
  id,
  title,
  subtype,
  startDate,
  rating,
  posterImage,
  deleteAnime
}: {
  id: number;
  title: string;
  subtype: string;
  startDate: string;
  rating: number;
  posterImage: string;
  deleteAnime: (id: number) => Promise<void>;
}) {
  const router = useRouter();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const startYear = useMemo(
    () => startDate.split('-')[0] ?? 'unkown',
    [startDate]
  );

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleDelete = () => {
    deleteAnime(id);
    setAnchorEl(null);
  };
  const handleDirectToAnimePage = (edit: boolean) => {
    router.push(`${animesPath}/${id}?${edit ? 'edit=true' : ''}`);
  };

  return (
    <>
      <div className={cardStyles.card}>
        <Link href={`/animes/${id}`}>
          <Image
            priority
            src={posterImage}
            className={cardStyles.borderCircle}
            height={176}
            width={124}
            alt=""
          />
        </Link>
        <div className={cardStyles.cardInfo}
          onClick={() => {
            handleDirectToAnimePage(false);
          }}
        >
          <h3>{title}</h3>
          <p>{startYear}</p>
          <p>{subtype}</p>
        </div>
        <div>
          <IconButton
            id="basic-button"
            aria-controls={open ? 'basic-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
            onClick={handleClick}
          >
            <MoreVertIcon />
          </IconButton>
          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              'aria-labelledby': 'basic-button'
            }}
          >
            <MenuItem onClick={() => {
              handleDirectToAnimePage(true)
            }}>
              <ListItemIcon>
                <EditIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Edit</ListItemText>
            </MenuItem>
            <MenuItem onClick={handleDelete}>
              <ListItemIcon>
                <DeleteForeverIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Delete</ListItemText>
            </MenuItem>
          </Menu>
          <p>{rating}</p>
        </div>
      </div>
    </>
  );
}
