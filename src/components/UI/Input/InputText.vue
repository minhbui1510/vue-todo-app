<script setup lang="ts">
const props = defineProps<{
  modelValue: string | number
  name?: string
  invalid?: boolean
  placeholder?: string
}>();
const emit = defineEmits<{
  (e:'update:modelValue', v:string|number):void
  (e:'blur', ev:FocusEvent):void
}>();
</script>

<template>
  <div class="ui-input" :class="{ 'is-invalid': invalid }">
    <input
      :name="name"
      :value="modelValue"
      :placeholder="placeholder"
      @input="e => emit('update:modelValue', (e.target as HTMLInputElement).value)"
      @blur="e => emit('blur', e)"
    />
    <slot name="error"/>
  </div>
</template>
