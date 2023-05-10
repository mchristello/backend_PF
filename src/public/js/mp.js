console.log(`DESDE mp.js`);

const mp = new MercadoPago('TEST-65297cff-03dd-4c86-8ca3-e916fb13478b');
const bricksBuilder = mp.bricks();

// DOM
const totalPayment = document.getElementById('total_payment');
const cid = document.getElementById('cart_id').innerText;
console.log(cid);

// MP Form Render.
const renderCardPaymentBrick = async (bricksBuilder) => {
    const settings = {        
        initialization: {
            amount: totalPayment.innerText, //valor del pago a realizar
        },
        callbacks: {
            onReady: () => {
                console.log(`El brick está completo`)
            },
            onSubmit: (formData) => {
                // callback llamado al hacer clic en el botón enviar datos
                const response = fetch(`/carts/${cid}/purchase`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(formData)
                })
                // recibir el resultado del pago
                // const result = response.json();
                console.log(`RESULT OF FETCH---->`, response);
        
                // if (result.status === 'success') {
                //     Swal.fire({
                //         icon: 'success',
                //         title: 'Your purchase is complete! Check for confirmation email in your inbox.',
                //         position: 'center',
                //         showConfirmButton: true,
                //         confirmButtonText: `<a href='https://localhost:8080/carts/${cid}/purchaseConfirmaation'`,
                //         allowOutsideClick: false
                //     })
                // }
                resolve();
            },
            onError: (error) => {
                // callback llamado para todos los casos de error de Brick
                console.error(`Error en mp.js ----> ${error.message}`);
            },
        },
    };
window.cardPaymentBrickController = await bricksBuilder.create(
        'cardPayment',
        'cardPaymentBrick_container',
        settings,
    );
};
renderCardPaymentBrick(bricksBuilder);
