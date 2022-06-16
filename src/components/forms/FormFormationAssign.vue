<template>
    <div>
        <form-validate @submit="onSubmit" v-slot="{resetForm}">
            <ul class="nav nav-pills mb-md-4 justify-content-center">
				<li class="nav-item" v-for="step in steps" :key="step.key">
					<a
						class="nav-link p-2"
						:class="[
							{ active: currentStep == step.number },
							{ disabled: !step.valid && currentStep != step.number },
						]"
						href="#"
						@click.prevent="meta.valid ? (currentStep = step.number) : ''"
					>
						<i class="fa fa-check" aria-hidden="true" v-if="step.valid"></i>
						{{ step.title }}
					</a>
				</li>
			</ul>

            <template v-if="currentStep == 1">
                <div class="row">
                    <div class="col-md-6">
                        <base-field name="installation_id" label="Instalación">
                            <field-validate
                                as="select"
                                class="form-control"
                                name="installation_id"
                                rules="required"
                                label="instalación"
                                v-model="installation_id"
                            >
                                <option
                                    v-for="installation in installations"
                                    :key="installation.key"
                                    :value="installation.id"
                                >
                                    {{ installation.name }}
                                </option>
                            </field-validate>
                        </base-field>
                    </div>
                    <div class="col-md-3">
                        <base-field name="date" label="Fecha">
							<field-validate
								name="date"
								label="fecha"
								v-model="model.date"
                                v-slot="{field}"
							>
                                <input type="date" :min="currentDate" class="form-control" v-bind="field">
                            </field-validate>
						</base-field>
                    </div>
                    <div class="col-md-3">
                        <base-field name="time" label="Hora">
							<field-validate
								type="time"
								class="form-control"
								name="time"
								label="hora"
								v-model="model.time"
							/>
						</base-field>
                    </div>
                </div>
            </template>

            <template v-if="currentStep == 2">
                <div>
                    <table class="table table-sm table-hover">
                        <thead>
                            <tr>
                                <th>Nombre</th>
                                <th>DNI</th>
                                <th>CARGO</th>
                                <th>ULTIMA FORMACIÓN</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-if="employees.length < 1">
                                <td colspan="4">No hay empleados disponibles</td>
                            </tr>
                            <tr v-for="employee in employees" :key="employee.id">
                                <td>
                                    <div class="form-check">
                                        <input class="form-check-input" type="checkbox" :value="employee.id" v-model="model.employees_ids">
                                        <label class="form-check-label" for="flexCheckDefault">
                                            {{employee.name}}
                                        </label>
                                    </div>
                                </td>
                                <td>
                                    {{employee.dni}}
                                </td>
                                <td>
                                    {{employee.position}}
                                </td>
                                <td>
                                    {{employee.last_formation == null ? 'SIN FORMACIÓN' : this.$functions.formatDate(employee.last_formation.document_date)}}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </template>

            <div class="mt-4 float-md-right">
				<base-button type="default" @click="currentStep--" :outline="true" v-if="currentStep !== 1"
					>Anterior</base-button
				>
				<base-button type="default" nativeType="submit" v-if="currentStep !== 2"
					>Siguiente</base-button
				>
				<base-button type="default" nativeType="submit" v-if="currentStep === 2"
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
import service from "@/store/services/model-service";

export default {
    props: ['formation_id'],
    data() {
        return {
            steps: [
					{
						number: 1,
						title: "Instalación",
						valid: false,
					},
					{
						number: 2,
						title: "Empleados",
						valid: false,
					},
            ],
            model: {
                employees_ids: [],
                date: "",
                time: "",
                customer_formation_id: this.formation_id,
                installation_id: null
            },
            date: "",
            time: "",
            installation_id: null,
            employees: {},
            installations: {},
            currentStep: 1,
            currentDate: "",
        }
    },
    mounted() {
        this.loadInstallations();
        this.currentDate = new Date().toISOString().split('T')[0]
    },
    methods: {
        async onSubmit(values, { resetForm }){

            if (this.currentStep == 1) {
                this.loadEmployees(this.installation_id)
                this.model.installation_id = this.installation_id
                // this.model.date += `${values.date} ${values.time}`;
            }

            if (this.currentStep == 2) {
                try {
                    await service.store('training',this.model)
    
                    this.$toast.success('Asignación registrada')
                    resetForm()
                    this.$emit('close')
                    this.$emit('reload')
                } catch (error) {
                    console.log(error);
                }
            }

            if (this.currentStep != 2) {
                this.currentStep++;
            }
        },
        async loadEmployees(id){
            try {
                const resp = await service.getIndex('employee', null, 'installation_id=' + id + '&not_formation_id='+this.formation_id + '&includes[]=last_formation');
                this.employees = resp.data.data;
            } catch (err) {
                this.model.date = ''
            }
        },
        async loadInstallations(){
            try {
                const resp = await service.getIndex('installation', null);
                this.installations = resp.data.data;
            } catch (err) {
                console.log(err.response);
                // this.$toast.error('No se pudieron cargar los tipos de vehiculos')
            }
        },
        handleClose(reset){
            reset()
            this.$emit('close')
        },
    },
    computed: {
    }
}
</script>