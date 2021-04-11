const router = require("express").Router();
let validateJWT = require("../middleware/validate-jwt");
const { LogModel } = require("../models");

/*
============================================================
LOG (POST) - USER CAN CREATE A LOG
============================================================
*/

router.post('/', validateJWT, async (req, res) => {
    const { description, definition, result } = req.body.log;
    const { id } = req.user;
    const logEntry = {
        description,
        definition,
        result,
        owner_id: id
    }
    try {
        const newLog = await LogModel.create(logEntry);
        res.status(200).json(newLog);
    } catch (err) {
        res.status(500).json({error: err});
    }
    LogModel.create(logModel)
});

/*
============================================================
LOG (GET) - USER CAN GET ALL OF THEIR OWN LOGS
============================================================
*/

router.get('/', validateJWT, async (req, res) => {
    const { id } = req.user;
    try {
        const userLogs = await LogModel.findAll({
            where: {
                owner_id: id
            }
        });
        res.status(200).json(userLogs);
    } catch (err) {
        res.status(500).json({ error: err });
    }
});

/*
============================================================
LOG:ID (GET) - GETS LOGS BY ID FOR A USER
============================================================
*/

router.get("/:postNumber", validateJWT, async (req, res) => {
    const { id } = req.user;
    let { postNumber } = req.params;
    try {
        const userLog = await LogModel.findAll({
            where: {
                id: postNumber,
                owner_id: id
            }
        });
        res.status(200).json(userLog);
    } catch (err) {
        res.status(500).json({ error: err });
    }
});

/*
============================================================
LOG:ID (PUT) - ALLOWS A LOG TO BE UPDATED BY ITS ID
============================================================
*/

router.put("/:postNumber", validateJWT, async (req, res) => {
    
    const { description, definition, result } = req.body.log;
    const { id } = req.user;
    let { postNumber } = req.params;
    
    const query = {
        where: {
            id: postNumber,
            owner_id: id
        }
    };

    const updatedLog = {
        description,
        definition,
        result
    }

    try {
        const update = await LogModel.update(updatedLog, query);
        res.status(200).json(userLog);
    } catch (err) {
        res.status(500).json({ error: err });
    }
});

/*
============================================================
LOG:ID (DELETE) - DELETES LOG FOR A USER
============================================================
*/

router.delete('/:postNumber', validateJWT, async (req, res) => {
    const { id } = req.user;
    let { postNumber } = req.params;

    try {
        const query = {
            where: {
                id: postNumber,
                owner_id: id
            }
        };

        await LogModel.destroy(query);
        res.status(200).json({message: "jouranl destroyed"});
    } catch (err) {
        res.status(500).json({error: err});
    }
});

module.exports = router;