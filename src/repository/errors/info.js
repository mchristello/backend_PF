export const generateInputError = (input) => {
    return `Ha ocurrido un problema con los datos ingresados:
            - ${input} no es válido, por fabor chequee e ingreselo de nuevo.`
}

export const generateGeneralError = () => {
    return `Ups! Ha ocurrido un problema inesperado!:`
}

export const generateNotFoundError = (searched) => {
    return `Ha habido un problema tratando de encontrar lo que has solicitado:
            - ${searched.id ? searched.id : searched.email} no ha sido encontrado.`
}

export const generateNoStockError = (pid, qty) => {
    return `Ha habido un problema tratando de el producto al carrito:
            - El priducto ${pid} solo dispone de este stock: ${qty}.`
}

export const generateNoLoggedUser = () => {
    return `No se ha detectado ninguna sesión activa. Por favor logueate para poder acceder a tu información.`
}

export const generateAuthenticationError = (user) => {
    return `Ocurrió un problema en el login:
            - ${user.email}, las credenciales no son correctas, por favor revise y vuelva a ingresarlas..`
}

export const generateSutorizationError = (user) => {
    return `Ha ocurrido un problema al de permisos:
            - ${user.email} no dispone de los permisos para el endpoint solicitado.`
}