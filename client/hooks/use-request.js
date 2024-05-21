import axios from 'axios';
import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

export default ({ url, method, body, onSuccess }) => {
  const [errors, setErrors] = useState(null);

  useEffect(() => {
    if (errors) {
      errors.forEach((error) => {
        toast.error(error);
      });
    }
  }, [errors]);

  const doRequest = async () => {
    try {
      setErrors(null);
      const response = await axios[method](url, body);

      if (onSuccess) {
        onSuccess(response.data);
      }

      return response.data;
    } catch (err) {
      const errorMessages = err.response.data.errors.map((err) => err.message);
      setErrors(errorMessages);
      return errorMessages;
    }
  };

  return { doRequest, errors };
};
