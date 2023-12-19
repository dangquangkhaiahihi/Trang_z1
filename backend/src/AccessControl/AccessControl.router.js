const express = require("express");

const AccessControlRouter = express.Router();

const accessControlService = require("./AccessControl");

// POST: Give a user access to a family tree #tested
AccessControlRouter.post("/:familyTreeId/:userId", async (req, res) => {
  const familyTreeId = Number(req.params.familyTreeId);
  const userId = Number(req.params.userId);
  const accessLevel = req.body.AccessLevel;
  console.log(familyTreeId, "familyTreeId");

  /*   const existingAccess = await accessControlService.getAccess(
    familyTreeId,
    userId
  );

  if (existingAccess) {
    return res.status(400).json({
      message: "User already has access with level: " + existingAccess,
    });
  } */
  try {
    // Grant access
    const accessControl = await accessControlService.giveAccess(
      familyTreeId,
      userId,
      accessLevel
    );

    if (!accessControl) {
      return res.status(404).json({ message: "AccessControl not found" });
    } else {
      return res.status(200).json(accessControl);
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

// GET: Get all users with access to a family tree #tested
AccessControlRouter.get("/:familyTreeId", async (req, res) => {
  const familyTreeId = Number(req.params.familyTreeId);
  try {
    const accessControl = await accessControlService.getAllAccess(familyTreeId);
    if (!accessControl) {
      return res.status(404).json({ message: "AccessControl not found" });
    } else {
      return res.status(200).json(accessControl);
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

//GET: Get Access Level of a user to a family tree #nottested
AccessControlRouter.get("/:familyTreeId/:userId", async (req, res) => {
  const familyTreeId = Number(req.params.familyTreeId);
  const userId = Number(req.params.userId);
  try {
    const accessControl = await accessControlService.getAccess(
      familyTreeId,
      userId
    );
    if (!accessControl) {
      return res.status(404).json({ message: "AccessControl not found" });
    } else {
      return res.status(200).json(accessControl);
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

//PUT: Update Access Level of a user to a family tree #nottested
AccessControlRouter.put("/:familyTreeId/:userId", async (req, res) => {
  const familyTreeId = Number(req.params.familyTreeId);
  const userId = Number(req.params.userId);
  const accessLevel = req.body.AccessLevel;
  try {
    const accessControl = await accessControlService.updateAccess(
      familyTreeId,
      userId,
      accessLevel
    );
    if (!accessControl) {
      return res.status(404).json({ message: "AccessControl not found" });
    } else {
      return res.status(200).json(accessControl);
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

module.exports = AccessControlRouter;
