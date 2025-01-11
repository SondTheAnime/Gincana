import Hero from '../components/home/Hero';
import LiveGames from '../components/home/LiveGames';
import UpcomingMatches from '../components/home/UpcomingMatches';

const Home = () => {
  return (
    <>
      <Hero />
      <div className="container mx-auto px-4 py-8">
        <LiveGames />
        <UpcomingMatches />
      </div>
    </>
  );
};

export default Home;