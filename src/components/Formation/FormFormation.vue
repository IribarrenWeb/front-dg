<template>
    <div>
        <FormLoader v-if="!model?.hasOwnProperty('duration')" />
        <form-validate ref="form" v-else @submit="onSubmit" v-slot="{ resetForm }">
            <div class="row border rounded border-light px-3 py-2">
                <div class=" col-lg-3">
                    <base-field name="name" label="Nombre">
                        <field-validate type="text" class="form-control text-uppercase" name="name" rules="required"
                            label="nombre" v-model="model.name" />
                    </base-field>
                </div>
                <div class=" col-lg-3">
                    <base-field name="formation_type_id" label="Modalidad">
                        <field-validate as="select" class="form-control" name="formation_type_id" rules="required"
                            label="Modalidad" v-model="model.formation_type_id">
                            <option :value="type.id" v-for="type, idx in types" :key="idx">{{ type.name }}</option>
                        </field-validate>
                    </base-field>
                </div>
                <div class="col-lg-3">
                    <base-field name="duration" label="Duración">
                        <field-validate type="text" class="form-control text-uppercase" name="duration" rules="required"
                            label="Duración" v-model="model.duration" />
                    </base-field>
                </div>
                <div class=" col-lg-3" v-if="!$store.state.is_auditor">
                    <base-field name="auditor_id" label="Responsable">
                        <field-validate name="auditor_id" label="Responsable" rules="required"
                            v-model="model.facilitable_id">
                            <async-select :roles="[2, 3]" @selected="auditable = $event"
                                :value="formation?.facilitable_data?.value?.id" :list="true">
                            </async-select>
                        </field-validate>
                    </base-field>
                </div>
                <div
                    :class="{ 'col-lg-10': model.documents.length >= 3, 'col-lg-6': model.documents.length <= 1, 'col-lg-8': model.documents.length == 2 }">
                    <base-field name="document" label="Documentos de formación">
                        <div class="row">
                            <div class="col row q-gutter-sm" v-if="model.documents && !addFile">
                                <div class="col" v-for="document, idx in model.documents" :key="idx">
                                    <q-item clickable style="max-width: 400px;">
                                        <q-item-section top avatar>
                                            <q-icon size="2rem" color="primary" name="fa-regular fa-file-pdf" />
                                        </q-item-section>
                                        <q-item-section @click="open(document?.public_url)">
                                            <q-item-label>{{ document.name_document }}</q-item-label>
                                            <q-item-label caption lines="2" v-if="document?.size">{{ document.size /
                                                    1000
                                            }}
                                                KB</q-item-label>
                                        </q-item-section>
                                        <q-item-section side>
                                            <q-btn :loading="loading" color="primary" icon="fa-solid fa-xmark" flat
                                                @click="remove(document)" />
                                        </q-item-section>
                                    </q-item>
                                </div>
                            </div>
                            <div class="col" v-else>
                                <div v-if="addFile || !model.documents">
                                    <!-- <q-separator spaced="1rem" v-if="model.documents?.length >= 1" /> -->
                                    <div class="flex">
                                        <q-file :loading="loading" counter :max-files="available_files_upload"
                                            class="col q-mt-sm" v-model="new_documents" outlined use-chips multiple
                                            accept=".pdf">
                                            <template v-slot:prepend>
                                                <q-icon name="attach_file" />
                                            </template>
                                        </q-file>
                                        <div v-if="new_documents?.length >= 1 && addFile" class="col-2 flex column q-mt-lg">
                                            <q-btn flat dense color="primary"
                                                 icon="fa-solid fa-upload"
                                                @click="submit_btn.click()">
                                                <q-tooltip>
                                                    Subir Archivos
                                                </q-tooltip>
                                            </q-btn>
                                        </div>
                                    </div>
                                    <field-validate class="form-control" v-show="false" type="file" name="document"
                                        :rules="{ 'required': !update || model.documents < 1, ext: ['pdf'] }"
                                        label="documento de formación" v-model="new_documents" />
                                </div>
                            </div>
                            <div class="flex justify-start"
                                :class="{ 'col': model.documents.length <= 1, 'col-lg-2': model.documents.length >= 2 }">
                                <q-btn :loading="loading" color="primary"
                                    v-if="update && (available_files_upload > 0 || (available_files_upload == 0 && addFile))"
                                    flat :icon="!addFile ? 'fa-solid fa-plus' : 'fa-solid fa-ban'"
                                    @click="addFile = !addFile">
                                    <q-tooltip>
                                        {{ !addFile ? 'Agregar documento' : 'Cancelar' }}
                                    </q-tooltip>
                                </q-btn>
                            </div>
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
                <base-button type="default" nativeType="submit" v-if="update && canUpdate" ref="submit_btn">Actualizar
                </base-button>
                <base-button type="default" :outline="true" class="ml-auto" @click="handleClose(resetForm)">Cancelar
                </base-button>
            </div>

        </form-validate>
    </div>
</template>

<script>
import dataService from "../../store/services/data-service";
import service from "../../store/services/model-service";
import AsyncSelect from '../core_components/AsyncSelect.vue';
import functions from '../../utils/functions'
import { ref } from '@vue/reactivity';
import { useStore } from 'vuex';
import { toast } from '../../boot/plugins';
import { isEmpty } from "lodash";
import { computed, onBeforeMount, watch } from '@vue/runtime-core';
import FormLoader from '../../loaders/FormLoader.vue'
import { useQuasar } from 'quasar';

export default {
    components: {
        AsyncSelect,
        FormLoader
    },
    props: ['formation_id'],
    setup(props, { emit }) {
        const store = useStore();
        const model = ref({});
        const types = ref({});
        const originalModel = ref(null);
        const auditable = ref(null);
        const formation = ref(null);
        const document_url = ref(null);
        const new_documents = ref([]);
        const total_files = computed(() => (model.value?.documents?.length + new_documents.value?.length) ?? 0)
        const available_files_upload = computed(() => 3 - total_files.value)
        const update = computed(() => {
            return props.formation_id != null;
        })
        const addFile = ref(false)
        const loading = ref(false)
        const $q = useQuasar()
        const canUpdate = computed(() => {
            let valid = false
            if (addFile.value && new_documents.value?.length >= 1) valid = true
            else if (model.value.hasOwnProperty('duration') && update.value && originalModel.value) valid = !isEmpty(functions.difference(originalModel.value, model.value))
            return valid
        })
        const model_documents = computed(() => model.value?.documents)

        onBeforeMount(() => {
            model.value = functions.schemas('formation')
        })

        async function onSubmit(values, { resetForm }) {
            try {
                let data = new FormData()
                loading.value = true
                if (update.value) {
                    let data = functions.difference(originalModel.value, model.value);
                    data = functions.toFormData(data, ['facilitable_id']);
                    if (new_documents.value) {
                        new_documents.value.forEach(document => {
                            data.append('documents[]', document)
                        });
                    }
                    if (!store.state.is_auditor && auditable.value != null) {
                        data.append('facilitable_id', auditable.value.id)
                    }
                    await service.update('formation', props.formation_id, data, true)
                    toast.success('Formación actualizada')
                    getFormation()
                } else {
                    new_documents.value.forEach(document => {
                        data.append('documents[]', document)
                    });

                    data.append('name', model.value.name)
                    data.append('content', model.value.content)

                    if (!store.state.is_auditor) {
                        data.append('facilitable_id', auditable.value.id)
                    }
                    data.append('duration', model.value.duration)
                    data.append('formation_type_id', model.value.formation_type_id)
                    console.log(data);
                    await service.store('formation', data, true)

                    toast.success('Formación registrada')
                    resetForm()
                    emit('close')
                }
                loading.value = false

                emit('reload')
            } catch (error) {
                loading.value = false
                console.log(error);
            }

        }

        async function loadTypes() {
            try {
                const resp = await dataService.getFormationTypes();
                types.value = resp.data.data;
            } catch (err) {
                console.log(err.response);
                // toast.error('No se pudieron cargar los tipos de vehiculos')
            }
        }

        function handleClose(reset) {
            reset()
            emit('close')
        }

        async function getFormation() {
            try {
                const resp = await service.show('formation', props.formation_id);
                formation.value = resp.data.data;
                setModel()
            } catch (err) {
                console.log(err.response);
                // toast.error('No se pudieron cargar los tipos de vehiculos')
            }
        }


        function setModel() {
            model.value = functions.assignSchema('formation', formation.value)
            // model.value.name = formation.value.name;
            // model.value.formation_type_id = formation.value.formation_type_id;
            // model.value.facilitable_id = formation.value.facilitable.user.id;
            // model.value.duration = formation.value.duration;
            // model.value.content = formation.value.content;
            originalModel.value = functions.copy(model.value);
            new_documents.value = []
            addFile.value = false
        }

        function open(url) {
            window.open(url, '_blank').focus();
        }

        function remove(document) {
            try {
                $q.dialog({
                    title: 'Eliminar archivo',
                    message: '¿Esta seguro de eliminar este archivo?',
                    cancel: true,
                    persistent: true,
                }).onOk(async () => {
                    loading.value = true
                    await service.apiNoLoading({ url: 'documents/' + document.id, method: 'DELETE' })
                    loading.value = false
                    getFormation()
                })
            } catch (err) {
                $q.notify({
                    message: 'No se pudo eliminar',
                    color: 'negative'
                })
            }
        }

        loadTypes()

        watch(() => auditable.value, (v) => {
            model.value.facilitable_id = v.id ?? null
        })

        watch(() => addFile.value, (v) => {
            if (!v) {
                new_documents.value = []
            }
        })

        watch(() => update.value, (v) => {
            if (v) {
                getFormation();
            }
        }, { immediate: true })

        return {
            model,
            types,
            originalModel,
            auditable,
            formation,
            canUpdate,
            update,
            document_url,
            model_documents,
            new_documents,
            addFile,
            loading,
            submit_btn: ref(null),
            available_files_upload,
            total_files,
            handleClose,
            onSubmit,
            getFormation,
            loadTypes,
            open,
            remove
        }
    }
}
</script>