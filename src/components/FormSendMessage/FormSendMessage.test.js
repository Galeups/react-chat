import React from 'react';
import { shallow } from 'enzyme';
import FormSendMessage from './FormSendMessage';

describe('<Login />', () => {
    let component;

    beforeEach(() => {
        component = shallow(<FormSendMessage />);
    });

    it('It should mount', () => {
        expect(component.length).toBe(1);
    });
});
