import { useEffect } from "react";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useShallow } from "zustand/shallow";

import { URL_DATA, refetchInterval } from "../utils/env";
import { type User, usersSchema } from "../utils/schema";
import useStore from "./store";

function useUsers() {
  const [setUsers, setFetchUsers, setError] = useStore(
    useShallow((state) => [
      state.setUsers,
      state.setFetchUsers,
      state.setError,
    ]),
  );

  async function fetchUsers() {
    const res = await axios.get<User[]>(URL_DATA);

    // Validation from Zod
    const result = usersSchema.safeParse(res.data);

    if (!result.success) {
      console.log({ error: result.error.issues });
      const errorMsg = JSON.stringify(result.error.issues);
      setError(errorMsg);
      return Promise.reject(errorMsg);
    }

    // Notice that result.data has the correct type.
    const usersSorted = result.data.sort((a, b) => b.createdAt - a.createdAt);

    setUsers(usersSorted);
    return null; // I don't need react query to return data.
  }

  const query = useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers,
    refetchInterval: refetchInterval,
  });

  useEffect(() => {
    setFetchUsers(query.refetch);
  }, []);
}

export default useUsers;
