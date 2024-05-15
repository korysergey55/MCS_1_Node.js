import * as moviesServices from "../services/moviesServices.js";

import ctrlWrapper from "../decorators/ctrlWrapper.js";

import HttpError from "../helpers/HttpError.js";

const getAll = async (req, res) => {
    const {_id: owner} = req.user;
    const filter = {owner};
    const fields = "-createdAt -updatedAt";
    const {page = 1, limit = 10} = req.query;
    const skip = (page - 1) * limit;
    const settings = {skip, limit};
    const result = await moviesServices.getAllMovies({filter, fields, settings});
    const total = await moviesServices.countMovies(filter);

    res.json({
        total,
        result,
    });
}

const getById = async (req, res) => {
    const { id: _id } = req.params;
    const {_id: owner} = req.user;
    const result = await moviesServices.getMovie({_id, owner});
    if (!result) {
        throw HttpError(404, `Movie with id=${id} not found`);
    }

    res.json(result);
}

const add = async (req, res) => {
    const {_id: owner} = req.user;
    const result = await moviesServices.addMovie({...req.body, owner});

    res.status(201).json(result);
}

const updateById = async (req, res) => {
    const { id: _id } = req.params;
    const {_id: owner} = req.user;
    const result = await moviesServices.updateMovie({_id, owner}, req.body);
    if (!result) {
        throw HttpError(404, `Movie with id=${id} not found`);
    }

    res.json(result);
}

const deleteById = async (req, res) => {
    const { id: _id } = req.params;
    const {_id: owner} = req.user;
    const result = await moviesServices.deleteMovie({_id, owner});
    if (!result) {
        throw HttpError(404, `Movie with id=${id} not found`);
    }

    // res.status(204).send()

    res.json({
        message: "Delete success"
    })
}

export default {
    getAll: ctrlWrapper(getAll),
    getById: ctrlWrapper(getById),
    add: ctrlWrapper(add),
    updateById: ctrlWrapper(updateById),
    deleteById: ctrlWrapper(deleteById),
}