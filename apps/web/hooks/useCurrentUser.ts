import { useEffect, useState } from "react";
import { getMyDetails } from "../actions/getMyDetails";
import { Friends, User } from "db";
import { toast } from "react-hot-toast";

interface MeType extends User {
  friends: Friends[];
}

export const useCurrentUser = () => {
  const [user, setUser] = useState<MeType>();

  useEffect(() => {
    getMyDetails().then((data) => {
      if (data.error) {
        toast.error(data.error);
      }
      if (data.detail) {
        setUser(data.detail);
      }
    });
  }, []);

  return { me: user };
};
