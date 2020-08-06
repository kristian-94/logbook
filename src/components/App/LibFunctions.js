import * as ROLES from "../../constants/roles";

export const SortClientList = (clientsList) => {
    // Make alphabetical order.
    clientsList.sort((client1, client2) => {
        const name1 = client1.name.toLowerCase();
        const name2 = client2.name.toLowerCase();
        if (name1 < name2) //sort string ascending
            return -1;
        if (name1 > name2)
            return 1;
        return 0; //default return value (no sorting)
    });
    return clientsList; // Sorted now
};

export const GetAdminUsersFromObject = (usersObject) => {
    const usersList = Object.keys(usersObject).map(key => ({
        ...usersObject[key],
        uid: key,
    }));
    return usersList.filter(user => {
        return user.roles[ROLES.ADMIN] === ROLES.ADMIN;
    });
};
