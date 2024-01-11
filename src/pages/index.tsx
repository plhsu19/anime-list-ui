import Head from 'next/head';
import type { InferGetServerSidePropsType, GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useGetAnimeContextValue } from '@/contexts/anime-context';
import Card from '@/components/home/card';
import Layout, { Page } from '@/components/layout';
import animeApiService from '@/services/anime-api-service';
import { IconButton, Alert, Snackbar } from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { Anime } from '@/types/anime-types';
import styles from '@/styles/Home.module.css';
import utilStyles from '@/styles/utils.module.css';
import { newAnimePath } from '@/constants/paths';
import {PROCESSING_REQUEST_MESSAGE} from '@/constants/texts';


export const getServerSideProps: GetServerSideProps<{
  animes: Anime[];
}> = async () => {
  const res = await animeApiService.getAnimes();
  return {
    props: {
      animes: res.data.animes
    }
  };
};

export default function Home(
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) {
  //TODO: sync the animes state when the props.animes changes
  const router = useRouter();
  const { state, dispatch, deleteAnime } = useGetAnimeContextValue();
  const alertIsExist = !!state.message || !!state.error;
  const [preAlertIsExist, setPreAlertIsExist] = useState(alertIsExist);
  const [alertOpen, setAlertOpen] = useState(alertIsExist);

  if (alertIsExist !== preAlertIsExist) {
    setAlertOpen(alertIsExist);
    setPreAlertIsExist(alertIsExist);
  }

  const handleDirectToNewAnimePage = () => {
    dispatch({ type: 'RESET_NOTIFICATIONS' });
    router.push(newAnimePath);
  };

  const handleAlertClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === 'clickaway') {
      return;
    }
    setAlertOpen(false);
  };

  return (
    <Layout page={Page.HOME}>
      <Head>
        <title>Anime Spotlight</title>
      </Head>
      <main>
        <div
          className={[
            utilStyles.verticalAlignItems,
            utilStyles.horizontalAlignment
          ].join(' ')}
        >
          <h1>Anime Spotlight 🔦</h1>
          <p>
            Discover top anime series. Tap cards for detailed insights. Use the
            three dots to edit or remove the animes, and the top-right '+' to
            add new favorites to the list. Enhance your anime journey!
          </p>
          <IconButton
            aria-label="addAnime"
            size="small"
            color="primary"
            disabled={state.loading}
            className={styles.btnAdd}
            onClick={handleDirectToNewAnimePage}
          >
            <AddCircleIcon fontSize="large" />
          </IconButton>
          <Snackbar
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            open={state.loading}
          >
            <Alert severity="warning" variant="filled">
              {PROCESSING_REQUEST_MESSAGE}
            </Alert>
          </Snackbar>
          <Snackbar
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            open={alertOpen}
            autoHideDuration={6000}
            onClose={handleAlertClose}
          >
            <Alert
              severity={!!state.error ? 'error' : 'success'}
              variant="filled"
              onClose={handleAlertClose}
            >
              {state.error ?? state.message}
            </Alert>
          </Snackbar>
          <div className={styles.cardList}>
            {state.animes?.map((anime) => (
              <Card
                key={anime.id}
                id={anime.id}
                title={anime.title}
                enTitle={anime.enTitle}
                subtype={anime.subtype}
                rating={anime.rating}
                episodeCount={anime.episodeCount}
                startDate={anime.startDate}
                posterImage={anime.posterImage}
                deleteAnime={deleteAnime}
              />
            ))}
          </div>
        </div>
      </main>
    </Layout>
  );
}
