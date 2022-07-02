<template>
	<div>
		

		<div class="container-fluid mt--7">
			<div class="row">
				<div class="col">
                    <ul class="nav nav-tabs border-bottom-0" >
                        <li class="nav-item">
                            <router-link
                            to="/employees"
                            class="nav-link tab-custom-link"
                            exact-active-class="active"
                            @click="residue = 'false'"
                            >
                            Empleados
                            </router-link>
                        </li>
                        <!-- <li class="nav-item">
                            <router-link  to="/employees/formations" class="nav-link tab-custom-link disabled" exact-active-class="active" @click="residue = 'true'">
                            Formaciones
                            </router-link>
                        </li> -->
                    </ul>
                    <router-view v-slot="{Component}">
                        <component classes="border-radius-top-0" title="Empleados" :is="Component"></component>
                    </router-view>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
	export default {
		name: "tables",
		components: {
		},
        data() {
            return {
                residue: 'false'
            }
        },
	};
</script>
<style></style>
