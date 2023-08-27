import { buildPortalArticleURL, buildPortalURL } from '../portalHelper';

describe('PortalHelper', () => {
  describe('buildPortalURL', () => {
    it('returns the correct url', () => {
      window.chatwootConfig = {
        hostURL: 'https://chatcore.aligned-tech.com',
        helpCenterURL: 'https://help.aligned-tech.com',
      };
      expect(buildPortalURL('handbook')).toEqual(
        'https://help.aligned-tech.com/hc/handbook'
      );
      window.chatwootConfig = {};
    });
  });

  describe('buildPortalArticleURL', () => {
    it('returns the correct url', () => {
      window.chatwootConfig = {
        hostURL: 'https://chatcore.aligned-tech.com',
        helpCenterURL: 'https://help.aligned-tech.com',
      };
      expect(
        buildPortalArticleURL('handbook', 'culture', 'fr', 'article-slug')
      ).toEqual('https://help.aligned-tech.com/hc/handbook/articles/article-slug');
      window.chatwootConfig = {};
    });
  });
});
