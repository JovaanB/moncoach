import { createContext, useContext, useEffect, useState } from "react";
import { useSegments, useRouter } from "expo-router";
import * as AppleAuthentication from "expo-apple-authentication";
import * as SecureStore from "expo-secure-store";
import { jwtDecode } from "jwt-decode";

type User = {
  email: string;
};

type AuthType = {
  user: User | null;
  setUser: (user: User | null) => void;
  login: () => void;
  logout: () => void;
};

const AuthContext = createContext<AuthType>({
  user: null,
  setUser: () => {},
  login: () => {},
  logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

function useProtectedRoute(user: any) {
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    const inAuthGroup = segments[0] === "(auth)";

    if (!user && inAuthGroup) {
      router.replace("/signup");
    } else if (user && !inAuthGroup) {
      router.replace("/(auth)/(tabs)/");
    }
  }, [user, segments]);
}

export function AuthProvider({
  children,
}: {
  children: JSX.Element;
}): JSX.Element {
  const [user, setUser] = useState<User | null>(null);

  const login = async () => {
    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });
      SecureStore.setItemAsync("apple-credentials", JSON.stringify(credential));
      const decoded = jwtDecode<{
        email: string;
        exp: number;
      }>(credential.identityToken!);

      setUser({
        email: decoded.email,
      });
    } catch (e) {
      console.log(e);
    }
  };

  const logout = async () => {
    await SecureStore.deleteItemAsync("apple-credentials");
    setUser(null);
  };

  useProtectedRoute(user);

  const authContext: AuthType = {
    user,
    setUser,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={authContext}>{children}</AuthContext.Provider>
  );
}
