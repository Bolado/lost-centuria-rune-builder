import express from "express";
import { ObjectId } from "mongodb";
import jwt from "jsonwebtoken";

function getUser(req) {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
  if (!token) return null;
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    return null;
  }
}

export default function (db) {
  const router = express.Router();

  router.post("/save", async (req, res) => {
    const user = getUser(req);
    const { build, id } = req.body;

    try {
      if (user?.user_id && id) {
        const existingBuild = await db.collection("builds").findOne({
          _id: new ObjectId(id),
        });

        if (existingBuild?.user_id === user.user_id) {
          await db
            .collection("builds")
            .updateOne({ _id: new ObjectId(id) }, { $set: { build } });
          return res.json({ status: "updated", id });
        }
      }

      const result = await db.collection("builds").insertOne({
        build,
        ...(user ? { user_id: user.user_id } : { timestamp: new Date() }),
      });

      res.json({ status: "created", id: result.insertedId.toString() });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  router.get("/:id", async (req, res) => {
    try {
      const build = await db.collection("builds").findOne({
        _id: new ObjectId(req.params.id),
      });

      if (build) {
        return res.json(build.build);
      }
      res.status(404).json({ error: "Build not found" });
    } catch {
      res.status(404).json({ error: "Build not found" });
    }
  });

  return router;
}
