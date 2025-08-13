<script setup lang="ts">

import {Field, Form} from "vee-validate";
import InputText from "@/components/UI/Input/InputText.vue";
import {watch} from "vue";
import * as yup from 'yup';
const schema = yup.object({
  search: yup.string().required("null")
})
</script>

<template>
  <div class="col-12 flex">
    <div class="col-3">
      Logo
    </div>
    <div class="col-9">
      search component
      <Form @submit="vals => console.log(vals)" :validation-schema="schema">
      <Field name="search" v-slot="{field, errorMessage, meta}">
        <InputText
          :name="field.name"
          :modelValue="field.value"
          @update:modelValue="field.onChange"
          @blur="field.onBlur"
          :invalid="!!errorMessage && meta.touched"
          placeholder="Nhập tiêu đề"
        >
          <template #error>
            <small v-if="meta.touched && errorMessage" class="err">{{ errorMessage }}</small>
          </template>
        </InputText>
      </Field>
        <button type="submit">Lưu</button>
      </Form>
    </div>
  </div>
</template>

<style scoped>

</style>
