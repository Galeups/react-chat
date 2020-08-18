import React from 'react';
import { shallow } from 'enzyme';
import RoomList from './RoomList';

describe('<RoomList />', () => {
  let component;

  beforeEach(() => {
    component = shallow(<RoomList />);
  });

  test('It should mount', () => {
    expect(component.length).toBe(1);
  });
});
