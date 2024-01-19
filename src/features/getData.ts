import accounts from '../data/accounts.json';
import profiles from '../data/profiles.json';
import campaigns from '../data/campaigns.json';

import { client } from './api';

export const getAccounts = async () => {
  return await client.get(accounts);
};

export const getProfiles = async (id: number) => {
  const currentProfiles = profiles.filter(
    (profile) => profile.belongToAccount === id,
  );

  return await client.get(currentProfiles);
};

export const getCampaigns = async (id: number) => {
  const currentCampaigns = campaigns.filter(
    (campaign) => campaign.belongToProfile === id,
  );

  return await client.get(currentCampaigns);
};
