import { useState, useEffect } from 'react';
import Router from 'next/router';
import useRequest from '../../hooks/use-request';

export default () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { doRequest, errors } = useRequest({
    url: '/api/users/signin',
    method: 'post',
    body: {
      email,
      password,
    },
    onSuccess: () => Router.push('/'),
  });

  const onSubmit = async (event) => {
    event.preventDefault();

    await doRequest();
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <form onSubmit={onSubmit}>
          <h1 className="mb-4">Авторизація</h1>
          <div className="form-group">
            <label>Електронна пошта</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-control"
            />
          </div>
          <div className="form-group">
            <label>Пароль</label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              className="form-control"
            />
          </div>
          {errors && <div className="alert alert-danger">{errors}</div>}
          <button type="submit" className="btn btn-primary">
            Авторизуватись
          </button>
        </form>
      </div>
    </div>
  );
};
