import instance from "./instance";

export const login = (email: string, password: string) => {
  return instance
    .get(`/users?login=${email}&pass=${password}`)
    .then(function (response) {
      return response.data;
    })
    .catch(function (error) {
      console.log(error);
    });
};

export const getUsers = () => {
  return instance
    .get(`/users`)
    .then(function (response) {
      return response.data;
    })
    .catch(function (error) {
      console.log(error);
    });
};
