import { create } from "zustand";

import { type User } from "../utils/schema";

interface Store {
  openVN: boolean;
  setOpenVN: (open: boolean) => void;
  openRHF: boolean;
  setOpenRHF: (open: boolean) => void;
  users: User[];
  setUsers: (users: User[]) => void;
  fetchUsers: () => void;
  setFetchUsers: (fetchUsers: () => void) => void;
  error: string;
  setError: (error: string) => void;
}

const useStore = create<Store>((set) => ({
  openVN: false,
  setOpenVN: (open) => set({ openVN: open }),
  openRHF: false,
  setOpenRHF: (open) => set({ openRHF: open }),
  users: [],
  setUsers: (users) => set({ users }),
  fetchUsers: () => {},
  setFetchUsers: (fetchUsers) => set({ fetchUsers }),
  error: "",
  setError: (error) => set({ error }),
}));

export default useStore;
