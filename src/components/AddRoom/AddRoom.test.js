import React from 'react';
import { shallow } from 'enzyme';
import AddRoom from './AddRoom';

describe('<AddRoom />', () => {
  let component;

  beforeEach(() => {
    component = shallow(<AddRoom />);
  });

  test('It should mount', () => {
    expect(component.length).toBe(1);
  });
});
