<template>
  <label>
    <input
      type="color"
      class="color-picker"
      @input="$emit('colorChanged', $event.target.value)"
    />
  </label>
</template>

<script>
export default {
  props: {
    label: {
      type: String,
      default: "Choose a color",
    },
    modelValue: [String, Number],
  },
};
</script>

<style scoped>
.color-picker {
  margin-right: 10px;
  height: 60px;
  width: 80px;
  padding: 0;
  border: none;
  background: transparent;
  border-radius: 6px;
}
</style>
