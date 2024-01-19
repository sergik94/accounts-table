/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';

import './App.scss';
import { AccountsList } from './components/AccountsList';
import { CampaignList } from './components/CampaignList/CampaignList';
import { Navigation } from './components/Navigation/Navigation';
import { NoResults } from './components/NoResults';
import { ProfilesList } from './components/ProfilesList';
import { getAccounts, getCampaigns, getProfiles } from './features/getData';
import { Account } from './types/Accounts';
import { Campaign } from './types/Campaign';
import { Profile } from './types/Profile';

export const App: React.FC = () => {
  const [accounts, setAccounts] = useState<Account[] | []>([]);
  const [profiles, setProfiles] = useState<Profile[] | []>([]);
  const [campaigns, setCampaigns] = useState<Campaign[] | []>([]);
  const [isError, setError] = useState(false);
  const location = useLocation();
  const [currAccount, setCurrAccount] = useState<number | null>(null);
  const [currProfile, setCurrProfile] = useState<number | null>(null);

  const getAccountsFromServer = async () => {
    setError(false);
    const accountsFromServer = await getAccounts();

    setAccounts(accountsFromServer);
  };

  const getProfilesFromServer = async (id: number) => {
    const isId = accounts.some((acc) => acc.accountId === id);

    if (!isId) {
      setError(true);

      return;
    }

    setError(false);
    setProfiles([]);
    const profilesFromServer = await getProfiles(id);

    setProfiles(profilesFromServer);
    setCurrAccount(id);
  };

  const getCampaignsFromServer = async (id: number) => {
    setCurrProfile(id);
    const accId = +location.pathname.split('/').filter((p) => p !== '')[1];
    let isProfId = profiles.some((prof) => prof.profileId === id);

    if (profiles.length === 0 || currAccount !== accId) {
      const profilesFromServer = await getProfiles(accId);

      setProfiles(profilesFromServer);
      setCurrAccount(accId);
      isProfId = profilesFromServer.some((prof) => prof.profileId === id);
    }

    const isAccId = accounts.some((acc) => acc.accountId === accId);

    if (!isProfId || !isAccId) {
      setError(true);

      return;
    }

    setError(false);
    setCampaigns([]);

    const campaignsFromServer = await getCampaigns(id);

    setCampaigns(campaignsFromServer);
  };

  useEffect(() => {
    getAccountsFromServer();
  }, []);

  useEffect(() => {
    if (accounts.length === 0) {
      return;
    }

    const pathArray = location.pathname.split('/').filter((p) => p !== '');

    switch (pathArray.length) {
      case 2:
        getProfilesFromServer(+pathArray[pathArray.length - 1]);
        break;

      case 4:
        getCampaignsFromServer(+pathArray[pathArray.length - 1]);
        break;

      default:
        getAccountsFromServer();
    }
  }, [location.pathname, accounts]);

  if (isError) {
    return (
      <div className="app__container _container">
        <NoResults />
      </div>
    );
  }

  return (
    <>
      <div className="app">
        <div className="app__container _container">
          {location.pathname !== '/' && (
            <Navigation
              currAccount={currAccount}
              currProfile={currProfile}
              setCurrAccount={setCurrAccount}
              setCurrProfile={setCurrProfile}
            />
          )}

          <Routes>
            <Route
              path="/"
              element={
                <AccountsList
                  items={accounts}
                  getProfilesFromServer={getProfilesFromServer}
                />
              }
            />

            <Route path="/account">
              <Route
                index
                element={
                  <ProfilesList
                    items={profiles}
                    getCampaignsFromServer={getCampaignsFromServer}
                  />
                }
              />
              <Route
                path=":accountId"
                element={
                  <ProfilesList
                    items={profiles}
                    getCampaignsFromServer={getCampaignsFromServer}
                  />
                }
              />
            </Route>

            <Route path="/account/:accountId/profile">
              <Route index element={<CampaignList items={campaigns} />} />
              <Route
                path=":profileId"
                element={<CampaignList items={campaigns} />}
              />
            </Route>

            <Route
              path="*"
              element={<h1 className="app__title">Page not found</h1>}
            />
          </Routes>
        </div>
      </div>
    </>
  );
};
