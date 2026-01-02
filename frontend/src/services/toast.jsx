import { toast } from 'react-toastify';

export const toastSuccess = (msg) =>
  toast.success(msg || 'Success');

export const toastError = (msg) =>
  toast.error(msg || 'Something went wrong');

export const toastInfo = (msg) =>
  toast.info(msg);

export const toastWarning = (msg) =>
  toast.warn(msg);
