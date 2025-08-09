<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  modelValue: [Number, String],
  name: String,
  placeholder: String,
  min: Number,
  max: Number,
  step: { type: Number, default: 1 },
  prefix: String,
  suffix: String,
  decimal: { type: Boolean, default: false },
  locale: { type: String, default: 'en-US' },
  error: String,
  onInput: Function,
  onBlur: Function
});

const emit = defineEmits(['update:modelValue']);

// hiển thị dạng format
const displayValue = ref('');

watch(
  () => props.modelValue,
  (val) => {
    displayValue.value = formatValue(val);
  },
  { immediate: true }
);

function formatValue(value) {
  if (value === null || value === undefined || value === '') return '';
  let num = Number(value);
  if (isNaN(num)) return '';
  return new Intl.NumberFormat(props.locale, {
    minimumFractionDigits: props.decimal ? 2 : 0,
    maximumFractionDigits: props.decimal ? 2 : 0
  }).format(num);
}

function parseValue(value) {
  if (!value) return '';
  let numeric = value.replace(/[^\d.,-]/g, '');
  let num = props.decimal
    ? parseFloat(numeric.replace(',', '.'))
    : parseInt(numeric, 10);
  if (isNaN(num)) return '';
  return num;
}

function handleInput(e) {
  const rawValue = e.target.value;
  const numValue = parseValue(rawValue);
  if (props.min !== undefined && numValue < props.min) return;
  if (props.max !== undefined && numValue > props.max) return;
  emit('update:modelValue', numValue);
  props.onInput?.(e);
}

function increment() {
  let val = Number(props.modelValue) || 0;
  val += props.step;
  if (props.max !== undefined && val > props.max) val = props.max;
  emit('update:modelValue', val);
}

function decrement() {
  let val = Number(props.modelValue) || 0;
  val -= props.step;
  if (props.min !== undefined && val < props.min) val = props.min;
  emit('update:modelValue', val);
}
</script>

<template>
  <div class="ui-input-number">
    <button type="button" class="btn-dec" @click="decrement">-</button>
    <input
      type="text"
      :name="name"
      :value="displayValue"
      :placeholder="placeholder"
      @input="handleInput"
      @blur="props.onBlur"
    />
    <button type="button" class="btn-inc" @click="increment">+</button>
    <span v-if="prefix" class="prefix">{{ prefix }}</span>
    <span v-if="suffix" class="suffix">{{ suffix }}</span>
    <p v-if="error" class="error">{{ error }}</p>
  </div>
</template>
