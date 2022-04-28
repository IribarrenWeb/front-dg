export default {
    data() {
        return {
            isLoading: false,
            apiValidationErrors: {},
        };
    },
    methods: {
        /* extract API server validation errors and assigns them to local mixin data */
        setApiValidation(serverErrors) {
            let errors = {};
            Object.keys(serverErrors).forEach((element) => {
                errors[element] = serverErrors[element];
                // errors[element] = reduce(serverErrors[element], function(target, key, index) {
                //     target[index] = key;
                //     return target;
                // });
            });

            this.apiValidationErrors = errors;
        },

        resetApiValidation() {
            this.apiValidationErrors = {};
        },
    },
};