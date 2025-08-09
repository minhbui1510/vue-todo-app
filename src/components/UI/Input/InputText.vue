<script setup>
const props = defineProps({
  modelValue: String,
  name: String,
  placeholder: String,
  error: String,
  onInput: Function,
  onBlur: Function
});

const emit = defineEmits(['update:modelValue']);
</script>

<template>
  <div class="ui-input">
    <input
      type="text"
      :name="name"
      :value="modelValue"
      :placeholder="placeholder"
      @input="(e) => { emit('update:modelValue', e.target.value); props.onInput?.(e); }"
      @blur="props.onBlur"
    />
    <p v-if="error" class="error">{{ error }}</p>
  </div>
</template>
