<template>
  <table class="table tablesorter" :class="`${tableClass} ${tableSize}`">
    <thead :class="theadClasses">
      <tr>
        <slot name="columns" :columns="columns">
          <th v-for="column in columns" :key="column">{{ column }}</th>
        </slot>
      </tr>
    </thead>
    <tbody v-if="!data.length >= 1" :class="tbodyClasses">
      <tr>
        <td class="text-center" :colspan="columns.length">No hay datos para mostrar</td>
      </tr>
    </tbody>
    <tbody v-else :class="tbodyClasses">
      <tr v-for="(item, index) in data" :key="index">
        <slot :item="item" :idx="index">
          <td v-for="column in columns" :key="column">
            <template v-if="hasValue(item, column)">
              {{ itemValue(item, column) }}
            </template>
          </td>
        </slot>
      </tr>
    </tbody>
  </table>
</template>
<script>
export default {
  name: "base-table",
  props: {
    columns: {
      type: Array,
      default: () => [],
      description: "Table columns",
    },
    data: {
      type: Object,
      default: () => {},
      description: "Table data",
    },
    type: {
      type: String, // striped | hover
      default: "",
      description: "Whether table is striped or hover type",
    },
    theadClasses: {
      type: String,
      default: "",
      description: "<thead> css classes",
    },
    tbodyClasses: {
      type: String,
      default: "",
      description: "<tbody> css classes",
    },
    size: {
      type: String,
      default:'sm'
    }
  },
  computed: {
    tableClass() {
      return this.type && `table-${this.type}`;
    },
    tableSize() {
      return `table-${this.size}`;
    },
    colsWithValue() {
      return (row) => {
        return this.columns.filter((column) => this.hasValue(row, column));
      };
    },
  },
  mounted() {
  },
  methods: {
    hasValue(item, column) {
      return item[column.toLowerCase()] !== "undefined";
    },
    itemValue(item, column) {
      return item[column.toLowerCase()];
    },
  },
};
</script>
<style></style>
