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
    },
    requestJoinTree(data) {
        return client.post(`/accessControl/requestJoin`, {
            "familyTreeId": data.familyTreeId,
            "userId": data.userId
        });
    },
    searchRequestList: (data) => {
        return client.get(`/accessControl/getListRequest/${data.userId}?page=${data.page}&itemsPerPage=${data.itemsPerPage}`, );
    },
    acceptRequest: (data) => {
        return client.put(`/accessControl/accept/${data.AccessID}`, );
    },
    rejectRequest: (data) => {
        return client.delete(`/accessControl/reject/${data.AccessID}`, );
    },
};

export default ApiServices;