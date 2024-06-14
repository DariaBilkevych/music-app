import { useEffect } from 'react';
import Router from 'next/router';
import useRequest from '../../hooks/use-request';
import Loader from '../../components/loader';

export default () => {
  const { doRequest } = useRequest({
    url: '/api/users/signout',
    method: 'post',
    body: {},
    onSuccess: () => Router.push('/'),
  });

  useEffect(() => {
    doRequest();
  }, []);

  return <Loader />;
};
