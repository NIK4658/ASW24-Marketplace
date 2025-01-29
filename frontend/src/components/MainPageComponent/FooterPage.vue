<script setup></script>

<template>
  <footer>
    <button class="icon-button">
      <img src="/footer/chat.ico" alt="Chat" />
    </button>
    <button class="icon-button">
      <img src="/footer/plus.ico" alt="Add post" />
    </button>
    <button class="icon-button">
      <img src="/footer/profile.ico" alt="Profile" />
    </button>
  </footer>
</template>

<style scoped>
footer {
  position: fixed;
  bottom: 0;
  width: 100%;
  height: 10%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: var(--color-background);
  transition: var(--transition-color);
}

.icon-button img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

button {
  width: 4rem;
  height: 4rem;
  border: none;
  margin: auto 10px;
  background-color: var(--color-border-hover);
  color: var(--color-text);
  cursor: pointer;
  transition: background-color 0.3s;
  border-radius: 15%;
}

button:hover {
  background-color: var(--color-border);
}

@media (max-width: 600px) {
  button {
    width: 3rem;
    height: 3rem;
  }
}
</style>
