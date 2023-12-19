const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const giveAccess = async (familyTreeID, userID, accessLevel) => {
  // Create the access control
  const accessID = `${userID}_${familyTreeID}`;
  const createdAccessControl = await prisma.accessControl.create({
    data: {
      Users: {
        connect: {
          UserID: parseInt(userID),
        },
      },
      FamilyTree: {
        connect: {
          FamilyTreeID: parseInt(familyTreeID),
        },
      },
      AccessType: accessLevel,
      AccessID: accessID,
    },
  });

  // Return either the created access control
  return createdAccessControl;
};

const changeAccess = async (familyTreeID, userID, accessLevel) => {
  // Create the access control
  const changedAccessControl = await prisma.accessControl.update({
    where: {
      FamilyTreeID: parseInt(familyTreeID),
      UserID: parseInt(userID),
    },
    data: {
      AccessLevel: accessLevel,
    },
  });

  // Return either the created access control
  return changedAccessControl;
};

const getAccess = async (familyTreeID, userID) => {
  // Search the access control
  const accessControl = await prisma.accessControl.findFirst({
    where: {
      FamilyTreeID: parseInt(familyTreeID),
      UserID: parseInt(userID),
    },
  });

  // Return either the created access control
  return accessControl?.AccessType;
};

const getAllAccess = async (familyTreeID) => {
  // Create the access control
  const accessControl = await prisma.accessControl.findMany({
    where: {
      FamilyTreeID: parseInt(familyTreeID),
    },
  });

  // Return either the created access control
  return accessControl;
};

const getAllAccessAccesTypeEdit = async (familyTreeID) => {
  // Create the access control
  const accessControl = await prisma.accessControl.findMany({
    where: {
      FamilyTreeID: parseInt(familyTreeID),
      AccessType: "edit",
    },
  });

  // Return either the created access control
  return accessControl;
};

module.exports = {
  giveAccess,
  changeAccess,
  getAccess,
  getAllAccess,
  getAllAccessAccesTypeEdit,
};
