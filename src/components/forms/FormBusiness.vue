<template>
  <div>
    <form-validate @submit="onSubmit">
      <div class="row">
        <base-input formClasses="col-md-4" name="name" label="Nombre" rules="required|alpha"/>
        <base-input formClasses="col-md-4" name="last_name" label="Apellido" rules="required|alpha"/>
        <base-input formClasses="col-md-4" name="phone_number" label="Numero movil" rules="required|digits|min:5|max:15"/>
      </div>
      <base-input name="dni" label="Dni" rules="required|alpha"/>
      <base-input name="file_cer" label="Certificado" type="file" rules="required|ext:pdf"/>
      <base-input name="file_firm" label="Alta" type="file" rules="required|ext:pdf"/>
      <base-input name="date_firm" label="Fecha de alta" type="date" rules="required"/>
      <base-input name="date_cer" label="Fecha de certificado" type="date" rules="required"/>
      <base-button nativeType="submit" text="Enviar"/>
    </form-validate>
  </div>
</template>
<script>
  export default {
    name: "form-business",
    methods: {
      onSubmit(values) {
        console.log(values);
        this.$swal('SUBB')
      },
    },
  };
</script>
