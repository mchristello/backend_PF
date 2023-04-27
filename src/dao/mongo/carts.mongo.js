import { CartModel } from "./models/carts.model.js";
import UserModel from "./models/users.model.js";
import { TicketModel } from "./models/tickets.model.js";
import Products from "./products.mongo.js";
import CustomError from "../../repository/errors/custom.error.js";
import { generateGeneralError, generateNotFoundError } from "../../repository/errors/info.js";
import ERRORS from "../../repository/errors/enums.js";

const productsService = new Products();
// const usersService = new Users();

export default class Carts {

    getCarts = async () => {
        const allCarts = await CartModel.find();
        return allCarts;
    }

    getCartById = async(cid) => {
        const cart = await CartModel.find({ _id: cid }).lean().exec();

        return cart;
    }

    createCart = async() => {
        const data = {
            cart: []
        }
        const newCart = await CartModel.create(data)
        return newCart;
    }

    addProduct = async(cartId, productId, user) => {
        const data = { cartId, productId, user };
        const findCart = await CartModel.findOne({ _id: cartId });

        if(findCart === null) {
            const newCart = await this.createCart(data)
            newCart.products.push({ product: productId, quantity: 1 });

            const getUser = await UserModel.findOne({ email: user.email });
            getUser.cart.push({ cart: newCart });
            getUser.save();
            const updateUser = await usersService.updateUser(getUser.email, cartId);
            return newCart;
        }
        
        const findProduct = await CartModel.findOne({ 'products.product': productId });
        if(findProduct) {
            const updateQty = await CartModel.updateOne({ 'products.product': productId }, { $inc: { 'products.$.quantity': 1 }});

            return updateQty;
        }

        findCart.products.push({ product: productId, quantity: 1 });

        let result = await CartModel.updateOne({ _id: cartId }, findCart)

        return result;
    }

    deleteProduct = async(cid, pid) => {
        console.log(cid);
        console.log(pid);

        const deleteProduct = await CartModel.updateOne({ _id: cid }, { $pull: { products: { product: pid }}});
        console.log(deleteProduct);

        if(deleteProduct === undefined) {
            CustomError.createError({
                name: `Delete error in carts.mongo.js`,
                cause: generateNotFoundError(pid),
                message: `Problema tratando de eliminar el producto ID: ${pid}`,
                code: ERRORS.NOT_FOUND_ERROR
            })
        }

        return deleteProduct;
    }

    emptyCart = async(cid) => {
        const emptyCart = await CartModel.updateOne({ _id: cid }, { products: [] });

        return emptyCart;
    }

    newTicket = async (user, acc) => {
        const newTicket = await TicketModel.create({ amount: acc, purchaser: user });
        return newTicket;    
    }

    purchase = async(cid, email) => {
        const cart = await CartModel.findOne({_id: cid });
        if (!cart) {
            CustomError.createError({
                name: `Purchase error in carts.mongo.js`,
                cause: generateNotFoundError(cid),
                message: `Problema tratando de encontrar el carrito ID: ${cid}`,
                code: ERRORS.NOT_FOUND_ERROR
            })
        }

        const products = Array.from(cart.products);
        if (products.length === 0) {
            CustomError.createError({
                name: `Purchase error in carts.mongo.js`,
                cause: generateGeneralError(),
                message: `No hay productos en el carrito.`,
                code: ERRORS.GENERAL_ERROR
            })
        }

        const user = await UserModel.find({ email: email })

        const total = await this.updateStock(cid, products);
        const acc = total.reduce((acc, acum) => acc + acum, 0)

        console.log(`THIS IS TOTAL FROM PURCHASE`, acc);

        const newTicket = await this.newTicket(user.email, acc);

        return newTicket;
    }

    updateStock = async (cid, products) => {
        const totalProducts = Promise.all(
            products.map(async (product) => {
                const productWithStock = await productsService.updateStock(product.product._id, product.quantity );
                if (productWithStock) {
                    await this.deleteProduct(cid, product.product._id);
                    const amount = product.product.price * product.quantity;
                    return amount
                }
                return 0
            })
        );
        return totalProducts;
    };
}