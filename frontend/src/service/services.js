import { client } from "./axiosClient";

const ApiServices = {
  searchFamilyTree: (keyword)  => {
    return client.get(`/familyTree/search/${keyword}`);
  },
  searchAllFamilyTree: ()  => {
    return client.get(`/familyTree/searchAll`);
  },
  getFamilyTreeById: (id) => {
    return client.get(`/familyTree/getById/${id}`);
  },
  createFamilyTree(data) {
    return client.post(`/familyTree`, {
      "name" : data.name,
      "userID" : data.userID,
      "description" : data.description,
      "ispublic" : data.ispublic
    });
  }
};

export default ApiServices;