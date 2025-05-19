import React, {
  createContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import axios from "axios";
import api from "../utils/axios";
import { CartItem } from "../types/CartItem";
import { Ticket } from "../types/Ticket";

interface Spectacle {
  id: number;
  name: string;
  brand: string;
  price: number;
  category: string;
  productAvailable: boolean;
  imageUrl?: string;
}

interface User {
  username: string;
  role: "ADMIN" | "User" | null;
}

interface ContextProps {
  isLoggedIn: boolean;
  user: User | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  theme: string;
  toggleTheme: () => void;
  language: "en" | "ro";
  toggleLanguage: () => void;
  searchResults: Spectacle[];
  setSearchResults: React.Dispatch<React.SetStateAction<Spectacle[]>>;
  data: Spectacle[];
  isError: boolean;
  refreshData: () => void;
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: number) => void;
  updateCartItemCount: (id: number, newCount: number) => void;
  clearCart: () => void;
  saveTicketHistory: (tickets: CartItem[]) => void;
  ticketHistory: Ticket[];

}

const AppContext = createContext<ContextProps | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const storedToken = localStorage.getItem("token");
  const storedRole = localStorage.getItem("role");
  const storedUsername = localStorage.getItem("username");
  const [ticketHistory, setTicketHistory] = useState<Ticket[]>([]);

  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(!!storedToken);
  const [user, setUser] = useState<User | null>(
    storedRole && storedUsername
      ? { username: storedUsername, role: storedRole as User["role"] }
      : null
  );

  const [theme, setTheme] = useState<string>(
    localStorage.getItem("theme") || "light-theme"
  );
  const [language, setLanguage] = useState<"en" | "ro">(
    (localStorage.getItem("language") as "en" | "ro") || "en"
  );

  const [searchResults, setSearchResults] = useState<Spectacle[]>([]);
  const [data, setData] = useState<Spectacle[]>([]);
  const [isError, setIsError] = useState(false);

  const [cart, setCart] = useState<CartItem[]>(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });


  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const refreshData = async () => {
    try {
      const response = await axios.get<Spectacle[]>(
        "http://localhost:8080/api/spectacles/spectacles"
      );
      setData(response.data);
      setIsError(false);
    } catch (error) {
      console.error("Error fetching spectacles:", error);
      setIsError(true);
    }
  };

  const addToCart = useCallback((item: CartItem) => {
    setCart((prev) => {
      const index = prev.findIndex(
        (i) =>
          i.spectacleId === item.spectacleId &&
          i.seatNumber === item.seatNumber
      );
      if (index >= 0) {
        const updated = [...prev];
        updated[index].initialCount += 1;
        return updated;
      }
      return [...prev, item];
    });
  }, []);

  const removeFromCart = useCallback((id: number) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const updateCartItemCount = useCallback((id: number, newCount: number) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, initialCount: Math.max(1, newCount) }
          : item
      )
    );
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  const saveTicketHistory = async (cart: CartItem[]) => {
  if (!user) return;

  const tickets = cart.flatMap((item) =>
    Array.from({ length: item.initialCount }).map(() => ({
      spectacleId: item.spectacleId,
      seatId: item.seatId,
    }))
  );

  try {
    await api.post("/ticket", tickets);
    const { data } = await api.get<Ticket[]>("/ticket/my");
    setTicketHistory(data); // actualizează istoricul local
  } catch (error) {
    console.error("Failed to save ticket history:", error);
  }
};


  const login = async (username: string, password: string) => {
    try {
      const res = await api.post<{
        token: string;
        username: string;
        role: "ADMIN" | "User";
      }>("/user/login", { username, password });

      const { token, username: uname, role } = res.data;

      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
      localStorage.setItem("username", uname);

      setUser({ username: uname, role });
      setIsLoggedIn(true);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("username");
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark-theme" ? "light-theme" : "dark-theme"));
  };

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === "en" ? "ro" : "en"));
  };

  useEffect(() => {
    document.body.className = theme;
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem("language", language);
  }, [language]);

  return (
    <AppContext.Provider
      value={{
        isLoggedIn,
        user,
        login,
        logout,
        theme,
        toggleTheme,
        language,
        toggleLanguage,
        searchResults,
        setSearchResults,
        data,
        isError,
        refreshData,
        cart,
        addToCart,
        removeFromCart,
        updateCartItemCount,
        clearCart,
        ticketHistory,
        saveTicketHistory,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = React.useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};

export default AppContext;
