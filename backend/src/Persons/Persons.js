const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

//POST: Create a new Person #tested with
/* 
"FirstName": "May",
"LastName": "Bilal",
"BirthDate":"2004-11-23" ,
"Gender": "W",
"Hometown": "Rouen" 
*/
const createPerson = async (
  firstName,
  lastName,
  birthDate,
  gender,
  hometown,
  familyTreeId
) => {
  // Create FamilyObject
  const createdFamilyObject = await prisma.persons.create({
    data: {
      BirthDate: birthDate,
      Firstname: firstName,
      Gender: gender,
      Hometown: hometown,
      Lastname: lastName,
      FamilyTreeID: parseInt(familyTreeId),
    },
  });

  // Return either the created FamilyObject
  return createdFamilyObject;
};

const getAllPersonsinFamilyTree = async (familyTreeId) => {
  const familyObjects = await prisma.persons.findMany({
    where: {
      FamilyTreeID: parseInt(familyTreeId),
    },
    orderBy: {
      BirthDate: "desc",
    },
  });

  return familyObjects;
};

module.exports = { createPerson, getAllPersonsinFamilyTree };

/*
const personModel = Prisma.validator<Prisma.PersonCreateInput>({
  firstname: true,
  lastname: true,
  BirthDate: true,
  DateofDeath: true,
  Gender: true,
  Hometown: true,
  ProfilePicture: true,
  // Add other fields as needed
});

export { personModel };

 */
