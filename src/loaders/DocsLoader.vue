<template>
    <div class="q-pa-md">
        <div class="q-gutter-md">
            <div v-for="n, idx in 2" :key="idx" class="row q-gutter-md">
                <q-skeleton height="30px" class="col"/>
                <q-skeleton height="30px" class="col"/>
            </div>
            <div v-for="n, idx in 2" :key="idx" class="row q-gutter-md">
                <q-skeleton height="30px" class="col"/>
                <q-skeleton height="30px" class="col"/>
                <q-skeleton height="30px" class="col"/>
            </div>

        </div>
    </div>
</template>