<template>
    <div class="q-pa-md">
        <div class="q-gutter-md">
            <div v-for="n, idx in 2" :key="idx" class="row q-gutter-md">
                <q-skeleton height="30px" class="col"/>
                <q-skeleton height="30px" class="col"/>
                <q-skeleton height="30px" class="col"/>
                <q-skeleton height="30px" class="col"/>
            </div>
            <div v-for="n, idx in 2" :key="idx" class="row q-gutter-md">
                <q-skeleton height="30px" class="col"/>
                <q-skeleton height="30px" class="col"/>
                <q-skeleton height="30px" class="col"/>
            </div>
            <div class="flex items-center justify-end">
                <q-skeleton height="50px" width="100px" class="q-mx-sm" />
                <q-skeleton  height="50px" width="100px"/>
            </div>
        </div>
    </div>
</template>