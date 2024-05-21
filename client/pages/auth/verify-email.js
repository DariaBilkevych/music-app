import Router from 'next/router';

const VerifyEmail = () => {
  return (
    <div className="flex items-center justify-center py-8">
      <div className="bg-white p-8 rounded shadow-md text-center">
        <h1 className="text-2xl font-bold mb-4">
          Підтвердіть вашу електронну пошту
        </h1>
        <p className="mb-4">
          Ми відправили вам листа з інструкціями для підтвердження вашої
          електронної пошти.
        </p>
        <p>Будь ласка, перевірте вашу поштову скриньку.</p>
        <button
          onClick={() => Router.push('/auth/signin')}
          className="mt-4 bg-orange-400 hover:bg-orange-500 text-white font-bold py-2 px-4 rounded"
        >
          Перейти до сторінки входу
        </button>
      </div>
    </div>
  );
};

export default VerifyEmail;
