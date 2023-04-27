let deleteProductBtn = document.querySelectorAll('#delete_btn');
let cartBtn = document.getElementById('purchase');


// DELETE para eliminar del carrito

const cid = document.getElementById('purchase').value;

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
            console.log(`Compra realizada con exito con el ticket ${result.payload.code}`);
        }
    } catch (error) {
        req.logger.error(error.message);
    }
}