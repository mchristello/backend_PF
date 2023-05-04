import { CartModel } from "./models/carts.model.js";
import UserModel from "./models/users.model.js";
import { TicketModel } from "./models/tickets.model.js";
import Products from "./products.mongo.js";
import CustomError from "../../repository/errors/custom.error.js";
import { generateAutorizationError, generateGeneralError, generateNotFoundError } from "../../repository/errors/info.js";
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
        // console.log(`CARTID IN CARTMONGO --->`, cartId);

        const findCart = await CartModel.findOne({ _id: cartId });
        console.log(`CARRITO BUSCADO DESDE CART.MONOG ----> `, JSON.stringify(findCart, null, 2, `\t`));

        if(findCart === null) {
            const newCart = await this.createCart(data)
            newCart.products.push({ product: productId, quantity: 1 });

            const getUser = await UserModel.findOne({ email: user.email });
            getUser.cart.push({ cart: newCart });
            getUser.save();
            const updateUser = await usersService.updateUser(getUser.email, cartId);
            return newCart;
        }
        
        // const findProduct = await CartModel.findOne({ _id: cartId}, { 'products.product': productId });

        const findProduct = findCart.products.find(p => p.product.id === productId)
        console.log(`FINDPRODUCT FROM CARTMONGO: `, JSON.stringify(findProduct, null, 2, `\t`));
        
        if(findProduct) {
            if (findProduct.owner == user._id) {
                CustomError.createError({
                    name: `Delete error in carts.mongo.js`,
                    cause: generateAutorizationError(pid),
                    message: `Problema tratando de agregar el producto ID: ${productId}`,
                    code: ERRORS.AUTHORIZATION_ERROR
                })
            }
            // findProduct.quantity = findProduct.quantity + 1
            const updateQty = await CartModel.updateOne({ 'products.product': productId }, { $inc: { 'products.$.quantity': 1 }});
            console.log(`FINDPRODUCT FROM CARTMONGO CONDITIONAL: `, updateQty);

            return findProduct;
        }

        findCart.products.push({ product: productId, quantity: 1 });
        console.log(`FINDCART IN CARTMONGO ---> `, JSON.stringify(findCart, null, 2, `\t`));

        let result = await CartModel.updateOne({ _id: cartId }, findCart)

        return result;
    }

    deleteProduct = async(cid, pid) => {
        const deleteProduct = await CartModel.updateOne({ _id: cid }, { $pull: { products: { product: pid }}});

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
        const newTicket = await TicketModel.create({ amount: acc, purchaser: user._id });
        console.log(newTicket);
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

        const newTicket = await this.newTicket(user, acc);

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