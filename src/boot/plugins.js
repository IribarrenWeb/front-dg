import { createToaster } from '@meforma/vue-toaster';
import Swal from 'sweetalert2'
import "sweetalert2/dist/sweetalert2.min.css";

const toast = createToaster({
    maxToasts: 1,
    queue: true, 
});

const swal = Swal.mixin({
    customClass: {
        confirmButton: 'btn btn-primary',
        cancelButton: 'btn btn-outline-primary'
    },
    buttonsStyling: false,
    cancelButtonText: "Cancelar"
})

export {
    swal,
    toast
}