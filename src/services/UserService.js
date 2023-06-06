import ApiFactory from "../factories/ApiFactory.js";
import { serialize } from "../utilities/querySerialize";
import {useMutation} from "react-query";

const list = ({ queryKey }) => {
  const [_key, filters] = queryKey;
  return new Promise((resolve, reject) => {
    ApiFactory.get(`/users?${serialize(filters)}`).then(
      (success) => resolve(success.data),
      (error) => reject(error)
    );
  });
};

const deleteUser= (id) => {
  return new Promise((resolve, reject) => {
      ApiFactory
          .delete(`/users/${id}`)
          .then((success) => resolve(success.data), (error) => reject(error));
  });
};

const roles = ({ filters }) => {
  const query = {
    ...filters,
  };
  return new Promise((resolve, reject) => {
    ApiFactory.get(`/roles?${serialize(query)}`).then(
      (success) => resolve(success.data),
      (error) => reject(error)
    );
  });
};

export const useCreateUser = () => {
  return useMutation((payload) => {
      return new Promise((resolve, reject) => {
          return ApiFactory
              .post("/users", payload)
              .then((success) => resolve(success.data), (error) => reject(error));
      });
  });
};

export const useUpdateUser = () => {
  return useMutation((payload) => {
      return new Promise((resolve, reject) => {
          return ApiFactory
              .put(`/users/${payload.id}`, payload)
              .then((success) => resolve(success.data), (error) => reject(error));
      });
  });
};

export default {
  list,
  roles,
  useUpdateUser,
  useCreateUser,
  deleteUser
};
