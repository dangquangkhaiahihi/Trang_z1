const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const getFamilyTree = async (id) => {
  return prisma.familyTree.findUnique({
    where: {
      FamilyTreeID: id,
    },
  });
};

const searchFamilyTrees = async (name) => {
  return prisma.familyTree.findMany({
    where: {
      Name: name,
    },
    orderBy: {
      CreationDate: "asc",
    },
  });
};

const setNodePosition = (nodePosition, familyTreeID) => {
  return prisma.familyTree.update({
    where: {
      FamilyTreeID: familyTreeID,
    },
    data: {
      NodePosition: nodePosition,
    },
  });
};

const getNodePosition = (familyTreeID) => {
  return prisma.familyTree.findUnique({
    where: {
      FamilyTreeID: familyTreeID,
    },
    select: {
      NodePosition: true,
    },
  });
};

const deleteNodePosition = (familyTreeID) => {
  return prisma.familyTree.update({
    where: {
      FamilyTreeID: familyTreeID,
    },
    data: {
      NodePosition: null, // Set to null or whatever default value you prefer
    },
    select: {
      NodePosition: true,
    },
  });
};

const retrievePersonsInFamTree = async (familyTreeID) => {
  const familyTree = await prisma.familyTree.findUnique({
    where: {
      FamilyTreeID: familyTreeID,
    },
    include: {
      AccessControl: {
        include: {
          FamilyObject: true,
        },
      },
    },
  });

  return (
    familyTree?.AccessControl.map(
      (accessControl) => accessControl.FamilyObject
    ) || null
  );
};

const createFamilyTree = async (name, userID, description, ispublic) => {
  // Create the family tree
  const createdFamilyTree = await prisma.familyTree.create({
    data: {
      Users: {
        connect: {
          UserID: parseInt(userID),
        },
      },
      Name: name,
      CreationDate: new Date(),
      Describtion: description,
      IsPublic: ispublic,
    },
  });

  // Access the FamilyTreeID from the createdFamilyTree
  const familyTreeId = createdFamilyTree.FamilyTreeID;
  const accessID = `${userID}_${familyTreeId}`;

  // Create the associated access control entry
  await prisma.accessControl.create({
    data: {
      Users: {
        connect: {
          UserID: parseInt(userID),
        },
      },
      FamilyTree: {
        connect: {
          FamilyTreeID: parseInt(familyTreeId),
        },
      },
      AccessType: "edit",
      AccessID: accessID,
    },
  });

  // Return the FamilyTreeID
  return createdFamilyTree;
};

module.exports = {
  getFamilyTree,
  searchFamilyTrees,
  retrievePersonsInFamTree,
  createFamilyTree,
  setNodePosition,
  getNodePosition,
  deleteNodePosition,
};
