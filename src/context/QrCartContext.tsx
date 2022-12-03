import { createContext, useContext, ReactNode, useState, useEffect, useRef } from "react";
// import { useLocalStorage } from "../hooks/useLocalStorage";

import { get as getLocal } from "local-storage";

import QrCart from "./components/QrCart";

type QrCartProviderProps = {
  children: ReactNode;
};

type QrCartContext = {
  openCart: () => void;
  closeCart: () => void;
  getItemQuantity: (id: string) => number;
  increaseCartQuantity: (id: string, department: string) => void;
  decreaseCartQuantity: (id: string) => void;
  removeFromCart: (id: string) => void;
  cartQuantity: number;
  cartItems: QrItem[];
};

type QrItem = {
  id: string;
  quantity: number;
  department: string;
};

const QrCartContext = createContext({} as QrCartContext);

export function useQrCart() {
  return useContext(QrCartContext);
}

export function QrCartProvider({ children }: QrCartProviderProps) {
  const [isOpen, setIsOpen] = useState(false);
  // const [cartItems, setCartItems] = useLocalStorage<QrItem[]>("qr", []);
  // const [cartItems, setCartItems] = useState<QrItem[]>(() => {
  //   if (typeof window !== "undefined") {
  //     return getLocal("qr-code");
  //   }

  //   return [];
  // });

  const [cartItems, setCartItems] = useState<QrItem[]>([]);

  const cartQuantity = cartItems?.reduce((quantity, item) => item.quantity + quantity, 0);

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);
  function getItemQuantity(id: string) {
    return cartItems.find((item) => item.id === id)?.quantity || 0;
  }
  function increaseCartQuantity(id: string, department: string) {
    setCartItems((currItems) => {
      if (currItems.find((item) => item.id === id) == null) {
        return [...currItems, { id, quantity: 1, department: department }];
      } else {
        return currItems.map((item) => {
          if (item.id === id) {
            return { ...item, quantity: item.quantity + 1 };
          } else {
            return item;
          }
        });
      }
    });
  }
  function decreaseCartQuantity(id: string) {
    setCartItems((currItems) => {
      if (currItems.find((item) => item.id === id)?.quantity === 1) {
        return currItems.filter((item) => item.id !== id);
      } else {
        return currItems.map((item) => {
          if (item.id === id) {
            return { ...item, quantity: item.quantity - 1 };
          } else {
            return item;
          }
        });
      }
    });
  }
  function removeFromCart(id: string) {
    setCartItems((currItems) => {
      return currItems.filter((item) => item.id !== id);
    });
  }

  const [isReady, setIsReady] = useState(null);
  const customFunctionRunRef = useRef(false);

  useEffect(() => {
    const customEffect = async () => {
      try {
        setCartItems(getLocal("qr-code"));
        return setIsReady(getLocal("qr-code"));
      } catch {
        return null;
      }
    };

    customEffect();
  }, []);

  useEffect(() => {
    if (isReady !== null && !customFunctionRunRef.current) {
      // won't run before isReady is non-null
      // won't run after customFunctionRunRef true
      localStorage.setItem("qr-code", JSON.stringify(cartItems));
    }
  }, [cartItems, isReady]);

  return (
    <QrCartContext.Provider
      value={{
        getItemQuantity,
        increaseCartQuantity,
        decreaseCartQuantity,
        removeFromCart,
        openCart,
        closeCart,
        cartItems,
        cartQuantity,
      }}
    >
      {children}
      <QrCart isOpen={isOpen} />
    </QrCartContext.Provider>
  );
}
