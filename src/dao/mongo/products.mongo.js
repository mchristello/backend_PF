import CustomError from "../../repository/errors/custom.error.js";
import ERRORS from "../../repository/errors/enums.js";
import { generateNoStockError, generateNotFoundError } from "../../repository/errors/info.js";
import ProductModel from "./models/products.model.js";



export default class Products {

    get = async (options, query) => {
        const search = {}
        if (query) {
            search["$or"] = [{
                    title: {
                        $regex: query
                    }
                },
                {
                    description: {
                        $regex: query
                    }
                },
                {
                    category: {
                        $regex: query
                    }
                },
            ]
            const products = await ProductModel.paginate(search, options);
            return products;
        }

        const products = await ProductModel.paginate({}, options);
        return products;
    }

    find = async (data) => {
        const filteredProducts = await ProductModel.find({ _id: data }).lean().exec();
        if (!filteredProducts) {
            CustomError.createError({
                name: `Product search error`,
                cause: generateNotFoundError(data),
                message: `Problema tratando de encontrar el producto. ID ${data} incorrecto.`,
                code: ERRORS.NOT_FOUND_ERROR
            })
        }
        return filteredProducts;
    }

    add = async (data) => {
        const newProduct = await ProductModel.create(data);
        console.log(`New product added to the DB: ${newProduct.description}`);
        return newProduct;
    }

    update = async (id, data) => {
        const updateProduct = await ProductModel.updateOne({ _id: id }, data);
        req.logger.info(`The product ${updateProduct.description} has been updated`);
        return updateProduct;
    }

    deleteOne = async (id) => {
        const product = await ProductModel.findOne({ _id: id });
        console.log(`PRODUCT FROM PRODUCTS.MONGO ----> ${product}`)
        // const productToDelete = await ProductModel.deleteOne({ _id: id });
        // req.logger.info(`The product has been deleted`);
        // return productToDelete;
    }

    updateStock = async (pid, quantity) => {
        const product = await this.find(pid);
        console.log(`THIS IS PRODUCT FROM UPDATESTOCK: `, product);

        if (product.stock < quantity) {
            CustomError.createError({
                name: `Stock Error`,
                cause: generateNoStockError(pid, quantity),
                message: `Problema con stock al agregar al carrito`,
                code: ERRORS.NO_STOCK_ERROR
            })    
        }

        const result = await ProductModel.updateOne({ _id: pid },{ $inc: { stock: -quantity }});
        
        return result;
    }
}