<template>
	<q-btn-dropdown flat :menu-offset="[0,15]">
		<template v-slot:label>
			<div class="row items-center no-wrap">
				<q-avatar size="2rem" class="bg-grey-3" >
					<q-img
						fit
						:src="logo"
						spinner-color="primary"
						spinner-size="10px"
					/>
				</q-avatar>
				<div class="text-center q-ml-md flex column text-uppercase" v-if="!mobile">
					<span>{{me.full_name}}</span>
					<span class="text-muted text-left" >
						{{ $store.getters.ROLE_TRANSLATE }}
						<span v-if="$store.state.is_business">{{$store.getters['profile/profile']?.no_adr ? 'NO ADR' : 'ADR'}}</span>
					</span>
				</div>
			</div>
		</template>

		<q-list>
			<q-item clickable v-close-popup @click="onItemClick" to="/profile">
				<q-item-section avatar>
					<i class="ni ni-single-02"></i>
				</q-item-section>
				<q-item-section>
					<q-item-label>Mi perfil</q-item-label>
					<!-- <q-item-label caption>February 22, 2016</q-item-label> -->
				</q-item-section>
			</q-item>

			<q-item clickable v-close-popup @click="logout">
				<q-item-section avatar>
					<i class="ni ni-user-run"></i>
				</q-item-section>
				<q-item-section>
					<q-item-label>Logout</q-item-label>
				</q-item-section>
			</q-item>
		</q-list>
	</q-btn-dropdown>


	<!-- <ul class="navbar-nav align-items-center d-none d-lg-flex">
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
	</ul> -->
</template>
<script>
import { ref } from '@vue/reactivity';
import { useStore } from 'vuex';
import { baseUrl } from '../axios/index';
import { computed } from '@vue/runtime-core';
export default {
	props: {
		me: {
			type: Object,
		},
	},
	setup(props) {
		const store = useStore();
		const logo = ref(baseUrl + "img/dg_logo.png");
        const mobile = computed(() => window.innerWidth <= 1018)

		console.log(baseUrl);
		function logout() {
			store.dispatch("auth/logout");
		}
		return {
			logo,
			mobile,
			logout
		}
	}
};
</script>