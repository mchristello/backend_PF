let deleteProductBtn = document.querySelectorAll('#delete_btn');
let cartBtn = document.getElementById('purchase');
let emptyCart = document.getElementById('empty_cart');

// DELETE para eliminar producto del carrito
const cid = document.getElementById('payment').value;

const deleteProduct = async(cid, pid)=> {
    const response = await fetch(`/api/carts/${cid}/products/${pid}`, {
        method: 'DELETE',
        headers: {
            "Content-Type": "application/json"
        }
    })

    const result = await response.json()
    
    if(result.status === 'success') {
        Swal.fire({
            icon: 'warning',
            title: 'Product deleted successfully',
            toast: true,
            position: 'top-right',
            timer: 1500,
            timerProgressBar: true
        })
    }
}

deleteProductBtn.forEach((b) => {
    b.addEventListener("click", (e) => {
        e.preventDefault()
        const pid = b.value;
        deleteProduct(cid, pid);
    });
});

// Empty cart
emptyCart.addEventListener('click', () =>{
    deleteAllProducts(cid);
})

const deleteAllProducts = async(cid) =>{
    const response = await fetch(`/api/carts/${cid}`, {
        method: 'DELETE',
        headers: {
            "Content-Type": "application/json"
        }
    })

    const result = await response.json()

    if(result.status === 'success') {
        Swal.fire({
            icon: 'warning',
            title: 'All products has been deleted from cart. Please refresh!',
            toast: true,
            position: 'center',
            timer: 1500,
            timerProgressBar: true
        })
    }
}


// POST para confirmar ticket 
cartBtn.addEventListener("click", (e) => {
    e.preventDefault()
    confirmTicket(cartBtn.value)
})

const confirmTicket = async(cid) => {
    try {
        const response = await fetch(`/carts/${cid}/purchase`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
        });

        const result = await response.json();

        if (result.status === 'success') {
            Swal.fire({
                icon: 'success',
                title: 'Your purchase is complete! Check for confirmation email in your inbox.',
                toast: true,
                position: 'center',
                showConfirmButton: true,
                confirmButtonText: `OK!`,
                allowOutsideClick: false
            })
        }
    } catch (error) {
        console.error(`Error en cart.js ----> ${error.message}`);
    }
}