import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import axios from 'axios';

const NotificationModal = ({ messages, fetchMessages }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [unreadMessages, setUnreadMessages] = useState(false);

  useEffect(() => {
    const hasUnread = messages && messages.some((message) => !message.read);
    setUnreadMessages(hasUnread);
  }, [messages]);

  const openModal = async () => {
    setIsModalOpen(true);
    await fetchMessages();
    await axios.patch('/api/users/messages/read-all');
    setUnreadMessages(false);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setUnreadMessages(false);
  };

  return (
    <div>
      <button
        className={`p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors ${
          unreadMessages ? 'animate-pulse' : ''
        }`}
        onClick={openModal}
      >
        <i className="ri-notification-3-line text-orange-400 text-2xl"></i>
      </button>
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Повідомлення від адміністратора сервісу"
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white w-120 p-8 rounded-lg shadow-lg"
        overlayClassName="fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">
            Повідомлення від адміністратора сервісу
          </h2>
          <button onClick={closeModal} className="p-2">
            <i className="ri-close-line text-orange-400 text-2xl"></i>
          </button>
        </div>
        <div className="overflow-auto h-70">
          {messages ? (
            messages.map((message, index) => (
              <div
                key={index}
                className={`flex items-start mb-4 ${
                  message.read ? 'border-gray-300' : 'border-orange-400'
                } border-l-4 pl-2`}
              >
                <div className="mr-4">
                  <i className="ri-message-2-line text-orange-400 text-2xl"></i>
                </div>
                <div>
                  <p className={`text-gray-800 font-medium`}>
                    {message.message}
                  </p>
                  <p className="text-gray-600">
                    {new Date(message.createdAt).toLocaleString('uk-UA')}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-800">Немає повідомлень</p>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default NotificationModal;
