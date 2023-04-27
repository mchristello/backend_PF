console.log(`Esto es desde el index.js que maneja el Front`);

// Elementos del DOM
// let btnNewProduct = document.getElementById('btn_new-product');
let deleteBtn = document.querySelector('#delete_product_btn');
let sendBtn = document.getElementById('send-btn');
let addProductBtn = document.querySelectorAll('#buy_product__btn');
let cartId = document.getElementById('cart_id').innerHTML;


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

addProductBtn.forEach(b => {
    b.addEventListener('click', ()=> {
        const productId = b.value;
        addProductToCart(cartId, productId)
    })
})


// TODO ---> eliminar producto con boton.
// const deleteProduct = async(pid) => {
//     const response = await fetch(`/api/products/${pid}`, {
//         method: 'DELETE',
//         headers: {
//             "Content-Type": "application/json"
//         }
//     });
//     const result = await response.json();

//     if(result.status === 'success') {
//         Swal.fire({
//             icon: 'success',
//             title: 'Product deleted successfully',
//             toast: true,
//             position: 'top-right',
//             timer: 1500,
//             timerProgressBar: true
//         })
//     }
// }

deleteBtn.addEventListener("click", () => {
    console.log(deleteBtn.value);
})

