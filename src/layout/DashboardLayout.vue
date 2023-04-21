<template>
	<div class="wrapper" :class="{ 'nav-open': $sidebar.showSidebar }">
		<side-bar
			:background-color="sidebarBackground"
			short-title="DG"
			:me="me"
			:sidebarClasses="$route.meta.audit ? 'd-lg-none' : ''"
			title="DG SOFTWARE"
		>
			<template v-slot:links>
				<sidebar-item
					:link="{
						name: 'Dashboard',
						icon: 'ni ni-tv-2 text-default',
						path: '/dashboard',
					}"
				/>
				<sidebar-item
					v-if="role != 'business'"
					:link="{
						name: 'Empresas',
						icon: 'fa-solid fa-building-columns text-default',
						path: '/business',
					}"
				/>

                <!-- BUSINESS ROUTES -->
                <sidebar-item
					v-if="role == 'business'"
					:link="{
						name: 'Instalaciones',
						icon: 'ni ni-shop text-default',
						path: '/installations',
					}"
				/>
				<sidebar-item
					v-if="role == 'business'"
					:link="{
						name: 'Empleados',
						icon: 'fa-solid fa-briefcase text-default',
						path: '/employees',
					}"
				/>
                <sidebar-item
					v-if="role == 'business'"
					:link="{
						name: 'Mercancías',
						icon: 'fa-solid fa-atom text-default',
						path: '/materials',
					}"
				/>
                <sidebar-item
					v-if="role == 'business'"
					:link="{
						name: 'Vehiculos',
						icon: 'fa-solid fa-truck text-default',
						path: '/vehicles',
					}"
				/>
                <!-- END BUSINESS ROUTES -->

                
				<sidebar-item
					:link="{
						name: 'Auditorias',
						icon: 'fa-solid fa-clipboard-list text-default',
						path: '/audits',
					}"
				/>
				<sidebar-item
					:link="{
						name: 'Informes',
						icon: 'ni ni-book-bookmark text-default',
						path: '/informs',
					}"
				/>
				<sidebar-item
					v-if="role == 'admin'"
					:link="{
						name: 'Delegación',
						icon: 'ni ni-single-02 text-default',
						path: '/delegates',
					}"
				/>
				<sidebar-item
					v-if="role == 'admin' || role == 'delegate'"
					:link="{
						name: 'Auditores',
						icon: 'ni ni-hat-3 text-default',
						path: '/auditors',
					}"
				/>
				<sidebar-item
					v-if="role == 'delegate' || role == 'auditor'"
					:link="{
						name: 'Formaciones',
						icon: 'fa-solid fa-book-bookmark text-default',
						path: '/formations',
					}"
				/>
				<sidebar-item
					:link="{
						name: 'Visitas',
						icon: 'fa-regular fa-calendar-check text-default',
						path: '/visits',
					}"
				/>
			</template>
		</side-bar>
		<div
			class="main-content"
			:class="{ 'm-lg-0': $route.meta.audit }"
			:data="sidebarBackground"
		>
			<dashboard-navbar :me="me"></dashboard-navbar>
			<base-header type="gradient-default" :class="$route.path == '/profile' ? 'pt-4 pb-5' : 'pb-6 pt-5 pt-md-8'">
			</base-header>

			<div @click="toggleSidebar">
				<router-view v-slot="{ Component }">
					<Transition name="fade">
						<div>
							<component :is="Component"></component>
						</div>
					</Transition>
				</router-view>
				<loader v-if="$store.state.loader"></loader>
				<content-footer v-if="!$route.meta.hideFooter"></content-footer>
			</div>
		</div>
	</div>
</template>
<script>
	import DashboardNavbar from "./DashboardNavbar.vue";
	import ContentFooter from "./ContentFooter.vue";
	import { mapGetters } from "vuex";
	export default {
		components: {
			DashboardNavbar,
			ContentFooter,
		},
		data() {
			return {
				sidebarBackground: "orange", //vue|blue|orange|green|red|default,
				me: {},
			};
		},
		methods: {
			toggleSidebar() {
				if (this.$sidebar.showSidebar) {
					this.$sidebar.displaySidebar(false);
				}
			},
			handleHide(evnt) {
				console.log(evnt);
			},
		},
		async mounted() {
			console.log(this.$route.meta);
			await this.$store.dispatch("profile/me");
			await this.$store.dispatch("getNotifications");
			this.me = await this.$store.getters["profile/me"];
		},
		computed: {
			...mapGetters({
				role: "ROLE",
			}),
		},
	};
</script>
<style lang="scss"></style>
