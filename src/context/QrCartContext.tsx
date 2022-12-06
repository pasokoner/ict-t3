import { createContext, useContext, ReactNode, useEffect, useState } from "react";
// import { useLocalStorage } from "../hooks/useLocalStorage";

import useStateRef from "react-usestateref";

import { get as getLocal } from "local-storage";

import QrCart from "./components/QrCart";
import { trpc } from "../utils/trpc";

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
  emptyCart: () => void;
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

  const [cartItems, setCartItems, cartRef] = useStateRef<QrItem[]>([]);

  const cartQuantity = cartItems?.reduce((quantity, item) => item.quantity + quantity, 0);

  const [openLocal, setOpenLocal] = useState<boolean>();

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

  function emptyCart() {
    setCartItems([]);
  }

  useEffect(() => {
    const value = localStorage.getItem("qr-code");
    const user = !!value ? JSON.parse(value) : [];
    setCartItems(user);
  }, []);

  useEffect(() => {
    localStorage.setItem("qr-code", JSON.stringify(cartRef.current));
  }, [cartItems, cartRef]);

  return (
    <QrCartContext.Provider
      value={{
        getItemQuantity,
        increaseCartQuantity,
        decreaseCartQuantity,
        removeFromCart,
        emptyCart,
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
