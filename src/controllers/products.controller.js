import { ProductsService } from '../repository/index.js';


export const get = async(req, res) => {
    try {
        const result = await ProductsService.get();

        return res.status(200).send({ status: 'success', payload: result });
    } catch (error) {
        req.logger.error(error)
        return res.status(400).send({ status: 'error', error: error.message });
    }
}

export const find = async(req, res) => {
    try {
        const pid = req.params.pid;

        const result = await ProductsService.find(pid);
        return res.status(200).send({ status: 'success', payload: result });
    } catch (error) {
        req.logger.error(error)
        return res.status(400).send({ status: 'error', error: error.message });
    }
}

export const add = async (req, res) => {
    try {
        const data = req.body
        const owner = req.session.user._id
        
        const body = {
            title: data.title,
            description: data.description,
            thumbnail: data.thumbnail,
            category: data.category,
            price: data.price,
            code: data.code,
            status: true,
            stock: data.stock,
            owner: owner
        }

        const result = await ProductsService.add(body);

        return res.status(200).send({ status: 'success', payload: result })
    } catch (error) {
        req.logger.error(error.message)
        return res.status(500).send({ status: 'error', error: error.message });
    }
}

export const update = async(req, res) => {
    try {
        const pid = req.params.pid
        const data = req.body

        const result = await ProductsService.update(pid, data);

        return res.status(200).send({ status: 'success', payload: result });
    } catch (error) {
        req.logger.error(error)
        return res.status(400).send({ status: 'error', error: error.message });
    }
}

export const deleteOne = async(req, res) => {
    try {
        const pid = req.params.pid
        console.log(`PID DELETE: `, pid);
        const user = req.session.user
        console.log(`USER FROM DELETEONE ---> `, user);

        const result = await ProductsService.deleteOne(pid);

        return res.status(200).send({ status: 'success', payload: result })
    } catch (error) {
        req.logger.error(`${error.message} at URL: ${req.url}`)
        return res.status(400).send({ status: 'error', error: error.message });
    }
}