console.log(`From Product Detail.js`);
let addProductBtn = document.getElementById('buy_product__btn');

let cid = document.getElementById('cart_id').innerHTML

// POST para agregar al carrito
const addProductToCart = async(cartId, productId) => {
    const response = await fetch(`/api/carts/${cartId}/products/${productId}`, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        }
    });
    const result = await response.json();

    if(result.status === 'success') {
        Swal.fire({
            icon: 'success',
            title: 'Product added successfully',
            toast: true,
            position: 'top-right',
            timer: 1500,
            timerProgressBar: true
        })
    }
}

addProductBtn.addEventListener('click', () => {
    const productId = addProductBtn.value;
    const cartId = cid
    addProductToCart(cartId, productId)
})