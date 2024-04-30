import buildClient from '../api/build-client';

const LandingPage = ({ currentUser }) => {
  return currentUser ? (
    <h1>Вітаємо! Ви успішно авторизувались.</h1>
  ) : (
    <h1>Ви незареєстровані.</h1>
  );
};

LandingPage.getInitialProps = async (context, client, currentUser) => {
  return {};
};

export default LandingPage;
