import 'bootstrap/dist/css/bootstrap.css';
import 'remixicon/fonts/remixicon.css';
import '../styles/globals.css';
import { Transition } from '@headlessui/react';
import { Toaster, ToastIcon, resolveValue } from 'react-hot-toast';
import { PlayerProvider } from '../components/player-context';
import buildClient from '../api/build-client';
import Header from '../components/header';
import Player from '../components/player';
import AdminSidebar from '../components/admin-sidebar';

const AppComponent = ({ Component, pageProps, currentUser }) => {
  const excludePlayer = Component.excludePlayer || false;
  const isAdmin = currentUser && currentUser.role === 'admin';

  return (
    <div className="flex flex-col h-screen">
      <Toaster position="top-center" reverseOrder={true}>
        {(t) => (
          <Transition
            as="div"
            appear
            show={t.visible}
            className="transform p-4 flex bg-white rounded shadow-lg"
            enter="transition-all duration-150"
            enterFrom="opacity-0 scale-50"
            enterTo="opacity-100 scale-100"
            leave="transition-all duration-150"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-75"
          >
            <ToastIcon toast={t} />
            <p className="px-2">{resolveValue(t.message)}</p>
          </Transition>
        )}
      </Toaster>
      <Header currentUser={currentUser} />
      <div className="flex flex-grow">
        {isAdmin && <AdminSidebar />}
        <div className="flex-1">
          <PlayerProvider>
            <Component currentUser={currentUser} {...pageProps} />
            <Player isVisible={!excludePlayer} currentUser={currentUser} />
          </PlayerProvider>
        </div>
      </div>
    </div>
  );
};

AppComponent.getInitialProps = async (appContext) => {
  const client = buildClient(appContext.ctx);
  const { data } = await client.get('/api/users/currentuser');

  let pageProps = {};
  if (appContext.Component.getInitialProps) {
    pageProps = await appContext.Component.getInitialProps(
      appContext.ctx,
      client,
      data.currentUser
    );
  }

  return {
    pageProps,
    ...data,
  };
};

export default AppComponent;
