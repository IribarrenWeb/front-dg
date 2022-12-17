// const required = val => val => !!val || 'Campo requerido'
const required = (val) => val => {
    let valid = false
    console.log(val);
    if (val === -1) {
        valid = true
    }else{
        valid = !!val
    }
    return valid || 'Campo requerido'
}

export default {
    required
};