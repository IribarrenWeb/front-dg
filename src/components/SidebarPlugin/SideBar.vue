<template>
	<nav :class="`navbar navbar-vertical fixed-left navbar-expand-lg navbar-light bg-white ${sidebarClasses}`"
		id="sidenav-main">
		<div class="container-fluid">
			<!--Toggler-->
			<navbar-toggle-button @click="showSidebar">
				<span class="navbar-toggler-icon"></span>
			</navbar-toggle-button>
			<router-link class="navbar-brand" to="/">
				<img :src="logo" class="navbar-brand-img" alt="dgsoft_logo" />
			</router-link>

			<slot name="mobile-right">

				<ul class="nav align-items-center d-lg-none">
					<!-- Notifications -->
					<notifications v-if="isMovil" :dark="true"></notifications>

					<!-- End notifications -->


					<base-dropdown class="nav-item" position="right">
						<template v-slot:title>
							<a class="nav-link" href="#" role="button">
								<div class="media align-items-center">
									<span class="avatar avatar-sm rounded-circle">
										<img alt="Image placeholder" :src="logo" />
									</span>
								</div>
							</a>
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
				</ul>

			</slot>

			<slot></slot>

			<div v-show="$sidebar.showSidebar" class="navbar-collapse collapse show" id="sidenav-collapse-main">
				<div class="navbar-collapse-header d-md-none">
					<div class="row">
						<div class="col-6 collapse-brand">
							<router-link to="/">
								<img :src="logo" />
							</router-link>
						</div>
						<div class="col-6 collapse-close">
							<navbar-toggle-button @click="closeSidebar"></navbar-toggle-button>
						</div>
					</div>
				</div>

				<ul class="navbar-nav">
					<slot name="links"> </slot>
				</ul>
				<!--Divider-->
				<hr class="my-3" />
				<!--Heading-->
				<!-- <h6 class="navbar-heading text-muted">Documentation</h6> -->
				<!--Navigation-->
				<!-- <ul class="navbar-nav mb-md-3">
          <li class="nav-item">
            <a
              class="nav-link"
              href="https://demos.creative-tim.com/vue-argon-dashboard/documentation"
            >
              <i class="ni ni-spaceship"></i> Getting started
            </a>
          </li>
          <li class="nav-item">
            <a
              class="nav-link"
              href="https://demos.creative-tim.com/vue-argon-dashboard/documentation/foundation/colors.html"
            >
              <i class="ni ni-palette"></i> Foundation
            </a>
          </li>
          <li class="nav-item">
            <a
              class="nav-link"
              href="https://demos.creative-tim.com/vue-argon-dashboard/documentation/components/alerts.html"
            >
              <i class="ni ni-ui-04"></i> Components
            </a>
          </li>
        </ul> -->
			</div>
		</div>
	</nav>
</template>
<script>
import NavbarToggleButton from "@/components/NavbarToggleButton";
import Notifications from '../Notifications.vue';

export default {
	name: "sidebar",
	components: {
		NavbarToggleButton,
		Notifications,
	},
	props: {
		logo: {
			type: String,
			default: process.env.VUE_APP_API_URL + "img/dg_logo.png",
			description: "Sidebar app logo",
		},
		autoClose: {
			type: Boolean,
			default: true,
			description:
				"Whether sidebar should autoclose on mobile when clicking an item",
		},
		sidebarClasses: {
			type: String,
			required: false
		}
	},
	provide() {
		return {
			autoClose: this.autoClose,
		};
	},
	computed: {
		isMovil(){
			return this.$store.state.is_mobile
		}
	},	
	methods: {
		closeSidebar() {
			this.$sidebar.displaySidebar(false);
		},
		showSidebar() {
			this.$sidebar.displaySidebar(true);
		},
		logout() {
			this.$store.dispatch("auth/logout");
		}
	},
	beforeUnmount() {
		if (this.$sidebar.showSidebar) {
			this.$sidebar.showSidebar = false;
		}
	},
};
</script>
