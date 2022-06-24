<template>
    <div class="row border border-light rounded p-2">
        <div class="col-12">
            <h4>Datos bancarios</h4>
        </div>
        <div class="col-lg-4">
            <base-field name="holder_name" label="Nombre del titular">
                <field-validate type="text" class="form-control" name="holder_name" rules="alpha_spaces"
                    label="nombre" v-model="model.holder_name" />
            </base-field>
        </div>
        <div class="col-lg-4">
            <base-field name="bank_code" label="BIC/SWIFT">
                <field-validate type="text" class="form-control text-uppercase" name="bank_code"
                    rules="min:11|max:11|alpha_num" label="BIC/SWIFT" v-model="model.bank_code" />
            </base-field>
        </div>
        <div class="col-lg-4">
            <base-field name="iban_number" label="IBAN">
                <field-validate type="text" class="form-control" name="iban_number" rules="min:24|max:24|alpha_num"
                    label="numero iban" v-model="model.iban_number" />
            </base-field>
        </div>
    </div>
</template>

<script>
export default {
    props: {

    },
    setup() {
        
        return {

        }
    }
}
</script>