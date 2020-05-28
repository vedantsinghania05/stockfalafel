export const resOk = (res, entity) => res.status(200).json(entity);
export const resCreated = (res, entity) => res.status(201).json(entity);
export const resNoContent = (res, entity) => res.status(204).json(entity);

export const resError = (res, error) => res.status(error.httpcode || 500).json({message: error.message || ''});
export const resBad = (message) => { return {httpcode: 400, message: message } }
export const resUnauthorized = (message) => { return {httpcode: 401, message: message } }
export const resNotFound = (message) => { return {httpcode: 404, message: message } }
export const resConflict = (message) => { return {httpcode: 409, message: message } }
export const resInternal = (message) => { return {httpcode: 500, message: message } }