import { useMemo } from 'react';
import dayjs from 'dayjs';
import Image from 'next/image';
import utilStyles from '@/styles/utils.module.css';
import {
  Chip,
  Rating,
  Button
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { Anime, Status } from '@/types/anime-types';
import animeView from '@/styles/components/animes/AnimeView.module.css';
import {
  animeTypeFormatter,
  animeStatusFormatter,
  animeRatingFormatter
} from '@/utils/anime-utils';

const EDIT_BUTTON_LABEL = 'Edit';
const DELETE_BUTTON_LABEL = 'Delete';

export default function AnimeView({
  anime,
  isLoading,
  handleEditButtonClick,
  handleDeleteButtonClick
}: {
  anime: Anime;
  isLoading: boolean;
  handleEditButtonClick: () => void;
  handleDeleteButtonClick: () => Promise<void>;
}) {
  const startDate = useMemo(() => {
    return dayjs(anime.startDate).format('MMM, YYYY');
  }, [anime.startDate]);

  const endDate = useMemo(() => {
    if (anime.endDate === null) {
      return anime.status === Status.CURRENT ? 'Present' : '?';
    } else {
      return dayjs(anime.endDate).format('MMM, YYYY');
    }
  }, [anime.endDate, anime.status]);

  const displayRating = useMemo(() => {
    if (anime.rating === null) {
      return anime.rating;
    } else {
      return anime.rating / 2;
    }
  }, [anime.rating]);

  return (
    <div className={animeView.animeView}>
      <Image
        src={anime.posterImage}
        alt={anime.title}
        width={55 * 4.5}
        height={78 * 4.5}
      />
      <div className={animeView.animeInfos}>
        <div className={animeView.ratingContainer}>
          <Rating
            name="rating"
            value={displayRating}
            readOnly
            size="large"
            max={5}
            precision={0.1}
          />
          <div>
            <span>Rating: </span>
            <span className={animeView.rating}>
              {animeRatingFormatter(anime.rating)}
            </span>
            <span className={utilStyles.secondaryColor}> of 10</span>
          </div>
        </div>
        <div className={animeView.btnContainer}>
          <Button
            className={animeView.editBtn}
            disabled={isLoading}
            onClick={handleEditButtonClick}
            color="warning"
            variant="contained"
            startIcon={<EditIcon />}
          >
            {EDIT_BUTTON_LABEL}
          </Button>
          <Button
            className={animeView.deleteBtn}
            disabled={isLoading}
            onClick={handleDeleteButtonClick}
            color="error"
            variant="outlined"
            startIcon={<DeleteForeverIcon />}
          >
            {DELETE_BUTTON_LABEL}
          </Button>
        </div>
        <div className={animeView.detailContainer}>
          <span>{animeTypeFormatter(anime.subtype)}</span>
          <span> | </span>
          <span>{`${startDate} - ${endDate}`}</span>
          <span> | </span>
          <span>{animeStatusFormatter(anime.status)}</span>
          {!!anime.episodeCount && (
            <div>
              <span> | </span>
              <span>{`${anime.episodeCount} Episodes`}</span>
            </div>
          )}
        </div>
        {anime.categories.length > 0 && (
          <div className={animeView.categories}>
            {anime.categories.map((category, idx) => (
              <Chip
                key={idx}
                label={category}
                color="warning"
                variant="outlined"
              />
            ))}
          </div>
        )}
        <span className={animeView.description}>{anime.description}</span>
      </div>
    </div>
  );
}