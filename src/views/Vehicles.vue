<template>
	<div>
		<base-header type="gradient-default" class="pb-6 pb-8 pt-5 pt-md-8">
		</base-header>

		<div class="container-fluid mt--7">
			<div class="row">
				<div class="col">
                    <ul class="nav nav-tabs border-bottom-0" >
                        <li class="nav-item">
                            <router-link
                            to="/vehicles"
                            class="nav-link tab-custom-link"
                            exact-active-class="active"
                            >
                            Vehiculos
                            </router-link>
                        </li>
                        <li class="nav-item">
                            <router-link to="/vehicles/drivers" class="nav-link tab-custom-link" exact-active-class="active">
                            Chofer adr
                            </router-link>
                        </li>
                    </ul>
                    <router-view v-slot="{Component}">
                        <component classes="border-radius-top-0" :driver="true" title="Vehiculos" :is="Component"></component>
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
	};
</script>
<style></style>
