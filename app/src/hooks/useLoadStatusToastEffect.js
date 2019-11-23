import { useEffect } from 'react';
import { toast } from 'react-toastify';
import {
  LOAD_STATUS_HIGH,
  LOAD_STATUS_RECOVERING,
  LOAD_STATUS_RECOVERED,
} from '../constants';

export default (loadStatus) => {
  useEffect(() => {
    switch (loadStatus) {
      case LOAD_STATUS_HIGH:
        toast.error('CPU Load High!');
        break;
      case LOAD_STATUS_RECOVERING:
        toast.warn('CPU Load Recovering...');
        break;
      case LOAD_STATUS_RECOVERED:
        toast.success('CPU Load Recovered');
        break;
      default:
        break;
    }
  }, [loadStatus]);
};
