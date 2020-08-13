const express = require("express");

const router = express.Router();
const user = require("./userDb");
const post = require("../posts/postDb");


router.post("/", validateUser, (req, res) => {
    // do your magic!
    user
        .insert(req.body)
        .then(users => {
            res.status(201).json(users);
        })
        .catch(err => {
            
            res.status(500).json({
                errmessage: "There was an error creating a user."
            });
        });
});

router.post("/:id/posts", validatePost, (req, res) => {
    const userId = req.params.id;
    const posts = { ...req.body, user_id: userId };
    // do your magic!
    post
        .insert(posts)
        .then(users => {
            res.status(201).json(users);
        })
        .catch(err => {
            console.log("Create User Post Error:", err);
            res.status(500).json({
                errmessage: "There was an error creating a post."
            });
        });
});

router.get("/", (req, res) => {
    // do your magic!
    user
        .get()
        .then(users => res.status(200).json(users))
        .catch(err => {
            res.status(500).json({ error: "Users could not be retrived" });
        });
});

router.get('/:id', validateUserId, (req, res, next) => {
  user.getById(req.params.id)
    .then(users => {
      res.status(200).json(users)
    })
    .catch((error) => {
      next(error)
    })
})
router.get('/:id/posts', validateUserId, (req, res, next) => {
  user.getUserPosts(req.params.id)
    .then(posts => {
      res.status(200).json(posts)
    })
    .catch((error) => {
      next(error)
    })
})

router.delete("/:id", (req, res) => {
    // do your magic!
    user
        .remove(req.params.id)
        .then(users =>
            res.status(200).json({ message: `User has been deleted` })
        )
        .catch(err => {
            res.status(500).json({ errmessage: "User Could not be deleted" });
        });
});

router.put("/:id", validateUser, (req, res) => {
    // do your magic!
    const userId = req.params.id;

    user
        .update(userId, req.body)
        .then(() => {
          res.status(200).json({
              message: "User has been updated."
            });
        })
        .catch(err => {
            console.log("Error:", err);
            res.status(500).json({
                message: "There was a problem updating user ."
            });
        });
});

//custom middleware

function validateUserId(req, res, next) {
    // do your magic!
    user
        .getById(req.params.id)
        .then(users => {
            if (users) {
                req.user = users;
                next();
            } else {
                res.status(400).json({ message: "Invalid user id." });
            }
        })
        .catch(err => {
            err => {
               
                res.status(500).json({
                    message: `There was a problem retriving the user`
                });
            };
        });
}

function validateUser(req, res, next) {
    // do your magic!
    if (req.body) {
        if (req.body.name) {
            next();
        } else {
            res.status(400).json({ message: "Missing required name field." });
        }
    } else {
        res.status(400).json({ message: "Missing user data." });
    }
}

function validatePost(req, res, next) {
    // do your magic!
    if (req.body) {
        if (req.body.text) {
            next();
        } else {
            res.status(400).json({ message: "Missing required text field." });
        }
    } else {
        res.status(400).json({ message: "Missing post data." });
    }
}

module.exports = router;