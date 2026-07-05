import { createContext, useContext, useState, useEffect } from "react";

const WatchlistContext = createContext();

export const WatchlistProvider = ({ children }) => {
  const [watchlist, setWatchlist] = useState([]);

  // load from localStorage
  useEffect(() => {
    const data = localStorage.getItem("watchlist");
    if (data) setWatchlist(JSON.parse(data));
  }, []);

  // save to localStorage
  useEffect(() => {
    localStorage.setItem("watchlist", JSON.stringify(watchlist));
  }, [watchlist]);

  const addToWatchlist = (course) => {
    const exists = watchlist.find((c) => c.id === course.id);
    if (!exists) {
      setWatchlist([...watchlist, course]);
    }
  };

  const removeFromWatchlist = (id) => {
    setWatchlist(watchlist.filter((c) => c.id !== id));
  };

  return (
    <WatchlistContext.Provider
      value={{ watchlist, addToWatchlist, removeFromWatchlist }}
    >
      {children}
    </WatchlistContext.Provider>
  );
};

export const useWatchlist = () => useContext(WatchlistContext);
