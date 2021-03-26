<template>
  <v-btn icon elevation="6" @click="$vuetify.theme.dark = !$vuetify.theme.dark">
    <v-icon
      v-text="$vuetify.theme.dark ? 'mdi-brightness-5' : 'mdi-brightness-2'"
    />
  </v-btn>
</template>
