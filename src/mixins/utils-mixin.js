import documentService from "../store/services/document-service";
import dataService from "../store/services/data-service";

export default {
    data() {
        return {
            isLoading: false,
            cities: {},
            provinces: {},
            loader: false,
        };
    },
    methods: {
        /* extract API server validation errors and assigns them to local mixin data */
        async getDocument(id) {
            this.loader = true;
            try {
                const response = await documentService.getDocument(id);
                console.log(response.data);
                if (response.status == 200) {
                    var byteCharacters = atob(response.data.data);
                    var byteNumbers = new Array(byteCharacters.length);
                    for (var i = 0; i < byteCharacters.length; i++) {
                        byteNumbers[i] = byteCharacters.charCodeAt(i);
                    }
                    var byteArray = new Uint8Array(byteNumbers);
                    var file = new Blob([byteArray], {
                        type: "application/pdf;base64",
                    });
                    var fileURL = URL.createObjectURL(file);
                    window.open(fileURL);
                }
            } catch (err) {
                this.$swal("Error", "Error al cargar el documento", "error");
                console.log(err);
            }
            this.loader = false;
        },

        async getCities() {
            this.loader = true;
            try {
                const response = await dataService.getCities();
                this.cities = response.data.data;
            } catch (err) {
                this.$swal("Error", "Error al cargar las ciudades", "error");
                console.log(err);
            }
            this.loader = false;
        },
        async getProvinces($evnt) {
            this.loader = true;
            try {
                const response = await dataService.getProvinces("city_id=" + $evnt);
                this.provinces = response.data.data;
            } catch (error) {
                this.$swal("Error", "Error al cargar las provincias", "error");
            }
            this.loader = false;
        },
        formatDate(date) {
            return new Date(date).toLocaleDateString("en-GB");
        },
    },
};