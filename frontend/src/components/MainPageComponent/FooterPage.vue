<script setup>

</script>

<template>
  <footer>
    <div class="center-buttons">
      <button>Button 1</button>
      <button>Button 2</button>
      <button>Button 3</button>
    </div>
    <button class="bottom-right-button">Separate Button</button>
  </footer>
</template>

<style scoped>
footer {
  position: fixed;
  bottom: 0;
  width: 100%;
  height: 7%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: var(--color-background);
}

.center-buttons {
  display: flex;
  justify-content: space-evenly;
  width: 50%;
}

.bottom-right-button {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
}
</style>
