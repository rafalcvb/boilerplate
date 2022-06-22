import React, { Fragment } from 'react';

import { useLocale } from 'hooks/useLocale/useLocale';
import { AppLocale } from 'context/locale/AppLocale.enum';
import { AppMessages } from 'i18n/messages';
import { LocationInfo } from 'ui/locationInfo/LocationInfo';
import { useAuth } from 'hooks/useAuth/useAuth';
import { GetMeQueryResponse } from 'api/actions/auth/authActions.types';
import { getInfiniteUsersQuery } from 'api/actions/auth/authActions';
import { User } from 'api/mocks/mock-server';
import { useInfiniteQuery } from 'hooks/useInfiniteQuery/useInfiniteQuery';
import { useQuery } from 'hooks/useQuery/useQuery';

export const Home = () => {
  const { formatMessage, locale, setLocale } = useLocale();
  const { login, isAuthenticated, isAuthenticating } = useAuth();

  const {
    data: meResponse,
    isLoading: isGettingMe,
    isFetched: isMeFetched,
  } = useQuery<GetMeQueryResponse>('me', { enabled: isAuthenticated });

  const {
    data: usersResponse,
    isFetching: isFetchingUsers,
    isFetched: areUsersFetched,
    hasNextPage: hasMoreUsers,
    fetchNextPage: loadMoreUsers,
    isFetchingNextPage,
  } = useInfiniteQuery<{ count: number }, { users: User[]; nextPage: number | null }>('users', getInfiniteUsersQuery, {
    cursorKey: 'page',
    args: {
      count: 5,
    },
    getNextPageParam: (lastPage) => {
      if (lastPage.nextPage === null) {
        return false;
      }
      return lastPage.nextPage;
    },
  });

  return (
    <>
      <h2>Home</h2>
      <p>
        {formatMessage({ id: AppMessages['home.helloWorld'] })}
        <span style={{ margin: '0 1rem' }}>&#x2190;</span>
        This text is translated using{' '}
        <a href="https://github.com/formatjs/react-intl/blob/master/docs/API.md#formatmessage">
          <code>formatMessage</code>
        </a>{' '}
        function from <a href="https://github.com/formatjs/react-intl">react-intl</a>. Click{' '}
        <button
          style={{ fontSize: 'inherit' }}
          onClick={() => setLocale(locale === AppLocale.pl ? AppLocale.en : AppLocale.pl)}
        >
          here
        </button>{' '}
        to change language.
      </p>
      <hr />
      <LocationInfo />
      <hr />
      <div style={{ marginBottom: '2rem' }}>
        <p>User information &#129489;</p>
        <div style={{ marginBottom: '2rem' }}>
          <button
            disabled={isAuthenticating || isAuthenticated}
            onClick={() => login({ password: 'tsh-react-starter', username: 'tsh' })}
          >
            {isAuthenticating ? 'Logging in...' : 'Click to login'}
          </button>
        </div>
        {isGettingMe && <p>Loading data about you...</p>}
        {isMeFetched && (
          <code style={{ background: '#BADA55', padding: '1rem' }}>{JSON.stringify(meResponse, null, 2)}</code>
        )}
      </div>
      <div>
        <p>List of users &#129489;</p>
        <div style={{ marginBottom: '2rem' }}>
          <ul>
            {areUsersFetched &&
              usersResponse?.pages &&
              usersResponse?.pages.map((page, index) => (
                <Fragment key={index}>
                  {page.users.map((user) => (
                    <li key={user.id}>{user.name}</li>
                  ))}
                </Fragment>
              ))}
          </ul>
          {isFetchingNextPage && <p>Loading more users...</p>}
          <button disabled={isFetchingNextPage || isFetchingUsers || !hasMoreUsers} onClick={() => loadMoreUsers()}>
            Load more
          </button>
        </div>
      </div>
    </>
  );
};
