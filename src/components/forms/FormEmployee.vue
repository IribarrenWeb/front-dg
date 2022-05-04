<template>
    <div>
        <div>
            <div class="col-md-4">
                <base-field label="Nombre">
                    <field-validate type="text" class="form-control" name="name" rules="required" label="Nombre" v-model="model.responsible.name"/>
                    <error-message-validate class="invalid-feedback d-block" name="name"/>
                </base-field>
            </div>

            <div class="col-md-4">
                <base-field label="Apellido">
                    <field-validate type="text" class="form-control" name="last_name" rules="required" label="apellido" v-model="model.responsible.last_name"/>
                    <error-message-validate class="invalid-feedback d-block" name="last_name"/>
                </base-field>
            </div>

            <div class="col-md-4">
                <base-field label="Dni">
                    <field-validate type="number" class="form-control" name="dni" rules="required" label="dni" v-model="model.responsible.dni"/>
                    <error-message-validate class="invalid-feedback d-block" name="dni"/>
                </base-field>
            </div>

            <div class="col-md-4">
                <base-field label="Email">
                    <field-validate type="text" class="form-control" name="email" rules="required" label="email" v-model="model.responsible.email"/>
                    <error-message-validate class="invalid-feedback d-block" name="email"/>
                </base-field>
            </div>

            <div class="col-md-4">
                <base-field label="Posicion">
                    <field-validate type="text" class="form-control" name="position" rules="required" label="posicion" v-model="model.responsible.position"/>
                    <error-message-validate class="invalid-feedback d-block" name="position"/>
                </base-field>
            </div>

            <div class="col-md-4">
                <base-field label="Movil">
                    <field-validate type="number" class="form-control" name="phone_number" rules="required" label="movil" v-model="model.responsible.phone_number"/>
                    <error-message-validate class="invalid-feedback d-block" name="phone_number"/>
                </base-field>
            </div>

            <div class="col-md-4">
                <base-field label="Fecha de formacion">
                    <field-validate type="date" class="form-control" name="date_cer" rules="required" label="fecha" v-model="model.responsible.date_certification"/>
                    <error-message-validate class="invalid-feedback d-block" name="date_cer"/>
                </base-field>
            </div>

            <div class="col-md-4">
                <base-field label="Documento de formacion">
                    <field-validate type="text" class="form-control" name="file_cer" rules="required" label="documento" v-model="model.responsible.file_certification.file"/>
                    <error-message-validate class="invalid-feedback d-block" name="file_cer"/>
                </base-field>
            </div>

            <div class="col-md-4">
                <base-field label="Conductor adr">
                    <field-validate type="text" class="form-control" name="driver" rules="required" label="condutor" v-model="model.responsible.driver" v-slot="{ field }">
                        <base-switch
                            v-bind="field"
                        ></base-switch>
                    </field-validate>
                    <error-message-validate class="invalid-feedback d-block" name="driver"/>
                </base-field>
            </div>
            <div class="col-md-4">
                <base-field label="Materiales peligrosos">
                    <field-validate type="text" class="form-control" name="driver" rules="required" label="materiales peligrosos" v-model="model.responsible.dangerous_goods" v-slot="{ field }">
                        <base-switch v-bind="field"
                        ></base-switch>
                    </field-validate>
                    <error-message-validate class="invalid-feedback d-block" name="driver"/>
                </base-field>
            </div>
        </div>
    </div>
</template>

<script>
export default {
   props:{
       responsible: {
           type: Object,
           required: true
       }
    },
}
</script>