<template>
    <div>
        <form-validate @submit="onSubmit" v-slot="{resetForm}">
            <div class="row border rounded border-light px-3 py-2">
                <div class=" col-lg-4">
                    <base-field   name="name" label="Nombre">
                        <field-validate type="text" class="form-control text-uppercase" name="name" rules="required" label="nombre" v-model="model.name"/>
                    </base-field>
                </div>
                <div class=" col-lg-4">
                    <base-field   name="formation_type_id" label="Modalidad">
                        <field-validate as="select" class="form-control" name="formation_type_id" rules="required" label="Modalidad" v-model="model.formation_type_id">
                            <option v-for="type in types" :key="type.key" :value="type.id">
                                {{type.name}}
                            </option>
                        </field-validate>
                    </base-field>
                </div>
                <div class=" col-lg-4">
                    <base-field   name="duration" label="Duración">
                        <field-validate type="number" class="form-control" name="duration" rules="required|min:1|max:2" label="Duración" v-model="model.duration"/>
                    </base-field>
                </div>
                <div class=" col-lg-6">
                   <base-field name="responsible" label="Responsable">
                        <field-validate  name="responsible" label="Responsable" v-slot="{ field }" v-model="model.auditable">
                            <Multiselect
                                :searchable="true"
                                v-bind="field"
                                :min-chars="2"
                                :delay="500"
                                :required="true"
                                :options="getUsers"
                                ref="multiselect"
                                @select="auditable = $event"
                                
                                :resolve-on-load="false"
                            >
                            </Multiselect>
                        </field-validate>
                   </base-field>
                </div>
                <div class="col-lg-6">
                    <base-field   name="document" label="Documento de formación">
                        <!-- <div v-if="cert_document && !cer_update">
                            <a href="#" @click.prevent="getDocument(cert_document.id)" class="mr-md-4">{{cert_document.type.name}}</a>
                            <base-button @click="cer_update = true" size="sm" type="default" :outline="true"><i class="fa-solid fa-pencil"></i></base-button>
                        </div> -->
                        <div>
                            <field-validate class="form-control"  type="file" name="document" rules="required|ext:pdf" label="documento de formación" v-model="model.document"/>
                            <!-- <base-button v-if="update && !typeof auditor.documents[0] == undefined" @click="reset('file_cer')" size="sm" type="default" :outline="true"><i class="fa-solid fa-rotate-left"></i></base-button> -->
                        </div>
                    </base-field>
                </div>
                <div class=" col-lg-12">
                    <base-field name="content" label="Contenido">
                        <textarea cols="30" rows="10" class="form-control" v-model="model.content"></textarea>
                    </base-field>
                </div>
            </div>

            <div class="mt-4 float-md-right">
                <base-button type="default" nativeType="submit"
                >Enviar</base-button
                >
                <base-button
                    type="default"
                    :outline="true"
                    class="ml-auto"
                    @click="handleClose(resetForm)"
                    >Cancelar
                </base-button>
            </div>
            
        </form-validate>
    </div>
</template>

<script>
import dataService from "../../store/services/data-service";
import service from "@/store/services/model-service";
import Multiselect from "@vueform/multiselect";

export default {
    components: {
        Multiselect
    },
    data() {
        return {
            model: this.$store.getters.FORMATION_SCHEMA,
            types: {},
            auditable: null
        }
    },
    mounted() {
        this.loadTypes();
    },
    methods: {
        async onSubmit(values, { resetForm }){
            try {
                let data =  new FormData()
                data.append('document', this.model.document[0])
                data.append('name', this.model.name)
                data.append('content', this.model.content)
                data.append('auditor_id', this.auditable.id)
                data.append('duration', this.model.duration)
                data.append('formation_type_id', this.model.formation_type_id)

                await service.store('formation',data, true)

                this.$toast.success('Formación registrada')
                resetForm()
                this.$emit('close')
                this.$emit('reload')
            } catch (error) {
                console.log(error);
            }
           
        },
        async loadTypes(){
            try {
                const resp = await dataService.getFormationTypes();
                this.types = resp.data.data;
            } catch (err) {
                console.log(err.response);
                // this.$toast.error('No se pudieron cargar los tipos de vehiculos')
            }
        },
        getUsers(query){
            return this.$store.dispatch('users', {query: query, roles: [2,3]})
        },
        handleClose(reset){
            reset()
            this.$emit('close')
        }
    },
}
</script>