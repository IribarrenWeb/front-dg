<template>
    <div class="border border-light mb-md-5 mb-1 rounded">
        <base-table thead-classes="thead-light" :data="tableData">
            <template v-slot:columns>
                <th>Total de empleados</th>
                <th>Empleados ADR</th>
                <th>Valor de seguridad</th>
                <th></th>
            </template>
            <template v-slot:default="row">
                <th scope="row">
                    {{ row.item.total }}
                </th>
                <td scope="row" class="text-uppercase">
                    {{ row.item.adr }}
                </td>
                <td colspan="2">
                    {{ row.item.security }}
                </td>
            </template>
        </base-table>
    </div>
</template>
<script>
import service from "@/store/services/model-service";
export default {
    name: "dashboard-employee",
    props:['id','reload'],
    data() {
        return {
            tableData: [
                {
                    total: '0',
                    adr: '0',
                    security: 0
                }
            ]
        }
    },
    mounted(){
        this.index()
    },
    methods: {
        async index(){
            try {
                const res = await service.dashEmployee(this.id);
                let data = res.data.data
                this.tableData[0].total = data.total >= 1 ? data.total : '0'; 
                this.tableData[0].adr = data.adr >= 1 ? data.adr : '0';
                this.tableData[0].security = data.security;
                this.$emit('reloaded');
            } catch (err) {
                console.log(err);
            }
        }
    },
    watch: {
        reload(newVal){
            if (newVal) {
                this.index()
            }
        }
    }
}
</script>