import React, { useState } from 'react';
import Modal from 'react-modal';

const AdminReasonModal = ({ isOpen, onClose, onDelete }) => {
  const [reason, setReason] = useState('');

  const handleDelete = () => {
    onDelete(reason);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white w-1/2 p-4 rounded-lg shadow-lg"
      overlayClassName="fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50"
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Вкажіть причину видалення</h2>
        <button onClick={onClose} className="p-2">
          <i className="ri-close-line text-orange-400 text-2xl"></i>
        </button>
      </div>
      <textarea
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        placeholder="Причина видалення"
        className="w-full h-32 mb-2 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400"
      />
      <button
        onClick={handleDelete}
        className="block mx-auto bg-gradient-to-r from-orange-400 to-orange-500 text-white px-6 py-2 rounded-md hover:bg-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-400"
      >
        Видалити
      </button>
    </Modal>
  );
};

export default AdminReasonModal;
