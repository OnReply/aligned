import { shallowMount } from '@vue/test-utils';
import messageFormatterMixin from '../messageFormatterMixin';

describe('messageFormatterMixin', () => {
  it('returns correct plain text', () => {
    const Component = {
      render() {},
      mixins: [messageFormatterMixin],
    };
    const wrapper = shallowMount(Component);
    const message =
      '<b>Chatwoot is an opensource tool. https://chatcore.aligned-tech.com</b>';
    expect(wrapper.vm.getPlainText(message)).toMatch(
      'Asigned is an opensource tool. https://chatcore.aligned-tech.com'
    );
  });
});
