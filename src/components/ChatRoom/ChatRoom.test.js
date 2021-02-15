import React from 'react';
import { shallow } from 'enzyme';
import ChatRoom from './ChatRoom';

describe('<ChatRoom />', () => {
    let component;

    beforeEach(() => {
        component = shallow(<ChatRoom />);
    });

    test('It should mount', () => {
        expect(component.length).toBe(1);
    });
});
