import React from 'react';
import { mount } from 'enzyme';
import { toast } from 'react-toastify';
import { LOAD_STATUS_NORMAL, LOAD_STATUS_RECOVERED, LOAD_STATUS_HIGH, LOAD_STATUS_RECOVERING } from '../constants';
import useLoadStatusToastEffect from './useLoadStatusToastEffect';

describe('useLoadStatusToastEffect', () => {
  const TestComponent = ({ loadStatus = LOAD_STATUS_NORMAL }) => {
    // Handles toast alerts based on loadStatus
    useLoadStatusToastEffect(loadStatus);

    return loadStatus;
  }

  it('no alerts when cpu load normal', () => {
    toast.error = jest.fn();
    toast.warn = jest.fn();
    toast.success = jest.fn();

    const wrapper = mount(<TestComponent loadStatus={LOAD_STATUS_NORMAL} />);

    expect(toast.error).not.toBeCalled();
    expect(toast.warn).not.toBeCalled();
    expect(toast.success).not.toBeCalled();
  });
  
  it('alerts toast when cpu load high', () => {
    toast.error = jest.fn();

    const wrapper = mount(<TestComponent loadStatus={LOAD_STATUS_HIGH} />);

    expect(toast.error).toBeCalledWith('CPU Load High!');
  });

  it('alerts toast when cpu load recovering', () => {
    toast.warn = jest.fn();

    const wrapper = mount(<TestComponent loadStatus={LOAD_STATUS_RECOVERING} />);

    expect(toast.warn).toBeCalledWith('CPU Load Recovering...');
  });

  it('alerts toast when cpu load recovered', () => {
    toast.success = jest.fn();

    const wrapper = mount(<TestComponent loadStatus={LOAD_STATUS_RECOVERED} />);

    expect(toast.success).toBeCalledWith('CPU Load Recovered');
  });
});
