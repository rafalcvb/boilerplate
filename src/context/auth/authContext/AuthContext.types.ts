import { LoginMutationArguments } from 'api/actions/auth/authActions.types';

export type AuthContextValueType = {
  isAuthenticated: boolean;
  isAuthenticating: boolean;
  login: ({ password, username }: LoginMutationArguments) => void;
};
