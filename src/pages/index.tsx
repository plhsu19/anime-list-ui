import Head from 'next/head';
import { useRouter } from 'next/router';
import styles from '@/styles/Home.module.css';
import utilStyles from '@/styles/utils.module.css';
import animeApiService from '@/services/anime-api-service';
import type { InferGetServerSidePropsType, GetServerSideProps } from 'next';
import AnimeContext, {
  useGetAnimeContextValue
} from '@/contexts/anime-context';
import { Anime } from '@/types/anime-types';
import Card from '@/components/card';
import { IconButton } from '@mui/material';
import Alert from '@mui/material/Alert';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import Layout from '@/components/layout';
import { newAnimePath } from '@/constants/paths';

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
  const { state, deleteAnime } = useGetAnimeContextValue();
  const router = useRouter();

  const handleDirectToCreateAnimePage = () => {
    router.push(newAnimePath);
  };

  return (
    <Layout page="home">
      <Head>
        <title>Anime Spotlight</title>
      </Head>
      <div className={[
            styles.mainContainer,
            utilStyles.horizontalContainer
          ].join(' ')}>
        <h1>Anime Spotlight 🔦</h1>
        <p>
          Discover top anime series. Tap cards for detailed insights. Use the
          three dots to edit or remove the animes, and the top-right '+' to add
          new favorites to the list. Enhance your anime journey!
        </p>
        <IconButton
          aria-label="addAnime"
          size="small"
          color="primary"
          className={styles.btnAdd}
          onClick={handleDirectToCreateAnimePage}
        >
          <AddCircleIcon fontSize="large" />
        </IconButton>
        {state.message && <Alert severity="success">{state.message}</Alert>}
        <div className={styles.cardList}>
          {state.animes.map((anime) => (
            <Card
              key={anime.id}
              id={anime.id}
              title={anime.title}
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
    </Layout>
  );
}
