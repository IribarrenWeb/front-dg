<template>
	<base-nav class="navbar-top navbar-dark" id="navbar-main" :show-toggle-button="false" expand
		:containerClasses="$route.meta.audit ? 'container' : 'container-fluid'">
		<form class="navbar-search navbar-search-dark form-inline mr-3 d-none d-md-flex ml-lg-auto">
			<div class="form-group mb-0">
				<!-- <base-input placeholder="Search" class="input-group-alternative" alternative=""
          addon-right-icon="fas fa-search">
        </base-input> -->
			</div>
		</form>
		<ul class="navbar-nav align-items-center d-none d-lg-flex">
			<li class="nav-item dropdown">
				<base-dropdown class="nav-link pr-0" position="right">
					<template v-slot:title>
						<div class="media align-items-center">
							<span class="avatar avatar-sm rounded-circle">
								<img :src="logo" class="navbar-brand-img" alt="dgsoft_logo" />
							</span>
							<div class="media-body ml-2 d-none d-lg-block">
								<span class="mb-0 text-sm font-weight-bold">{{ me.full_name }}</span>
							</div>
						</div>
					</template>
					<div class="dropdown-header noti-title">
						<h6 class="text-overflow m-0">Bienvenido!</h6>
					</div>
					<router-link to="/profile" class="dropdown-item">
						<i class="ni ni-single-02"></i>
						<span>Mi perfil</span>
					</router-link>
					<div class="dropdown-divider"></div>
					<a @click.prevent="logout()" class="dropdown-item">
						<i class="ni ni-user-run"></i>
						<span>Logout</span>
					</a>
				</base-dropdown>
			</li>
		</ul>
	</base-nav>
</template>
<script>
import { baseUrl } from '../axios/index';
import Notifications from '../components/Notifications.vue';
export default {
	components: { Notifications },
	data() {
		return {
			activeNotifications: false,
			showMenu: false,
			searchQuery: "",
		};
	},
	props: {
		me: {
			type: Object,
			default() {
				return { name: 'Username', last_name: 'Last name' }
			}
		},
		audit: {
			type: Boolean,
			default: false
		},
		logo: {
			type: String,
			default: baseUrl + "img/dg_logo.png",
			description: "Sidebar app logo",
		},
	},
	methods: {
		toggleSidebar() {
			this.$sidebar.displaySidebar(!this.$sidebar.showSidebar);
		},
		hideSidebar() {
			this.$sidebar.displaySidebar(false);
		},
		toggleMenu() {
			this.showMenu = !this.showMenu;
		},
		logout() {
			this.$store.dispatch("auth/logout");
		}
	},
};
</script>