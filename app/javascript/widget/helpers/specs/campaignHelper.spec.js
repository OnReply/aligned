import {
  formatCampaigns,
  filterCampaigns,
  isPatternMatchingWithURL,
} from '../campaignHelper';
import campaigns from './campaignFixtures';

global.chatwootWebChannel = {
  workingHoursEnabled: false,
};
describe('#Campaigns Helper', () => {
  describe('#isPatternMatchingWithURL', () => {
    it('returns correct value if a valid URL is passed', () => {
      expect(
        isPatternMatchingWithURL(
          'https://chatwoot.com/pricing*',
          'https://chatwoot.com/pricing/'
        )
      ).toBe(true);

      expect(
        isPatternMatchingWithURL(
          'https://*.chatwoot.com/pricing/',
          'https://chatcore.aligned-tech.com/pricing/'
        )
      ).toBe(true);

      expect(
        isPatternMatchingWithURL(
          'https://{*.}?chatwoot.com/pricing?test=true',
          'https://chatcore.aligned-tech.com/pricing/?test=true'
        )
      ).toBe(true);

      expect(
        isPatternMatchingWithURL(
          'https://{*.}?chatwoot.com/pricing*\\?*',
          'https://chatwoot.com/pricing/?test=true'
        )
      ).toBe(true);
    });
  });

  describe('formatCampaigns', () => {
    it('should return formatted campaigns if campaigns are passed', () => {
      expect(formatCampaigns({ campaigns })).toStrictEqual([
        {
          id: 1,
          timeOnPage: 3,
          triggerOnlyDuringBusinessHours: false,
          url: 'https://chatcore.aligned-tech.com/pricing',
        },
        {
          id: 2,
          triggerOnlyDuringBusinessHours: false,
          timeOnPage: 6,
          url: 'https://chatcore.aligned-tech.com/about',
        },
      ]);
    });
  });
  describe('filterCampaigns', () => {
    it('should return filtered campaigns if formatted campaigns are passed', () => {
      expect(
        filterCampaigns({
          campaigns: [
            {
              id: 1,
              timeOnPage: 3,
              url: 'https://chatcore.aligned-tech.com/pricing',
              triggerOnlyDuringBusinessHours: false,
            },
            {
              id: 2,
              timeOnPage: 6,
              url: 'https://chatcore.aligned-tech.com/about',
              triggerOnlyDuringBusinessHours: false,
            },
          ],
          currentURL: 'https://chatcore.aligned-tech.com/about/',
        })
      ).toStrictEqual([
        {
          id: 2,
          timeOnPage: 6,
          url: 'https://chatcore.aligned-tech.com/about',
          triggerOnlyDuringBusinessHours: false,
        },
      ]);
    });
    it('should return filtered campaigns if formatted campaigns are passed and business hours enabled', () => {
      expect(
        filterCampaigns({
          campaigns: [
            {
              id: 1,
              timeOnPage: 3,
              url: 'https://chatcore.aligned-tech.com/pricing',
              triggerOnlyDuringBusinessHours: false,
            },
            {
              id: 2,
              timeOnPage: 6,
              url: 'https://chatcore.aligned-tech.com/about',
              triggerOnlyDuringBusinessHours: true,
            },
          ],
          currentURL: 'https://chatcore.aligned-tech.com/about/',
          isInBusinessHours: true,
        })
      ).toStrictEqual([
        {
          id: 2,
          timeOnPage: 6,
          url: 'https://chatcore.aligned-tech.com/about',
          triggerOnlyDuringBusinessHours: true,
        },
      ]);
    });
    it('should return empty campaigns if formatted campaigns are passed and business hours disabled', () => {
      expect(
        filterCampaigns({
          campaigns: [
            {
              id: 1,
              timeOnPage: 3,
              url: 'https://chatcore.aligned-tech.com/pricing',
              triggerOnlyDuringBusinessHours: true,
            },
            {
              id: 2,
              timeOnPage: 6,
              url: 'https://chatcore.aligned-tech.com/about',
              triggerOnlyDuringBusinessHours: true,
            },
          ],
          currentURL: 'https://chatcore.aligned-tech.com/about/',
          isInBusinessHours: false,
        })
      ).toStrictEqual([]);
    });
  });
});
