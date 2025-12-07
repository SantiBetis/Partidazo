const getLoginSession = (req, res) => {
    if (req.session.currentUser) {
        res.status(200).json({
            status: 200,
            result: req.session.currentUser,
            message: "express-session ha obtenido datos del usuario actual",
        });
    } else {
        res.status(404).json({
            status: 404,
            result: null,
            message: "No hay datos de usuario almacenados en express-session",
        });
    }
};

const postLoginSession = (req, res) => {
    const currentUser = req.body;

    if (req.session.currentUser) {
        res.status(400).json({
            status: 400,
            result: null,
            message: "Ya hay datos de usuario en express-session",
        });
    } else {
        req.session.currentUser = currentUser;
        res.status(200).json({
            status: 200,
            result: req.session.currentUser,
            message: "Datos del usuario actual agregados a express-session",
        });
    }
};

const deleteLoginSession = (req, res) => {
    req.session.destroy();

    res.status(200).json({
        status: 200,
        result: null,
        message: "Datos del usuario actual eliminados de express-session",
    });
};

module.exports = { getLoginSession, postLoginSession, deleteLoginSession };
