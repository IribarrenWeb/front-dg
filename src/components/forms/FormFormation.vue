<template>
    <div>
        <form-validate @submit="onSubmit" v-slot="{ resetForm }">
            <div class="row border rounded border-light px-3 py-2">
                <div class=" col-lg-4">
                    <base-field name="name" label="Nombre">
                        <field-validate type="text" class="form-control text-uppercase" name="name" rules="required"
                            label="nombre" v-model="model.name" />
                    </base-field>
                </div>
                <div class=" col-lg-4">
                    <base-field name="formation_type_id" label="Modalidad">
                        <field-validate as="select" class="form-control" name="formation_type_id" rules="required"
                            label="Modalidad" v-model="model.formation_type_id">
                            <option v-for="type in types" :key="type.key" :value="type.id">
                                {{ type.name }}
                            </option>

                        </field-validate>
                    </base-field>
                </div>
                <div class="col-lg-4">
                    <base-field name="duration" label="Duración">
                        <field-validate type="text" class="form-control text-uppercase" name="duration" rules="required"
                            label="Duración" v-model="model.duration" />
                    </base-field>
                </div>
                <div class=" col-lg-6" v-if="!$store.state.is_auditor">
                    <base-field name="auditor_id" label="Responsable">
                        <field-validate name="auditor_id" label="Responsable" rules="required" v-model="model.facilitable_id">
                            <async-select :roles="[2,3]" @selected="auditable = $event" :value="formation?.facilitable_data" :list="true">
                            </async-select>
                        </field-validate>
                    </base-field>
                </div>
                <div class="col-lg-6" v-if="!update">
                    <base-field name="document" label="Documento de formación">
                        <!-- <div v-if="cert_document && !cer_update">
                            <a href="#" @click.prevent="getDocument(cert_document.id)" class="mr-md-4">{{cert_document.type.name}}</a>
                            <base-button @click="cer_update = true" size="sm" type="default" :outline="true"><i class="fa-solid fa-pencil"></i></base-button>
                        </div> -->
                        <div>
                            <field-validate class="form-control" type="file" name="document" rules="required|ext:pdf"
                                label="documento de formación" v-model="model.document" />
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
                <base-button type="default" nativeType="submit" v-if="!update">Aceptar</base-button>
                <base-button type="default" nativeType="submit" v-if="update && canUpdate">Actualizar</base-button>
                <base-button type="default" :outline="true" class="ml-auto" @click="handleClose(resetForm)">Cancelar
                </base-button>
            </div>

        </form-validate>
    </div>
</template>

<script>
import dataService from "../../store/services/data-service";
import service from "@/store/services/model-service";
import AsyncSelect from '../AsyncSelect.vue';

export default {
    components: {
        AsyncSelect
    },
    props: ['formation_id'],
    data() {
        return {
            model: this.$functions.schemas('formation'),
            types: {},
            originalModel: null,
            auditable: null,
            formation: null
        }
    },
    mounted() {
        this.loadTypes();
    },
    methods: {
        async onSubmit(values, { resetForm }) {
            try {
                let data = new FormData()
                if (this.update) {
                    let data = this.$functions.difference(this.originalModel,this.model);
                    data = this.$functions.toFormData(data, ['facilitable_id']);
                    if (!this.$store.state.is_auditor && this.auditable != null ) {
                        data.append('facilitable_id', this.auditable.id)
                    }
                    await service.update('formation',this.formation_id, data, true)
                    this.$toast.success('Formación actualizada')
                }else{
                    data.append('document', this.model.document[0])
                    data.append('name', this.model.name)
                    data.append('content', this.model.content)

                    if (!this.$store.state.is_auditor) {
                        data.append('facilitable_id', this.auditable.id)
                    }
                    data.append('duration', this.model.duration)
                    data.append('formation_type_id', this.model.formation_type_id)

                    await service.store('formation', data, true)

                    this.$toast.success('Formación registrada')
                    resetForm()
                    this.$emit('close')
                }
                this.$emit('reload')
            } catch (error) {
                console.log(error);
            }

        },
        async loadTypes() {
            try {
                const resp = await dataService.getFormationTypes();
                this.types = resp.data.data;
            } catch (err) {
                console.log(err.response);
                // this.$toast.error('No se pudieron cargar los tipos de vehiculos')
            }
        },
        handleClose(reset) {
            reset()
            this.$emit('close')
        },
        async getFormation(){
            try {
                const resp = await service.show('formation',this.formation_id);
                this.formation = resp.data.data;
                this.setModel()
            } catch (err) {
                console.log(err.response);
                // this.$toast.error('No se pudieron cargar los tipos de vehiculos')
            }
        },
        setModel(){
            this.model.name = this.formation.name;
            this.model.formation_type_id = this.formation.formation_type_id;
            this.model.facilitable_id = this.formation.facilitable.user.id;
            this.model.duration = this.formation.duration;
            this.model.content = this.formation.content;
            this.originalModel = this.$functions.copy(this.model);
        }
    },
    watch: {
        auditable(val){
            this.model.facilitable_id = val.id ?? null
        },
        update: {
            handler(val) {
                if (val) {
                    this.getFormation();
                }
            },
            immediate: true
        }
    },
    computed: {
        update(){
            return this.formation_id != null;
        },
        canUpdate() {
            return !this.$empty(this.$functions.difference(this.originalModel,this.model))
        }
    }
}
</script>